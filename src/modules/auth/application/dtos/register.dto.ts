import z from 'zod';
import { RegisterSchema } from '../schemas/register.schema';

export type RegisterDto = z.infer<typeof RegisterSchema>;
