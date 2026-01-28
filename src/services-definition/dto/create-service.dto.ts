import { z } from 'zod';

export const CreateServiceSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  duration: z.union([z.literal(15), z.literal(30), z.literal(60)]),
  requiredStaffType: z.string().min(1, 'Required staff type is required'),
});

export type CreateServiceDto = z.infer<typeof CreateServiceSchema>;
