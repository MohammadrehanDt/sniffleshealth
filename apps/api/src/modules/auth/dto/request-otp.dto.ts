import { IsEmail, IsIn, IsOptional, IsString, Length } from "class-validator";
import type { UserRole } from "@sniffles/types";

export class RequestOtpDto {
  @IsEmail()
  email!: string;

  @IsIn(["patient", "doctor"])
  role!: UserRole;

  @IsOptional()
  @IsString()
  @Length(2, 100)
  fullName?: string;
}
