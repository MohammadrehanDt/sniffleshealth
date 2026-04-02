import { Module } from "@nestjs/common";
import { PrismaModule } from "../../prisma/prisma.module";
import { AuthModule } from "../auth/auth.module";
import { LicenseController } from "./license.controller";
import { LicenseService } from "./license.service";

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [LicenseController],
  providers: [LicenseService],
  exports: [LicenseService],
})
export class LicenseModule {}
