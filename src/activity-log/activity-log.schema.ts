import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ActivityLogDocument = ActivityLog & Document;

export enum ActivityAction {
  QueueToStaff = 'QueueToStaff',
  ManualAssign = 'ManualAssign',
  StatusChange = 'StatusChange',
}

@Schema({ timestamps: true })
export class ActivityLog {
  @Prop({ required: true, enum: ActivityAction })
  action!: ActivityAction;

  @Prop({ required: true })
  description!: string;

  @Prop({ type: Types.ObjectId, ref: 'Appointment', required: true })
  appointmentId!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Staff' })
  staffId?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId!: Types.ObjectId;

  @Prop({ default: Date.now })
  timestamp!: Date;
}

export const ActivityLogSchema = SchemaFactory.createForClass(ActivityLog);
