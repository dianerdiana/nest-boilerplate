import z from 'zod';
import { createUserSchema } from '../schemas/create-user.schema';

export type CreateUserDto = z.infer<typeof createUserSchema>;
