import { z } from 'zod';

export const UpdateStaffSchema = z.object({
  name: z.string().min(1, 'Name is required').optional(),
  serviceType: z.string().min(1, 'Service type is required').optional(),
  dailyCapacity: z.number().int().positive().optional(),
  availabilityStatus: z.enum(['Available', 'On Leave']).optional(),
});

export type UpdateStaffDto = z.infer<typeof UpdateStaffSchema>;
