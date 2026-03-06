import z from 'zod';

export const ConfigurationSchema = z.object({
  PORT: z.coerce.number().int().positive(),
  NODE_ENV: z.enum(['development', 'production', 'test']),
  DATABASE_URL: z.string().min(1),
  DB_HOST: z.string().min(1),
  DB_PORT: z.coerce.number().int().positive(),
  DB_USER: z.string().min(1),
  DB_PASSWORD: z.string().min(1),
  DB_DATABASE: z.string().min(1),
  JWT_ACCESS_TOKEN: z.string().min(1),
  JWT_REFRESH_TOKEN: z.string().min(1),
  JWT_ACCESS_TOKEN_EXPIRE: z.string().min(1),
  JWT_REFRESH_TOKEN_EXPIRE: z.string().min(1),
});
