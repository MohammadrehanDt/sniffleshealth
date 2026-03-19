import { z } from "zod";

const webEnvSchema = z.object({
  VITE_API_URL: z.string().url().default("http://localhost:4000/api"),
});

export function getWebEnv(values: Record<string, unknown>) {
  return webEnvSchema.parse(values);
}
