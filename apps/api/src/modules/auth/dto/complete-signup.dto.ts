import { IsEmail, IsOptional, IsString, Length } from "class-validator";
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
}
