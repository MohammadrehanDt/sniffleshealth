import { IsEmail, IsString, Length, MinLength } from "class-validator";

export class CompleteSignupDto {
  @IsEmail()
  email!: string;

  @IsString()
  @Length(6, 6)
  otp!: string;

  @IsString()
  @MinLength(8)
  password!: string;
}
