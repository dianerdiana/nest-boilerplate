import z from 'zod';
import { primaryKeySchema } from '../schemas/primary-key.schema';

export type PrimaryKeyDto = z.infer<typeof primaryKeySchema>;
