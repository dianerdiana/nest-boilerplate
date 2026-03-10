import z from 'zod';

export const primaryKeySchema = z.object({
  id: z.coerce.number().int().positive(),
});
