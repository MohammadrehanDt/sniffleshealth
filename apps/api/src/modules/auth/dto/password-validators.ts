import { applyDecorators } from "@nestjs/common";
import { IsString, Matches, MinLength } from "class-validator";
import {
  PASSWORD_MIN_LENGTH,
  passwordMessages,
  passwordPatterns,
} from "@sniffles/utils";

export function IsStrongPassword() {
  return applyDecorators(
    IsString(),
    MinLength(PASSWORD_MIN_LENGTH, {
      message: passwordMessages.backendMinLength,
    }),
    Matches(passwordPatterns.lowercase, {
      message: passwordMessages.lowercase,
    }),
    Matches(passwordPatterns.uppercase, {
      message: passwordMessages.uppercase,
    }),
    Matches(passwordPatterns.number, { message: passwordMessages.number }),
    Matches(passwordPatterns.specialCharacter, {
      message: passwordMessages.specialCharacter,
    }),
  );
}
