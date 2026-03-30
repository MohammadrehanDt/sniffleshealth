import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import type { LicenseAuditAction, LicenseStatus } from "@prisma/client";
import { PrismaService } from "../../prisma/prisma.service";
import { MailService } from "../mail/mail.service";
import type { VerifyDoctorDto } from "./dto/verify-doctor.dto";
import type { VerifyLicenseDto } from "./dto/verify-license.dto";

@Injectable()
export class AdminService {
  @Inject(PrismaService)
  private readonly prisma!: PrismaService;

  @Inject(MailService)
  private readonly mailService!: MailService;

  async getDashboardStats() {
    const today = new Date();
    const expiringSoon = new Date(today);
    expiringSoon.setDate(expiringSoon.getDate() + 60);

    const [pendingDoctors, pendingLicenses, expiringLicenses] =
      await Promise.all([
        this.prisma.user.count({
          where: {
            role: "DOCTOR",
            verificationStatus: "PENDING_VERIFICATION",
          },
        }),
        this.prisma.stateLicense.count({
          where: { status: "PENDING_REVIEW" },
        }),
        this.prisma.stateLicense.count({
          where: {
            status: "VERIFIED",
            expiryDate: { gte: today, lte: expiringSoon },
          },
        }),
      ]);

    return {
      pendingDoctors,
      pendingLicenses,
      expiringLicenses,
    };
  }

  async listDoctors(params: {
    page?: number;
    pageSize?: number;
    verificationStatus?: "PENDING_VERIFICATION" | "VERIFIED" | "REJECTED";
  }) {
    const page = Math.max(1, params.page ?? 1);
    const pageSize = Math.min(100, Math.max(1, params.pageSize ?? 20));
    const where = {
      role: "DOCTOR" as const,
      ...(params.verificationStatus
        ? { verificationStatus: params.verificationStatus }
        : {}),
    };

    const [total, doctors] = await Promise.all([
      this.prisma.user.count({ where }),
      this.prisma.user.findMany({
        where,
        orderBy: [{ createdAt: "desc" }],
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: {
          stateLicenses: {
            select: { status: true },
          },
        },
      }),
    ]);

    return {
      total,
      page,
      pageSize,
      doctors: doctors.map((doctor) => this.toDoctorListItem(doctor)),
    };
  }

  async getDoctorById(doctorId: string) {
    const doctor = await this.prisma.user.findFirst({
      where: { id: doctorId, role: "DOCTOR" },
      include: {
        stateLicenses: {
          orderBy: [{ status: "asc" }, { expiryDate: "asc" }],
        },
      },
    });

    if (!doctor) {
      throw new NotFoundException("Doctor not found");
    }

    return this.toDoctorDetail(doctor);
  }

  async verifyDoctor(adminId: string, doctorId: string, dto: VerifyDoctorDto) {
    const doctor = await this.prisma.user.findFirst({
      where: { id: doctorId, role: "DOCTOR" },
    });

    if (!doctor) {
      throw new NotFoundException("Doctor not found");
    }

    if (!doctor.passwordHash || !doctor.emailVerifiedAt) {
      throw new BadRequestException("Doctor has not completed account setup");
    }

    const isVerify = dto.action === "VERIFY";

    const updatedDoctor = await this.prisma.user.update({
      where: { id: doctorId },
      data: {
        verificationStatus: isVerify ? "VERIFIED" : "REJECTED",
        verificationNote: dto.note ?? null,
        verifiedAt: isVerify ? new Date() : null,
      },
    });

    if (isVerify) {
      await this.mailService.sendDoctorVerifiedEmail({ email: doctor.email });
    } else {
      await this.mailService.sendDoctorRejectedEmail({
        email: doctor.email,
        note: dto.note,
      });
    }

    return this.toDoctorVerificationResponse(updatedDoctor);
  }

  async listLicenses(params: {
    page?: number;
    pageSize?: number;
    status?: LicenseStatus;
  }) {
    const page = Math.max(1, params.page ?? 1);
    const pageSize = Math.min(100, Math.max(1, params.pageSize ?? 20));
    const where = params.status ? { status: params.status } : {};

    const [total, licenses] = await Promise.all([
      this.prisma.stateLicense.count({ where }),
      this.prisma.stateLicense.findMany({
        where,
        orderBy: [{ createdAt: "desc" }],
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: {
          doctor: {
            select: {
              id: true,
              fullName: true,
              email: true,
              npiNumber: true,
              phone: true,
              verificationStatus: true,
            },
          },
          verifiedByAdmin: {
            select: { id: true, fullName: true, email: true },
          },
        },
      }),
    ]);

    return {
      total,
      page,
      pageSize,
      licenses: licenses.map((license) => this.toLicenseSummary(license)),
    };
  }

  async getLicenseById(licenseId: string) {
    const license = await this.prisma.stateLicense.findUnique({
      where: { id: licenseId },
      include: {
        doctor: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phone: true,
            npiNumber: true,
            verificationStatus: true,
          },
        },
        verifiedByAdmin: {
          select: { id: true, fullName: true, email: true },
        },
        auditLogs: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!license) {
      throw new NotFoundException("License not found");
    }

    const performerIds = [
      ...new Set(
        license.auditLogs
          .map((log) => log.performedById)
          .filter((id): id is string => Boolean(id)),
      ),
    ];

    const performers = performerIds.length
      ? await this.prisma.user.findMany({
          where: { id: { in: performerIds } },
          select: { id: true, fullName: true, email: true },
        })
      : [];

    const performerMap = new Map(
      performers.map((user) => [user.id, user.fullName ?? user.email]),
    );

    return this.toLicenseDetail(license, performerMap);
  }

  async verifyLicense(
    adminId: string,
    licenseId: string,
    dto: VerifyLicenseDto,
  ) {
    const license = await this.prisma.stateLicense.findUnique({
      where: { id: licenseId },
      include: {
        doctor: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    });

    if (!license) {
      throw new NotFoundException("License not found");
    }

    const isVerify = dto.action === "VERIFY";
    const updatedLicense = await this.prisma.$transaction(async (tx) => {
      const nextLicense = await tx.stateLicense.update({
        where: { id: licenseId },
        data: {
          status: isVerify ? "VERIFIED" : "REJECTED",
          rejectionReason: isVerify ? null : (dto.rejectionReason ?? null),
          verifiedAt: isVerify ? new Date() : null,
          verifiedByAdminId: adminId,
          reminder60Sent: isVerify ? false : license.reminder60Sent,
          reminder30Sent: isVerify ? false : license.reminder30Sent,
        },
      });

      await tx.licenseAuditLog.create({
        data: {
          licenseId,
          action: (isVerify ? "VERIFIED" : "REJECTED") as LicenseAuditAction,
          performedById: adminId,
          note: isVerify
            ? `License approved for ${license.stateCode}`
            : (dto.rejectionReason ??
              `License rejected for ${license.stateCode}`),
        },
      });

      return nextLicense;
    });

    if (isVerify) {
      await this.mailService.sendLicenseVerifiedEmail({
        email: license.doctor.email,
        stateCode: license.stateCode,
      });
    } else {
      await this.mailService.sendLicenseRejectedEmail({
        email: license.doctor.email,
        stateCode: license.stateCode,
        reason: dto.rejectionReason,
      });
    }

    return updatedLicense;
  }

  private toDoctorListItem(doctor: {
    id: string;
    fullName: string | null;
    email: string;
    npiNumber: string | null;
    phone: string | null;
    verificationStatus: "PENDING_VERIFICATION" | "VERIFIED" | "REJECTED" | null;
    createdAt: Date;
    stateLicenses: Array<{ status: LicenseStatus }>;
  }) {
    return {
      id: doctor.id,
      fullName: doctor.fullName,
      email: doctor.email,
      npiNumber: doctor.npiNumber,
      phone: doctor.phone,
      verificationStatus: doctor.verificationStatus,
      createdAt: doctor.createdAt,
      licenseCounts: {
        verified: doctor.stateLicenses.filter((l) => l.status === "VERIFIED")
          .length,
        pending: doctor.stateLicenses.filter(
          (l) => l.status === "PENDING_REVIEW",
        ).length,
        expired: doctor.stateLicenses.filter((l) => l.status === "EXPIRED")
          .length,
      },
    };
  }

  private toDoctorDetail(doctor: {
    id: string;
    fullName: string | null;
    email: string;
    npiNumber: string | null;
    phone: string | null;
    verificationStatus: "PENDING_VERIFICATION" | "VERIFIED" | "REJECTED" | null;
    verificationNote: string | null;
    verifiedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
    stateLicenses: unknown[];
  }) {
    return {
      id: doctor.id,
      fullName: doctor.fullName,
      email: doctor.email,
      npiNumber: doctor.npiNumber,
      phone: doctor.phone,
      verificationStatus: doctor.verificationStatus,
      verificationNote: doctor.verificationNote,
      verifiedAt: doctor.verifiedAt,
      createdAt: doctor.createdAt,
      updatedAt: doctor.updatedAt,
      stateLicenses: doctor.stateLicenses,
    };
  }

  private toDoctorVerificationResponse(doctor: {
    id: string;
    verificationStatus: "PENDING_VERIFICATION" | "VERIFIED" | "REJECTED" | null;
    verificationNote: string | null;
    verifiedAt: Date | null;
  }) {
    return {
      id: doctor.id,
      verificationStatus: doctor.verificationStatus,
      verificationNote: doctor.verificationNote,
      verifiedAt: doctor.verifiedAt,
    };
  }

  private toLicenseSummary(license: {
    id: string;
    stateCode: string;
    licenseNumber: string;
    expiryDate: Date;
    obtainedDate: Date | null;
    certificateUrl: string | null;
    status: LicenseStatus;
    rejectionReason: string | null;
    verifiedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
    doctor: {
      id: string;
      fullName: string | null;
      email: string;
      npiNumber: string | null;
      phone: string | null;
      verificationStatus:
        | "PENDING_VERIFICATION"
        | "VERIFIED"
        | "REJECTED"
        | null;
    };
    verifiedByAdmin: {
      id: string;
      fullName: string | null;
      email: string;
    } | null;
  }) {
    return {
      id: license.id,
      stateCode: license.stateCode,
      licenseNumber: license.licenseNumber,
      expiryDate: license.expiryDate,
      obtainedDate: license.obtainedDate,
      certificateUrl: license.certificateUrl,
      status: license.status,
      rejectionReason: license.rejectionReason,
      verifiedAt: license.verifiedAt,
      createdAt: license.createdAt,
      updatedAt: license.updatedAt,
      doctor: license.doctor,
      verifiedByAdmin: license.verifiedByAdmin,
    };
  }

  private toLicenseDetail(
    license: {
      id: string;
      stateCode: string;
      licenseNumber: string;
      expiryDate: Date;
      obtainedDate: Date | null;
      certificateUrl: string | null;
      status: LicenseStatus;
      rejectionReason: string | null;
      verifiedAt: Date | null;
      createdAt: Date;
      updatedAt: Date;
      doctor: {
        id: string;
        fullName: string | null;
        email: string;
        phone: string | null;
        npiNumber: string | null;
        verificationStatus:
          | "PENDING_VERIFICATION"
          | "VERIFIED"
          | "REJECTED"
          | null;
      };
      verifiedByAdmin: {
        id: string;
        fullName: string | null;
        email: string;
      } | null;
      auditLogs: Array<{
        id: string;
        action: LicenseAuditAction;
        performedById: string | null;
        note: string | null;
        metadata: unknown;
        createdAt: Date;
      }>;
    },
    performerMap: Map<string, string>,
  ) {
    return {
      id: license.id,
      stateCode: license.stateCode,
      licenseNumber: license.licenseNumber,
      expiryDate: license.expiryDate,
      obtainedDate: license.obtainedDate,
      certificateUrl: license.certificateUrl,
      status: license.status,
      rejectionReason: license.rejectionReason,
      verifiedAt: license.verifiedAt,
      createdAt: license.createdAt,
      updatedAt: license.updatedAt,
      doctor: license.doctor,
      verifiedByAdmin: license.verifiedByAdmin,
      auditLogs: license.auditLogs.map((log) => ({
        id: log.id,
        action: log.action,
        performedById: log.performedById,
        performedByName: log.performedById
          ? (performerMap.get(log.performedById) ?? null)
          : null,
        note: log.note,
        metadata: log.metadata,
        createdAt: log.createdAt,
      })),
    };
  }
}
