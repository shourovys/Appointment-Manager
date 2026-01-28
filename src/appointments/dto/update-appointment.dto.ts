import { z } from 'zod';

export const UpdateAppointmentSchema = z.object({
  customerName: z.string().min(1, 'Customer name is required').optional(),
  serviceId: z.string().min(1, 'Service ID is required').optional(),
  staffId: z.string().optional(),
  appointmentDate: z.string().min(1, 'Appointment date is required').optional(), // ISO string
  appointmentTime: z.string().min(1, 'Appointment time is required').optional(),
  status: z.enum(['Scheduled', 'Completed', 'Cancelled', 'No-Show', 'Waiting']).optional(),
});

export type UpdateAppointmentDto = z.infer<typeof UpdateAppointmentSchema>;
