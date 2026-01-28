import { z } from 'zod';

export const CreateStaffSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  serviceType: z.string().min(1, 'Service type is required'),
  dailyCapacity: z.number().int().positive().default(5),
  availabilityStatus: z.enum(['Available', 'On Leave']).default('Available'),
});

export type CreateStaffDto = z.infer<typeof CreateStaffSchema>;
