import {
  IsDateString,
  IsOptional,
  IsString,
  Length,
  MinLength,
} from "class-validator";

export class SubmitLicenseDto {
  @IsString()
  @Length(2, 2)
  stateCode!: string;

  @IsString()
  @MinLength(1)
  licenseNumber!: string;

  @IsDateString()
  expiryDate!: string;

  @IsOptional()
  @IsDateString()
  obtainedDate?: string;
}
