import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { BaseModel } from '../common/interfaces/base-model.interface.js';

export enum AppointmentStatus {
  SCHEDULED = 'Scheduled',
  COMPLETED = 'Completed',
  CANCELLED = 'Cancelled',
  NO_SHOW = 'No-Show',
  WAITING = 'Waiting',
}

export type AppointmentDocument = HydratedDocument<Appointment>;

@Schema({ timestamps: true })
export class Appointment implements BaseModel {
  @Prop({ required: true })
  customerName!: string;

  @Prop({ type: Types.ObjectId, ref: 'ServiceDefinition', required: true })
  serviceId!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Staff' })
  staffId?: Types.ObjectId;

  @Prop({ required: true })
  appointmentDate!: Date;

  @Prop({ required: true })
  appointmentTime!: string; // e.g., "10:00"

  @Prop({ type: String, enum: AppointmentStatus, default: AppointmentStatus.SCHEDULED })
  status!: AppointmentStatus;

  @Prop({ type: Number })
  queuePosition?: number;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  userId!: Types.ObjectId;

  // BaseModel requirements
  id!: string;
  createdAt!: Date;
  updatedAt!: Date;
}

export const AppointmentSchema = SchemaFactory.createForClass(Appointment);
