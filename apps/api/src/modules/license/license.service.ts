import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import type { StateLicense } from "@prisma/client";
import { PrismaService } from "../../prisma/prisma.service";
import type { SubmitLicenseDto } from "./dto/submit-license.dto";
import type { RenewLicenseDto } from "./dto/renew-license.dto";

@Injectable()
export class LicenseService {
  @Inject(PrismaService)
  private readonly prisma!: PrismaService;

  async list(doctorId: string): Promise<StateLicense[]> {
    return this.prisma.stateLicense.findMany({
      where: { doctorId },
      orderBy: { createdAt: "desc" },
    });
  }

  async getById(doctorId: string, licenseId: string): Promise<StateLicense> {
    const license = await this.prisma.stateLicense.findUnique({
      where: { id: licenseId },
    });

    if (!license || license.doctorId !== doctorId) {
      throw new NotFoundException("License not found");
    }

    return license;
  }

  async submit(doctorId: string, dto: SubmitLicenseDto): Promise<StateLicense> {
    const stateCode = dto.stateCode.toUpperCase();

    const existing = await this.prisma.stateLicense.findUnique({
      where: { doctorId_stateCode: { doctorId, stateCode } },
    });

    if (existing) {
      throw new ConflictException(
        `You already have a license for ${stateCode}. Use renewal to update it.`,
      );
    }

    const { license } = await this.prisma.$transaction(async (tx) => {
      const createdLicense = await tx.stateLicense.create({
        data: {
          doctorId,
          stateCode,
          licenseNumber: dto.licenseNumber,
          expiryDate: new Date(dto.expiryDate),
          obtainedDate: dto.obtainedDate ? new Date(dto.obtainedDate) : null,
        },
      });

      await tx.licenseAuditLog.create({
        data: {
          licenseId: createdLicense.id,
          action: "SUBMITTED",
          performedById: doctorId,
          note: `License submitted for ${stateCode}`,
        },
      });

      return { license: createdLicense };
    });

    return license;
  }

  async renew(
    doctorId: string,
    licenseId: string,
    dto: RenewLicenseDto,
  ): Promise<StateLicense> {
    const license = await this.getById(doctorId, licenseId);

    if (license.status === "PENDING_REVIEW") {
      throw new BadRequestException(
        "License is already pending review. Please wait for admin verification.",
      );
    }

    const oldExpiryDate = license.expiryDate.toISOString();

    const { updatedLicense } = await this.prisma.$transaction(async (tx) => {
      const nextLicense = await tx.stateLicense.update({
        where: { id: licenseId },
        data: {
          expiryDate: new Date(dto.expiryDate),
          status: "PENDING_REVIEW",
          rejectionReason: null,
          verifiedAt: null,
          verifiedByAdminId: null,
          reminder60Sent: false,
          reminder30Sent: false,
        },
      });

      await tx.licenseAuditLog.create({
        data: {
          licenseId: license.id,
          action: "RENEWAL_SUBMITTED",
          performedById: doctorId,
          note: `License renewed. Old expiry: ${oldExpiryDate}`,
          metadata: { oldExpiryDate, newExpiryDate: dto.expiryDate },
        },
      });

      return { updatedLicense: nextLicense };
    });

    return updatedLicense;
  }

  async uploadCertificate(
    doctorId: string,
    licenseId: string,
    certificateUrl: string,
  ): Promise<StateLicense> {
    const license = await this.getById(doctorId, licenseId);

    return this.prisma.stateLicense.update({
      where: { id: license.id },
      data: { certificateUrl },
    });
  }

  async getAuditLog(doctorId: string, licenseId: string) {
    // Verify ownership
    await this.getById(doctorId, licenseId);

    return this.prisma.licenseAuditLog.findMany({
      where: { licenseId },
      orderBy: { createdAt: "desc" },
    });
  }

  async getVerifiedStates(doctorId: string): Promise<string[]> {
    const licenses = await this.prisma.stateLicense.findMany({
      where: {
        doctorId,
        status: "VERIFIED",
        expiryDate: { gt: new Date() },
      },
      select: { stateCode: true },
    });

    return licenses.map((l) => l.stateCode);
  }

  async canDoctorServiceState(
    doctorId: string,
    stateCode: string,
  ): Promise<boolean> {
    const license = await this.prisma.stateLicense.findFirst({
      where: {
        doctorId,
        stateCode: stateCode.toUpperCase(),
        status: "VERIFIED",
        expiryDate: { gt: new Date() },
      },
    });

    return Boolean(license);
  }
}
