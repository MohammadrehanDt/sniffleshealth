import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
  Inject,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { UserRole } from "@prisma/client";
import { compare, hash } from "bcryptjs";
import { createHash, randomBytes } from "node:crypto";
import type { AuthUser, OtpChallengeResponse } from "@sniffles/types";
import { PrismaService } from "../../prisma/prisma.service";
import type { CompleteSignupDto } from "./dto/complete-signup.dto";
import type { LoginDto } from "./dto/login.dto";
import type { RegisterDto } from "./dto/register.dto";
import type { RequestOtpDto } from "./dto/request-otp.dto";
import type { VerifyOtpDto } from "./dto/verify-otp.dto";
import type { ForgotPasswordDto } from "./dto/forgot-password.dto";
import type { ResetPasswordDto } from "./dto/reset-password.dto";
import type { JwtPayload } from "./interfaces/jwt-payload.interface";
import { HealthieService } from "../healthie/healthie.service";
import { MailService } from "../mail/mail.service";

export interface InternalAuthResult {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
}

export interface PendingVerificationResult {
  pendingVerification: true;
  message: string;
}

export type RegisterResult = InternalAuthResult | PendingVerificationResult;

export interface InternalTokenPair {
  accessToken: string;
  refreshToken: string;
}

const OTP_TTL_MINUTES = 10;
const RESET_PASSWORD_TTL_MINUTES = 10;

@Injectable()
export class AuthService {
  @Inject(PrismaService)
  private readonly prisma!: PrismaService;

  @Inject(JwtService)
  private readonly jwtService!: JwtService;

  @Inject(ConfigService)
  private readonly configService!: ConfigService;

  @Inject(MailService)
  private readonly mailService!: MailService;

  @Inject(HealthieService)
  private readonly healthieService!: HealthieService;

  async register(dto: RegisterDto): Promise<RegisterResult> {
    const email = this.normalizeEmail(dto.email);
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException("Email already exists");
    }

    const passwordHash = await hash(dto.password, 10);
    const isDoctor = dto.role === "DOCTOR";

    const user = await this.prisma.user.create({
      data: {
        email,
        passwordHash,
        fullName: dto.fullName,
        role: dto.role as UserRole,
        npiNumber: dto.npiNumber,
        phone: dto.phone,
        healthieProviderId: isDoctor ? dto.healthieProviderId : undefined,
        emailVerifiedAt: new Date(),
        verificationStatus: isDoctor ? "PENDING_VERIFICATION" : undefined,
      },
    });

    if (isDoctor) {
      return {
        pendingVerification: true,
        message:
          "Your account has been submitted for verification. You will receive an email once approved by our admin team.",
      };
    }

    this.syncHealthiePatient(user);

    return this.issueToken(user);
  }

  async requestOtp(dto: RequestOtpDto): Promise<OtpChallengeResponse> {
    const email = this.normalizeEmail(dto.email);
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser?.passwordHash && existingUser.emailVerifiedAt) {
      throw new ConflictException("Account already exists. Please log in");
    }

    const otpCode = this.generateOtp();
    const otpExpiresAt = new Date(Date.now() + OTP_TTL_MINUTES * 60 * 1000);

    await this.prisma.user.upsert({
      where: { email },
      update: {
        role: existingUser?.role ?? (dto.role as UserRole),
        fullName: dto.fullName ?? existingUser?.fullName ?? null,
        npiNumber:
          dto.role === "DOCTOR"
            ? (dto.npiNumber ?? existingUser?.npiNumber ?? null)
            : null,
        phone:
          dto.role === "DOCTOR"
            ? (dto.phone ?? existingUser?.phone ?? null)
            : null,
        verificationStatus:
          dto.role === "DOCTOR"
            ? (existingUser?.verificationStatus ?? "PENDING_VERIFICATION")
            : null,
        otpCode,
        otpExpiresAt,
      },
      create: {
        email,
        role: dto.role as UserRole,
        fullName: dto.fullName ?? null,
        npiNumber: dto.role === "DOCTOR" ? (dto.npiNumber ?? null) : null,
        phone: dto.role === "DOCTOR" ? (dto.phone ?? null) : null,
        verificationStatus:
          dto.role === "DOCTOR" ? "PENDING_VERIFICATION" : null,
        otpCode,
        otpExpiresAt,
      },
    });

    return {
      email,
      role: dto.role,
      expiresInMinutes: OTP_TTL_MINUTES,
      otpCode: process.env.NODE_ENV !== "production" ? otpCode : undefined,
    };
  }

  async verifyOtp(dto: VerifyOtpDto) {
    const user = await this.requireUser(dto.email);
    this.ensureValidOtp(user.otpCode, user.otpExpiresAt, dto.otp);

    return {
      email: user.email,
      verified: true,
      role: user.role,
    };
  }

  async completeSignup(dto: CompleteSignupDto): Promise<RegisterResult> {
    const user = await this.requireUser(dto.email);

    if (user.passwordHash && user.emailVerifiedAt) {
      throw new ConflictException("Account already exists. Please log in");
    }

    this.ensureValidOtp(user.otpCode, user.otpExpiresAt, dto.otp);

    const passwordHash = await hash(dto.password, 10);
    const isDoctor = user.role === UserRole.DOCTOR;

    if (
      isDoctor &&
      (!(dto.npiNumber ?? user.npiNumber) || !(dto.phone ?? user.phone))
    ) {
      throw new BadRequestException(
        "Doctor signup requires NPI number and phone number",
      );
    }

    const updatedUser = await this.prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash,
        otpCode: null,
        otpExpiresAt: null,
        emailVerifiedAt: new Date(),
        npiNumber: dto.npiNumber ?? user.npiNumber ?? undefined,
        phone: dto.phone ?? user.phone ?? undefined,
        verificationStatus: isDoctor ? "PENDING_VERIFICATION" : undefined,
      },
    });

    if (isDoctor) {
      return {
        pendingVerification: true,
        message:
          "Your account has been submitted for verification. You will receive an email once approved by our admin team.",
      };
    }

    this.syncHealthiePatient(updatedUser);

    return this.issueToken(updatedUser);
  }

  async login(dto: LoginDto): Promise<InternalAuthResult> {
    const user = await this.requireUser(dto.email);

    if (!user.passwordHash) {
      throw new UnauthorizedException("Account setup is incomplete");
    }

    if (!user.emailVerifiedAt) {
      throw new UnauthorizedException("Email is not verified");
    }

    const isValid = await compare(dto.password, user.passwordHash);
    if (!isValid) {
      throw new UnauthorizedException("Invalid email or password");
    }

    if (user.role === UserRole.DOCTOR) {
      if (user.verificationStatus === "PENDING_VERIFICATION") {
        throw new UnauthorizedException(
          "Your account is pending admin verification. You will receive an email once approved.",
        );
      }
      if (user.verificationStatus === "REJECTED") {
        throw new UnauthorizedException(
          "Your registration has been declined. Please contact support.",
        );
      }
    }

    if (user.role === UserRole.PATIENT && !user.healthiePatientId) {
      this.syncHealthiePatient(user);
    }
    return this.issueToken(user);
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    const email = this.normalizeEmail(dto.email);
    const genericResponse = {
      email,
      expiresInMinutes: RESET_PASSWORD_TTL_MINUTES,
      message:
        "If an account exists for this email, a reset link has been sent.",
    };

    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.passwordHash || !user.emailVerifiedAt) {
      return genericResponse;
    }

    const resetToken = randomBytes(32).toString("hex");
    const resetPasswordTokenExpiresAt = new Date(
      Date.now() + RESET_PASSWORD_TTL_MINUTES * 60 * 1000,
    );

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        resetPasswordTokenHash: this.hashResetToken(resetToken),
        resetPasswordTokenExpiresAt,
      },
    });

    const webUrl = this.configService
      .get<string>("WEB_URL", "http://localhost:5173")
      .replace(/\/+$/, "");
    const resetLink = `${webUrl}/reset-password?token=${resetToken}`;

    await this.mailService.sendPasswordResetEmail({
      email,
      resetLink,
      expiresInMinutes: RESET_PASSWORD_TTL_MINUTES,
    });

    return genericResponse;
  }

  async resetPassword(dto: ResetPasswordDto) {
    const tokenHash = this.hashResetToken(dto.token);
    const user = await this.prisma.user.findFirst({
      where: {
        resetPasswordTokenHash: tokenHash,
      },
    });

    if (!user || !user.resetPasswordTokenExpiresAt) {
      throw new BadRequestException("This password reset link is invalid");
    }

    if (user.resetPasswordTokenExpiresAt.getTime() < Date.now()) {
      throw new BadRequestException("This password reset link has expired");
    }

    const passwordHash = await hash(dto.password, 10);

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash,
        resetPasswordTokenHash: null,
        resetPasswordTokenExpiresAt: null,
      },
    });

    await this.mailService.sendPasswordResetConfirmationEmail(user.email);

    return {
      success: true,
      message:
        "Password reset successful. Please use your new password to log in.",
    };
  }

  async refresh(refreshToken: string): Promise<InternalTokenPair> {
    try {
      const payload = await this.jwtService.verifyAsync<
        JwtPayload & { type?: string }
      >(refreshToken);

      if (payload.type !== "refresh") {
        throw new UnauthorizedException("Invalid token type");
      }

      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });
      if (!user) {
        throw new UnauthorizedException("User not found");
      }

      const tokens = await this.generateTokenPair({
        sub: user.id,
        email: user.email,
        role: user.role,
      });

      return tokens;
    } catch {
      throw new UnauthorizedException("Invalid or expired refresh token");
    }
  }

  async me(userId: string): Promise<AuthUser> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new UnauthorizedException("User not found");
    }

    return this.toAuthUser(user);
  }

  private async requireUser(email: string) {
    const normalizedEmail = this.normalizeEmail(email);
    const user = await this.prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      throw new BadRequestException("No signup request found for this email");
    }

    return user;
  }

  private ensureValidOtp(
    otpCode: string | null,
    otpExpiresAt: Date | null,
    input: string,
  ) {
    if (!otpCode || !otpExpiresAt) {
      throw new BadRequestException("No OTP challenge is active");
    }

    if (otpExpiresAt.getTime() < Date.now()) {
      throw new BadRequestException("OTP has expired");
    }

    if (otpCode !== input) {
      throw new BadRequestException("Invalid OTP");
    }
  }

  private async issueToken(user: {
    id: string;
    email: string;
    role: UserRole;
    fullName: string | null;
    healthiePatientId?: string | null;
    healthieProviderId?: string | null;
    emailVerifiedAt: Date | null;
    phone?: string | null;
    dateOfBirth?: Date | null;
    weight?: number | null;
    weightUnit?: string | null;
    height?: number | null;
    heightUnit?: string | null;
    avatarUrl?: string | null;
  }): Promise<InternalAuthResult> {
    const basePayload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const { accessToken, refreshToken } =
      await this.generateTokenPair(basePayload);

    return {
      accessToken,
      refreshToken,
      user: this.toAuthUser(user),
    };
  }

  private async generateTokenPair(
    payload: JwtPayload,
  ): Promise<InternalTokenPair> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { ...payload, type: "access" },
        { expiresIn: "15m" },
      ),
      this.jwtService.signAsync(
        { ...payload, type: "refresh" },
        { expiresIn: "7d" },
      ),
    ]);

    return { accessToken, refreshToken };
  }

  private toAuthUser(user: {
    id: string;
    email: string;
    role: UserRole;
    fullName: string | null;
    healthiePatientId?: string | null;
    healthieProviderId?: string | null;
    emailVerifiedAt: Date | null;
    phone?: string | null;
    dateOfBirth?: Date | null;
    weight?: number | null;
    weightUnit?: string | null;
    height?: number | null;
    heightUnit?: string | null;
    avatarUrl?: string | null;
    verificationStatus?: string | null;
    npiNumber?: string | null;
  }): AuthUser {
    return {
      id: user.id,
      email: user.email,
      role: user.role,
      fullName: user.fullName,
      healthiePatientId: user.healthiePatientId ?? null,
      healthieProviderId: user.healthieProviderId ?? null,
      emailVerified: Boolean(user.emailVerifiedAt),
      phone: user.phone ?? null,
      dateOfBirth: user.dateOfBirth?.toISOString() ?? null,
      weight: user.weight ?? null,
      weightUnit: user.weightUnit ?? null,
      height: user.height ?? null,
      heightUnit: user.heightUnit ?? null,
      avatarUrl: user.avatarUrl ?? null,
      verificationStatus:
        (user.verificationStatus as AuthUser["verificationStatus"]) ?? null,
      npiNumber: user.npiNumber ?? null,
    };
  }

  private generateOtp() {
    return String(Math.floor(100000 + Math.random() * 900000));
  }

  private hashResetToken(token: string) {
    return createHash("sha256").update(token).digest("hex");
  }

  private syncHealthiePatient(user: {
    id: string;
    email: string;
    fullName: string | null;
    role: UserRole;
  }) {
    if (user.role !== UserRole.PATIENT) {
      return;
    }

    this.healthieService
      .createPatientForUser(user.id, user.email, user.fullName)
      .catch(() => {});
  }

  private normalizeEmail(email: string) {
    return email.toLowerCase().trim();
  }
}
