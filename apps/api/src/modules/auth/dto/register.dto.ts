import {
  IsEmail,
  IsIn,
  IsOptional,
  IsString,
  Length,
  Matches,
  MinLength,
} from "class-validator";
import type { UserRole } from "@sniffles/types";

export class RegisterDto {
  @IsEmail({}, { message: "Must be a valid email format" })
  email!: string;

  @IsString()
  @MinLength(8, { message: "Password must be at least 8 characters" })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    {
      message:
        "Password must have at least 1 uppercase, 1 lowercase, 1 number, and 1 special character",
    },
  )
  password!: string;

  @IsString()
  @Length(2, 100, { message: "Full Name must be between 2 and 100 characters" })
  @Matches(/^[a-zA-Z\s-]+$/, {
    message: "Full Name can only contain letters, spaces, and hyphens",
  })
  fullName!: string;

  @IsIn(["PATIENT", "DOCTOR"])
  role!: UserRole;

  @IsOptional()
  @IsString()
  @Length(10, 10, { message: "NPI Number must be exactly 10 digits" })
  @Matches(/^\d{10}$/, { message: "NPI Number must be numeric only" })
  npiNumber?: string;
}
