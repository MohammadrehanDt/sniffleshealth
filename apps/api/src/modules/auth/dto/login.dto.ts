import {
  IsBoolean,
  IsEmail,
  IsOptional,
  IsString,
  MinLength,
} from "class-validator";
import { PASSWORD_MIN_LENGTH, passwordMessages } from "@sniffles/utils";

export class LoginDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(PASSWORD_MIN_LENGTH, {
    message: passwordMessages.backendMinLength,
  })
  password!: string;

  @IsBoolean()
  @IsOptional()
  rememberMe?: boolean;
}
