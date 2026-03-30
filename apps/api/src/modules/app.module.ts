import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { PrismaModule } from "../prisma/prisma.module";
import { AuthModule } from "./auth/auth.module";
import { HealthModule } from "./health/health.module";
import { PhysicianModule } from "./physician/physician.module";
import { UserModule } from "./user/user.module";
import { HealthieModule } from "./healthie/healthie.module";
import { ConsultationModule } from "./consultation/consultation.module";
import { MailModule } from "./mail/mail.module";
import { LicenseModule } from "./license/license.module";
import { AdminModule } from "./admin/admin.module";
import { SchedulerModule } from "./scheduler/scheduler.module";
import { envSchema } from "../shared/env.schema";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [".env", "../../.env"],
      validate: (config) => envSchema.parse(config),
    }),
    PrismaModule,
    MailModule,
    AuthModule,
    HealthModule,
    PhysicianModule,
    UserModule,
    HealthieModule,
    ConsultationModule,
    LicenseModule,
    AdminModule,
    SchedulerModule,
  ],
})
export class AppModule {}
