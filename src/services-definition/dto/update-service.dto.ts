import { z } from 'zod';

export const UpdateServiceSchema = z.object({
  name: z.string().min(1, 'Name is required').optional(),
  duration: z.union([z.literal(15), z.literal(30), z.literal(60)]).optional(),
  requiredStaffType: z.string().min(1, 'Required staff type is required').optional(),
});

export type UpdateServiceDto = z.infer<typeof UpdateServiceSchema>;
