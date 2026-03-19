import { Module } from "@nestjs/common";
import { PhysicianController } from "./physician.controller";

@Module({
  controllers: [PhysicianController],
})
export class PhysicianModule {}
