import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { PhysicianController } from "./physician.controller";

@Module({
  imports: [AuthModule],
  controllers: [PhysicianController],
})
export class PhysicianModule {}
