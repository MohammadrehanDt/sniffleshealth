import { Controller, Get, UseGuards } from "@nestjs/common";
import { Roles } from "../auth/decorators/roles.decorator";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";

@Controller("physician")
@UseGuards(JwtAuthGuard, RolesGuard)
export class PhysicianController {
  @Get("dashboard")
  @Roles("DOCTOR")
  getDashboard() {
    return {
      role: "DOCTOR",
      message: "Physician access granted",
    };
  }
}
