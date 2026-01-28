import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { BaseModel } from '../common/interfaces/base-model.interface.js';

export enum AvailabilityStatus {
  AVAILABLE = 'Available',
  ON_LEAVE = 'On Leave',
}

export type StaffDocument = HydratedDocument<Staff>;

@Schema({ timestamps: true })
export class Staff implements BaseModel {
  @Prop({ required: true })
  name!: string;

  @Prop({ required: true })
  serviceType!: string;

  @Prop({ required: true, default: 5 })
  dailyCapacity!: number;

  @Prop({ type: String, enum: AvailabilityStatus, default: AvailabilityStatus.AVAILABLE })
  availabilityStatus!: AvailabilityStatus;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  userId!: Types.ObjectId;

  // BaseModel requirements
  id!: string;
  createdAt!: Date;
  updatedAt!: Date;
}

export const StaffSchema = SchemaFactory.createForClass(Staff);
