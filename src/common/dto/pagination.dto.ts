import { z } from 'zod';

export const PaginationDtoSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().default(10),
  skip: z.number().int().nonnegative().optional(),
});

export type PaginationDto = z.infer<typeof PaginationDtoSchema>;
