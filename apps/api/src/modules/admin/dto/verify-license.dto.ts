import { IsIn, IsOptional, IsString, MaxLength } from "class-validator";

export class VerifyLicenseDto {
  @IsIn(["VERIFY", "REJECT"])
  action!: "VERIFY" | "REJECT";

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  rejectionReason?: string;
}
