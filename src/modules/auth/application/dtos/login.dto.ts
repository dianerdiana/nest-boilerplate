import z from 'zod';

import { LoginSchema } from '../schemas/login.schema';

export type LoginDto = z.infer<typeof LoginSchema>;
