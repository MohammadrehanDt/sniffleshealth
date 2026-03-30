import { Module } from "@nestjs/common";
import { ScheduleModule } from "@nestjs/schedule";
import { PrismaModule } from "../../prisma/prisma.module";
import { MailModule } from "../mail/mail.module";
import { LicenseCronService } from "./license-cron.service";

@Module({
  imports: [ScheduleModule.forRoot(), PrismaModule, MailModule],
  providers: [LicenseCronService],
  exports: [LicenseCronService],
})
export class SchedulerModule {}
