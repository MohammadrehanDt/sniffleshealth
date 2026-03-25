import { z } from "zod";

export const profileSchema = z.object({
  fullName: z
    .string()
    .min(2, "Must be at least 2 characters")
    .max(100, "Must be under 100 characters")
    .regex(/^[a-zA-Z\s-]+$/, "Only letters, spaces, and hyphens"),
  dateOfBirth: z.string().optional().or(z.literal("")),
  email: z.string().email("Must be a valid email"),
  phone: z
    .string()
    .regex(/^\+?[\d\s()-]{7,20}$/, "Must be a valid phone number")
    .optional()
    .or(z.literal("")),
  weight: z.string().optional().or(z.literal("")),
  weightUnit: z.enum(["kg", "lbs"]),
  height: z.string().optional().or(z.literal("")),
  heightUnit: z.enum(["ft", "cm"]),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;

export const addressSchema = z.object({
  label: z
    .string()
    .min(1, "Name is required")
    .max(50, "Must be under 50 characters"),
  addressLine1: z
    .string()
    .min(1, "Address line 1 is required")
    .max(200, "Must be under 200 characters"),
  addressLine2: z
    .string()
    .max(200, "Must be under 200 characters")
    .optional()
    .or(z.literal("")),
  state: z.string().min(1, "State is required"),
  city: z
    .string()
    .min(1, "City is required")
    .max(100, "Must be under 100 characters"),
  zipCode: z.string().regex(/^\d{5}(-\d{4})?$/, "Must be a valid US ZIP code"),
  isDefault: z.boolean().optional(),
});

export type AddressFormValues = z.infer<typeof addressSchema>;
