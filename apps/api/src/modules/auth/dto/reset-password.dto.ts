import { IsString, MinLength } from "class-validator";
import { IsStrongPassword } from "./password-validators";

export class ResetPasswordDto {
  @IsString()
  @MinLength(1)
  token!: string;

  @IsStrongPassword()
  password!: string;
}
