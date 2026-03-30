import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  UseGuards,
} from "@nestjs/common";
import type { AuthUser } from "@sniffles/types";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { ConsultationService } from "./consultation.service";
import { SubmitConsultationDto } from "./dto/submit-consultation.dto";

@Controller("consultation")
export class ConsultationController {
  @Inject(ConsultationService)
  private readonly consultationService!: ConsultationService;

  @Get("pricing")
  async getPricing() {
    const pricing = await this.consultationService.getPricing();
    return { pricing };
  }

  @Post("submit")
  @UseGuards(JwtAuthGuard)
  async submit(
    @CurrentUser() user: AuthUser,
    @Body() dto: SubmitConsultationDto,
  ) {
    return this.consultationService.submit(user.id, dto);
  }

  @Get("mine")
  @UseGuards(JwtAuthGuard)
  async getMyConsultations(@CurrentUser() user: AuthUser) {
    const consultations = await this.consultationService.getByPatient(user.id);
    return { consultations };
  }

  @Get(":id")
  @UseGuards(JwtAuthGuard)
  async getById(@Param("id") id: string) {
    const consultation = await this.consultationService.getById(id);
    return { consultation };
  }
}
