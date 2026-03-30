import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { PrismaModule } from "../../prisma/prisma.module";
import { HealthieService } from "./healthie.service";

@Module({
  imports: [ConfigModule, PrismaModule],
  providers: [HealthieService],
  exports: [HealthieService],
})
export class HealthieModule {}
