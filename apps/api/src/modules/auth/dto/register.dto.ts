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
import { IsStrongPassword } from "./password-validators";

export class RegisterDto {
  @IsEmail({}, { message: "Must be a valid email format" })
  email!: string;

  @IsStrongPassword()
  password!: string;

  @IsString()
  @Length(2, 100, { message: "Full Name must be between 2 and 100 characters" })
  @Matches(/^[a-zA-Z\s-]+$/, {
    message: "Full Name can only contain letters, spaces, and hyphens",
  })
  fullName!: string;

  @IsIn(["PATIENT", "DOCTOR"])
  role!: UserRole;

  @ValidateIf((o: RegisterDto) => o.role === "DOCTOR")
  @IsString()
  @Length(10, 10, { message: "NPI Number must be exactly 10 digits" })
  @Matches(/^\d{10}$/, { message: "NPI Number must be numeric only" })
  npiNumber?: string;

  @ValidateIf((o: RegisterDto) => o.role === "DOCTOR")
  @IsString()
  @Length(10, 20, {
    message: "Phone number must be between 10 and 20 characters",
  })
  phone?: string;

  @IsOptional()
  @IsString()
  healthieProviderId?: string;
}
