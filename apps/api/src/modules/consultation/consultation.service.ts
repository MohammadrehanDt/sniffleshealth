import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import type { Consultation, Prisma } from "@prisma/client";
import { PrismaService } from "../../prisma/prisma.service";
import { HealthieService } from "../healthie/healthie.service";
import type { SubmitConsultationDto } from "./dto/submit-consultation.dto";

@Injectable()
export class ConsultationService {
  @Inject(PrismaService)
  private readonly prisma!: PrismaService;

  @Inject(HealthieService)
  private readonly healthieService!: HealthieService;

  // ── Consultation submission ───────────────────────────────────

  async submit(
    patientId: string,
    dto: SubmitConsultationDto,
  ): Promise<{
    consultation: Consultation;
    payment: {
      requestedPaymentId: string;
      invoiceId: string | null;
      amount: string | null;
      status: string | null;
      currency: string | null;
      createdAt: string | null;
    };
  }> {
    const user = await this.prisma.user.findUnique({
      where: { id: patientId },
      select: {
        id: true,
        email: true,
        fullName: true,
        healthiePatientId: true,
      },
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    const payment = await this.healthieService.createRequestedPayment({
      userId: user.id,
      email: user.email,
      fullName: user.fullName,
      healthiePatientId: user.healthiePatientId,
      offeringId: dto.offeringId,
      serviceDescription: this.getConsultationDescription(dto.consultationType),
      notes: `Sniffles intake consultation for ${dto.firstName} ${dto.lastName}`,
    });

    const consultation = await this.prisma.consultation.create({
      data: {
        patientId,
        healthieRequestedPaymentId: payment.id,
        paymentStatus: payment.status,
        paymentAmount: payment.price,
        firstName: dto.firstName,
        lastName: dto.lastName,
        state: dto.state,
        dob: dto.dob,
        gender: dto.gender,
        severity: dto.severity,
        consultationType: dto.consultationType,
        symptoms: dto.symptoms as Prisma.InputJsonValue,
        followUp: dto.followUp as Prisma.InputJsonValue,
        vitals: dto.vitals as Prisma.InputJsonValue,
        medicalHistory: dto.medicalHistory as Prisma.InputJsonValue,
        surgicalHistory: dto.surgicalHistory as Prisma.InputJsonValue,
        allergies: dto.allergies as Prisma.InputJsonValue,
        medications: (dto.medications ?? {}) as Prisma.InputJsonValue,
        socialHistory: dto.socialHistory as Prisma.InputJsonValue,
      },
    });

    return {
      consultation,
      payment: {
        requestedPaymentId: payment.id,
        invoiceId: payment.invoice_id,
        amount: payment.price,
        status: payment.status,
        currency: payment.currency,
        createdAt: payment.created_at,
      },
    };
  }

  async getPricing(): Promise<
    Array<{
      id: string;
      title: string;
      price: string;
      currency: string;
      billingFrequency: string | null;
      initialPaymentAmount: string | null;
      initialPriceWithTaxes: string | null;
      wait: string;
    }>
  > {
    return this.healthieService.getConsultationOfferings();
  }

  // ── Read operations ───────────────────────────────────────────

  async getByPatient(patientId: string): Promise<Consultation[]> {
    return this.prisma.consultation.findMany({
      where: { patientId },
      orderBy: { createdAt: "desc" },
    });
  }

  async getById(id: string): Promise<Consultation | null> {
    return this.prisma.consultation.findUnique({
      where: { id },
      include: { patient: true, doctor: true },
    });
  }

  private getConsultationDescription(consultationType: string): string {
    return consultationType;
  }
}
