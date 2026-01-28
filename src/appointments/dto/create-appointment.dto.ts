import { z } from 'zod';

export const CreateAppointmentSchema = z.object({
  customerName: z.string().min(1, 'Customer name is required'),
  serviceId: z.string().min(1, 'Service ID is required'),
  staffId: z.string().optional(),
  appointmentDate: z.string().min(1, 'Appointment date is required'), // ISO string
  appointmentTime: z.string().min(1, 'Appointment time is required'),
});

export type CreateAppointmentDto = z.infer<typeof CreateAppointmentSchema>;
