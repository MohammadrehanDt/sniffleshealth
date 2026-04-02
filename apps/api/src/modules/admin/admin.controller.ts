import {
  Controller,
  Get,
  Inject,
  Param,
  Patch,
  Query,
  Body,
  UseGuards,
} from "@nestjs/common";
import type { AuthUser } from "@sniffles/types";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { Roles } from "../auth/decorators/roles.decorator";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { AdminService } from "./admin.service";
import { VerifyDoctorDto } from "./dto/verify-doctor.dto";
import { VerifyLicenseDto } from "./dto/verify-license.dto";

@Controller("admin")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles("ADMIN")
export class AdminController {
  @Inject(AdminService)
  private readonly adminService!: AdminService;

  @Get("dashboard/stats")
  async getDashboardStats() {
    return this.adminService.getDashboardStats();
  }

  @Get("doctors")
  async listDoctors(
    @Query("page") page?: string,
    @Query("pageSize") pageSize?: string,
    @Query("verificationStatus")
    verificationStatus?: "PENDING_VERIFICATION" | "VERIFIED" | "REJECTED",
  ) {
    return this.adminService.listDoctors({
      page: page ? Number(page) : undefined,
      pageSize: pageSize ? Number(pageSize) : undefined,
      verificationStatus,
    });
  }

  @Get("doctors/:id")
  async getDoctorById(@Param("id") id: string) {
    return this.adminService.getDoctorById(id);
  }

  @Patch("doctors/:id/verify")
  async verifyDoctor(
    @CurrentUser() user: AuthUser,
    @Param("id") id: string,
    @Body() dto: VerifyDoctorDto,
  ) {
    return this.adminService.verifyDoctor(user.id, id, dto);
  }

  @Get("licenses")
  async listLicenses(
    @Query("page") page?: string,
    @Query("pageSize") pageSize?: string,
    @Query("status")
    status?: "PENDING_REVIEW" | "VERIFIED" | "REJECTED" | "EXPIRED",
  ) {
    return this.adminService.listLicenses({
      page: page ? Number(page) : undefined,
      pageSize: pageSize ? Number(pageSize) : undefined,
      status,
    });
  }

  @Get("licenses/:id")
  async getLicenseById(@Param("id") id: string) {
    return this.adminService.getLicenseById(id);
  }

  @Patch("licenses/:id/verify")
  async verifyLicense(
    @CurrentUser() user: AuthUser,
    @Param("id") id: string,
    @Body() dto: VerifyLicenseDto,
  ) {
    return this.adminService.verifyLicense(user.id, id, dto);
  }
}
