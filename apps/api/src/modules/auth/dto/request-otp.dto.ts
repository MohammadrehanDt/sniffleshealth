import {
  IsEmail,
  IsIn,
  IsOptional,
  IsString,
  Length,
  Matches,
  ValidateIf,
} from "class-validator";
import type { UserRole } from "@sniffles/types";

export class RequestOtpDto {
  @IsEmail()
  email!: string;

  @IsIn(["PATIENT", "DOCTOR"])
  role!: UserRole;

  @IsOptional()
  @IsString()
  @Length(2, 100)
  fullName?: string;

  @ValidateIf((o: RequestOtpDto) => o.role === "DOCTOR")
  @IsString()
  @Length(10, 10, { message: "NPI Number must be exactly 10 digits" })
  @Matches(/^\d{10}$/, { message: "NPI Number must be numeric only" })
  npiNumber?: string;

  @ValidateIf((o: RequestOtpDto) => o.role === "DOCTOR")
  @IsString()
  @Length(10, 20, {
    message: "Phone number must be between 10 and 20 characters",
  })
  phone?: string;
}
