import z from 'zod';

export const RegisterSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  username: z.string().min(1),
  email: z.email().min(1),
  roleId: z.number(),
  password: z.string().min(6),
});
