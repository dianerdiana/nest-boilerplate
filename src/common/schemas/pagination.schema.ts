import { z } from 'zod';

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(10),
  search: z
    .string()
    .trim()
    .optional()
    .transform((value) => (value ? value : undefined)),
  column: z.string().trim().min(1).optional().default('createdAt'),
  sort: z.enum(['asc', 'desc']).optional().default('desc'),
});
