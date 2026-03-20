import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
  Inject,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserRole } from "@prisma/client";
import { compare, hash } from "bcryptjs";
import type {
  AuthResponse,
  AuthUser,
  OtpChallengeResponse,
} from "@sniffles/types";
import { PrismaService } from "../../prisma/prisma.service";
import type { CompleteSignupDto } from "./dto/complete-signup.dto";
import type { LoginDto } from "./dto/login.dto";
import type { RegisterDto } from "./dto/register.dto";
import type { RequestOtpDto } from "./dto/request-otp.dto";
import type { VerifyOtpDto } from "./dto/verify-otp.dto";
import type { JwtPayload } from "./interfaces/jwt-payload.interface";

const OTP_TTL_MINUTES = 10;

@Injectable()
export class AuthService {
  @Inject(PrismaService)
  private readonly prisma!: PrismaService;

  @Inject(JwtService)
  private readonly jwtService!: JwtService;

  async register(dto: RegisterDto): Promise<AuthResponse> {
    const email = this.normalizeEmail(dto.email);
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException("Email already exists");
    }

    const passwordHash = await hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        email,
        passwordHash,
        fullName: dto.fullName,
        role: dto.role as UserRole,
        npiNumber: dto.npiNumber,
        emailVerifiedAt: new Date(),
      },
    });

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
        otpCode,
        otpExpiresAt,
      },
      create: {
        email,
        role: dto.role as UserRole,
        fullName: dto.fullName ?? null,
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

  async completeSignup(dto: CompleteSignupDto): Promise<AuthResponse> {
    const user = await this.requireUser(dto.email);

    if (user.passwordHash && user.emailVerifiedAt) {
      throw new ConflictException("Account already exists. Please log in");
    }

    this.ensureValidOtp(user.otpCode, user.otpExpiresAt, dto.otp);

    const passwordHash = await hash(dto.password, 10);

    const updatedUser = await this.prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash,
        otpCode: null,
        otpExpiresAt: null,
        emailVerifiedAt: new Date(),
      },
    });

    return this.issueToken(updatedUser);
  }

  async login(dto: LoginDto): Promise<AuthResponse> {
    const user = await this.requireUser(dto.email);

    if (user.role !== (dto.role as UserRole)) {
      throw new UnauthorizedException("Invalid email or password");
    }

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

    return this.issueToken(user);
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
    emailVerifiedAt: Date | null;
  }): Promise<AuthResponse> {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = await this.jwtService.signAsync(payload);

    return {
      accessToken,
      user: this.toAuthUser(user),
    };
  }

  private toAuthUser(user: {
    id: string;
    email: string;
    role: UserRole;
    fullName: string | null;
    emailVerifiedAt: Date | null;
  }): AuthUser {
    return {
      id: user.id,
      email: user.email,
      role: user.role,
      fullName: user.fullName,
      emailVerified: Boolean(user.emailVerifiedAt),
    };
  }

  private generateOtp() {
    return String(Math.floor(100000 + Math.random() * 900000));
  }

  private normalizeEmail(email: string) {
    return email.toLowerCase().trim();
  }
}
