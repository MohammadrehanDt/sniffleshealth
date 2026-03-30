import { z } from "zod";

export const envSchema = z.object({
  API_PORT: z.coerce.number().default(4000),
  WEB_URL: z.string().url().optional(),
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  SMTP_FROM: z.string().optional(),
  SMTP_SECURE: z.coerce.boolean().default(false),
  DATABASE_URL: z
    .string()
    .min(1)
    .default("postgresql://postgres:postgres@localhost:5432/sniffleshealth"),
  JWT_SECRET: z.string().min(1).default("replace-me"),
  JWT_EXPIRES_IN: z.string().min(1).default("7d"),
  HEALTHIE_API_KEY: z.string().min(1).optional(),
  HEALTHIE_API_URL: z
    .string()
    .url()
    .default("https://api.gethealthie.com/graphql"),
  HEALTHIE_TEXT_CONSULTATION_OFFERING_ID: z.string().optional(),
  HEALTHIE_AUDIO_VIDEO_CONSULTATION_OFFERING_ID: z.string().optional(),
});

export type AppEnv = z.infer<typeof envSchema>;
