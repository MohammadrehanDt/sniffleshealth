import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import type { AuthUser } from "@sniffles/types";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { Roles } from "../auth/decorators/roles.decorator";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { LicenseService } from "./license.service";
import { SubmitLicenseDto } from "./dto/submit-license.dto";
import { RenewLicenseDto } from "./dto/renew-license.dto";
import {
  certificateStorage,
  MAX_CERTIFICATE_SIZE,
} from "../../shared/upload.utils";

@Controller("licenses")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles("DOCTOR")
export class LicenseController {
  @Inject(LicenseService)
  private readonly licenseService!: LicenseService;

  @Get()
  async list(@CurrentUser() user: AuthUser) {
    const licenses = await this.licenseService.list(user.id);
    return { licenses };
  }

  @Post()
  async submit(@CurrentUser() user: AuthUser, @Body() dto: SubmitLicenseDto) {
    const license = await this.licenseService.submit(user.id, dto);
    return { license };
  }

  @Get("verified-states")
  async getVerifiedStates(@CurrentUser() user: AuthUser) {
    const states = await this.licenseService.getVerifiedStates(user.id);
    return { states };
  }

  @Get(":id")
  async getById(@CurrentUser() user: AuthUser, @Param("id") id: string) {
    const license = await this.licenseService.getById(user.id, id);
    return { license };
  }

  @Patch(":id/renew")
  async renew(
    @CurrentUser() user: AuthUser,
    @Param("id") id: string,
    @Body() dto: RenewLicenseDto,
  ) {
    const license = await this.licenseService.renew(user.id, id, dto);
    return { license };
  }

  @Post(":id/certificate")
  @UseInterceptors(
    FileInterceptor("certificate", {
      storage: certificateStorage,
      limits: { fileSize: MAX_CERTIFICATE_SIZE },
    }),
  )
  async uploadCertificate(
    @CurrentUser() user: AuthUser,
    @Param("id") id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException("Certificate file is required");
    }

    const certificateUrl = `/uploads/certificates/${file.filename}`;
    const license = await this.licenseService.uploadCertificate(
      user.id,
      id,
      certificateUrl,
    );
    return { license };
  }

  @Get(":id/audit-log")
  async getAuditLog(@CurrentUser() user: AuthUser, @Param("id") id: string) {
    const logs = await this.licenseService.getAuditLog(user.id, id);
    return { logs };
  }
}
