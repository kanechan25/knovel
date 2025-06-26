import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
  PORT: z.string().transform(Number).pipe(z.number().default(5000)),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  NODE_ENV: z.enum(['development', 'production']).default('development'),
  JWT_SECRET: z.string().min(1, 'JWT_SECRET is required'),
  FRONTEND_URL: z.string().default('http://localhost:5173'),
});
export const env = envSchema.parse(process.env);
