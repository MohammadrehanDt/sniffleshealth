import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { PrismaModule } from "../prisma/prisma.module";
import { AuthModule } from "./auth/auth.module";
import { HealthModule } from "./health/health.module";
import { PhysicianModule } from "./physician/physician.module";
import { envSchema } from "../shared/env.schema";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [".env", "../../.env"],
      validate: (config) => envSchema.parse(config),
    }),
    PrismaModule,
    AuthModule,
    HealthModule,
    PhysicianModule,
  ],
})
export class AppModule {}
