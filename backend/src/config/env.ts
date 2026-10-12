import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
  PORT: z.string().default('5000'),
  NODE_ENV: z.string().default('development'),
  FRONTEND_URL: z.string().url(),
  SUPABASE_URL: z.string().url(),
  SUPABASE_PUBLISHABLE_KEY: z.string().min(1),
  SUPABASE_SECRET_KEY: z.string().min(1),
});

const envParseResult = envSchema.safeParse(process.env);

if (!envParseResult.success) {
  console.error('❌ Invalid environment variables:', envParseResult.error.format());
  process.exit(1);
}

export const env = envParseResult.data;
