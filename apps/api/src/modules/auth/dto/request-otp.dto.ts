import { IsEmail, IsIn } from "class-validator";
import type { UserRole } from "@sniffles/types";

export class RequestOtpDto {
  @IsEmail()
  email!: string;

  @IsIn(["PATIENT", "DOCTOR"])
  role!: UserRole;
}
