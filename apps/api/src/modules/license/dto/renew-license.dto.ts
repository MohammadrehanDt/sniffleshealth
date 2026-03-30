import { IsDateString } from "class-validator";

export class RenewLicenseDto {
  @IsDateString()
  expiryDate!: string;
}
