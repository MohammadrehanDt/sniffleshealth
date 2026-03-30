import { Inject, Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { PrismaService } from "../../prisma/prisma.service";
import { MailService } from "../mail/mail.service";

@Injectable()
export class LicenseCronService {
  private readonly logger = new Logger(LicenseCronService.name);

  @Inject(PrismaService)
  private readonly prisma!: PrismaService;

  @Inject(MailService)
  private readonly mailService!: MailService;

  @Cron(CronExpression.EVERY_DAY_AT_6AM)
  async handleDailyLicenseChecks() {
    await this.sendReminder(60);
    await this.sendReminder(30);
    await this.expireLicenses();
  }

  async sendReminder(daysRemaining: 60 | 30) {
    const now = new Date();
    const rangeStart = new Date(now);
    rangeStart.setDate(rangeStart.getDate() + daysRemaining - 1);
    rangeStart.setHours(0, 0, 0, 0);

    const rangeEnd = new Date(now);
    rangeEnd.setDate(rangeEnd.getDate() + daysRemaining + 1);
    rangeEnd.setHours(23, 59, 59, 999);

    const reminderField =
      daysRemaining === 60 ? "reminder60Sent" : "reminder30Sent";
    const action =
      daysRemaining === 60 ? "REMINDER_60_DAYS" : "REMINDER_30_DAYS";

    const licenses = await this.prisma.stateLicense.findMany({
      where: {
        status: "VERIFIED",
        expiryDate: { gte: rangeStart, lte: rangeEnd },
        [reminderField]: false,
      },
      include: {
        doctor: {
          select: { email: true },
        },
      },
    });

    for (const license of licenses) {
      await this.mailService.sendLicenseExpiryReminderEmail({
        email: license.doctor.email,
        stateCode: license.stateCode,
        expiryDate: license.expiryDate,
        daysRemaining,
      });

      await this.prisma.$transaction([
        this.prisma.stateLicense.update({
          where: { id: license.id },
          data: {
            [reminderField]: true,
          },
        }),
        this.prisma.licenseAuditLog.create({
          data: {
            licenseId: license.id,
            action,
            note: `${daysRemaining}-day expiry reminder sent`,
          },
        }),
      ]);
    }

    if (licenses.length > 0) {
      this.logger.log(`Sent ${licenses.length} ${daysRemaining}-day reminders`);
    }
  }

  async expireLicenses() {
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    const licenses = await this.prisma.stateLicense.findMany({
      where: {
        status: "VERIFIED",
        expiryDate: { lt: now },
      },
      include: {
        doctor: {
          select: { email: true },
        },
      },
    });

    for (const license of licenses) {
      await this.mailService.sendLicenseExpiredEmail({
        email: license.doctor.email,
        stateCode: license.stateCode,
      });

      await this.prisma.$transaction([
        this.prisma.stateLicense.update({
          where: { id: license.id },
          data: { status: "EXPIRED" },
        }),
        this.prisma.licenseAuditLog.create({
          data: {
            licenseId: license.id,
            action: "EXPIRED_AUTO",
            note: "License expired automatically after passing expiry date",
          },
        }),
      ]);
    }

    if (licenses.length > 0) {
      this.logger.log(`Expired ${licenses.length} licenses`);
    }
  }
}
