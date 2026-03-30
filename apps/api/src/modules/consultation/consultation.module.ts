import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { HealthieModule } from "../healthie/healthie.module";
import { ConsultationController } from "./consultation.controller";
import { ConsultationService } from "./consultation.service";

@Module({
  imports: [AuthModule, HealthieModule],
  controllers: [ConsultationController],
  providers: [ConsultationService],
})
export class ConsultationModule {}
