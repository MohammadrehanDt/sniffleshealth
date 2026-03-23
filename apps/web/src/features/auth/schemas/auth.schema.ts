import { z } from "zod";

// ── Shared field validators (match backend DTOs exactly) ────────────────────

const email = z
  .string()
  .min(1, "Email is required")
  .email("Must be a valid email");

const password = z.string().superRefine((value, ctx) => {
  if (!value) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Password is required",
    });
    return;
  }

  if (value.length < 8) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Minimum 8 characters",
    });
  }

  if (!/[a-z]/.test(value)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Must contain a lowercase letter",
    });
  }

  if (!/[A-Z]/.test(value)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Must contain an uppercase letter",
    });
  }

  if (!/\d/.test(value)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Must contain a number",
    });
  }

  if (!/[@$!%*?&]/.test(value)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Must contain a special character (@$!%*?&)",
    });
  }
});

const fullName = z
  .string()
  .min(2, "Must be at least 2 characters")
  .max(100, "Must be under 100 characters")
  .regex(/^[a-zA-Z\s-]+$/, "Only letters, spaces, and hyphens");

const npiNumber = z.string().regex(/^\d{10}$/, "Must be exactly 10 digits");

// ── Login schema ────────────────────────────────────────────────────────────

export const loginSchema = z.object({
  email,
  password: z.string().min(1, "Password is required"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

// ── Registration schemas (role-conditional) ─────────────────────────────────

const baseRegisterSchema = z.object({
  fullName,
  email,
  password,
  confirmPassword: z.string().min(1, "Confirm password is required"),
  role: z.enum(["PATIENT", "DOCTOR"]),
});

const patientRegisterSchema = baseRegisterSchema.extend({
  role: z.literal("PATIENT"),
});

const doctorRegisterSchema = baseRegisterSchema.extend({
  role: z.literal("DOCTOR"),
  npiNumber,
});

export const registerSchema = z
  .discriminatedUnion("role", [patientRegisterSchema, doctorRegisterSchema])
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Passwords do not match",
        path: ["confirmPassword"],
      });
    }
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;
