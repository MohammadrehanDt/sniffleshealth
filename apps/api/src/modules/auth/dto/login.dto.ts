import { IsEmail, IsIn, IsString, MinLength } from "class-validator";
import type { UserRole } from "@sniffles/types";

export class LoginDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8)
  password!: string;

  @IsIn(["patient", "doctor"])
  role!: UserRole;
}
