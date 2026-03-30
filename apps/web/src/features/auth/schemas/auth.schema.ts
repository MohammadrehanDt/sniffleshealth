import { z } from "zod";
import {
  PASSWORD_MIN_LENGTH,
  PASSWORD_SPECIAL_CHARACTERS,
  passwordMessages,
  passwordPatterns,
} from "@sniffles/utils";

const email = z
  .string()
  .min(1, "Email is required")
  .email("Must be a valid email");

const password = z.string().superRefine((value, ctx) => {
  if (!value) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: passwordMessages.required,
    });
    return;
  }

  if (value.length < PASSWORD_MIN_LENGTH) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: passwordMessages.minLength,
    });
  }

  if (!passwordPatterns.lowercase.test(value)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: passwordMessages.lowercase,
    });
  }

  if (!passwordPatterns.uppercase.test(value)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: passwordMessages.uppercase,
    });
  }

  if (!passwordPatterns.number.test(value)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: passwordMessages.number,
    });
  }

  if (!passwordPatterns.specialCharacter.test(value)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: `Must contain a special character (${PASSWORD_SPECIAL_CHARACTERS})`,
    });
  }
});

const fullName = z
  .string()
  .min(2, "Must be at least 2 characters")
  .max(100, "Must be under 100 characters")
  .regex(/^[a-zA-Z\s-]+$/, "Only letters, spaces, and hyphens");

const npiNumber = z.string().regex(/^\d{10}$/, "Must be exactly 10 digits");
const phone = z
  .string()
  .min(10, "Must be at least 10 characters")
  .max(20, "Must be under 20 characters");

const confirmPassword = z.string().min(1, "Confirm password is required");

function refinePasswordMatch<
  T extends { password: string; confirmPassword: string },
>(data: T, ctx: z.RefinementCtx) {
  if (data.password !== data.confirmPassword) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Passwords do not match",
      path: ["confirmPassword"],
    });
  }
}

export const loginSchema = z.object({
  email,
  password: z.string().min(1, passwordMessages.required),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

const baseRegisterSchema = z.object({
  fullName,
  email,
  password,
  confirmPassword,
  role: z.enum(["PATIENT", "DOCTOR"]),
});

const patientRegisterSchema = baseRegisterSchema.extend({
  role: z.literal("PATIENT"),
});

const doctorRegisterSchema = baseRegisterSchema.extend({
  role: z.literal("DOCTOR"),
  npiNumber,
  phone,
});

export const registerSchema = z
  .discriminatedUnion("role", [patientRegisterSchema, doctorRegisterSchema])
  .superRefine(refinePasswordMatch);

export type RegisterFormValues = z.infer<typeof registerSchema>;

export const forgotPasswordSchema = z.object({
  email,
});

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
  .object({
    password,
    confirmPassword,
  })
  .superRefine(refinePasswordMatch);

export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;
