import {
  IsArray,
  IsInt,
  IsObject,
  IsOptional,
  IsString,
  Max,
  Min,
  MinLength,
} from "class-validator";

export class SubmitConsultationDto {
  // ── Queryable fields ────────────────────────────────────────────
  @IsString()
  @MinLength(2)
  firstName!: string;

  @IsString()
  @MinLength(2)
  lastName!: string;

  @IsString()
  @MinLength(1)
  state!: string;

  @IsString()
  @MinLength(1)
  dob!: string;

  @IsString()
  @MinLength(1)
  gender!: string;

  @IsInt()
  @Min(1)
  @Max(10)
  severity!: number;

  @IsString()
  @MinLength(1)
  consultationType!: string;

  @IsString()
  @MinLength(1)
  offeringId!: string;

  // ── JSON fields ─────────────────────────────────────────────────
  @IsArray()
  symptoms!: string[];

  @IsObject()
  followUp!: Record<string, unknown>;

  @IsObject()
  vitals!: Record<string, unknown>;

  @IsArray()
  medicalHistory!: string[];

  @IsArray()
  surgicalHistory!: string[];

  @IsArray()
  allergies!: string[];

  @IsObject()
  @IsOptional()
  medications!: Record<string, unknown>;

  @IsObject()
  socialHistory!: Record<string, unknown>;
}
