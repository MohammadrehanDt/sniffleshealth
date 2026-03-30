import {
  IsEmail,
  IsOptional,
  IsString,
  Length,
  Matches,
} from "class-validator";
import { IsStrongPassword } from "./password-validators";

export class CompleteSignupDto {
  @IsEmail()
  email!: string;

  @IsString()
  @Length(6, 6)
  otp!: string;

  @IsStrongPassword()
  password!: string;

  @IsOptional()
  @IsString()
  @Length(2, 100)
  fullName?: string;

  @IsOptional()
  @IsString()
  @Length(10, 10, { message: "NPI Number must be exactly 10 digits" })
  @Matches(/^\d{10}$/, { message: "NPI Number must be numeric only" })
  npiNumber?: string;

  @IsOptional()
  @IsString()
  @Length(10, 20, {
    message: "Phone number must be between 10 and 20 characters",
  })
  phone?: string;
}
