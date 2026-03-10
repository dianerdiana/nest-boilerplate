import z from 'zod';
import { paginationSchema } from '../schemas/pagination.schema';

export type PaginationDto = z.infer<typeof paginationSchema>;
