import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { BaseModel } from '../common/interfaces/base-model.interface.js';

export enum ServiceDuration {
  FIFTEEN_MIN = 15,
  THIRTY_MIN = 30,
  SIXTY_MIN = 60,
}

export type ServiceDefinitionDocument = HydratedDocument<ServiceDefinition>;

@Schema({ timestamps: true })
export class ServiceDefinition implements BaseModel {
  @Prop({ required: true })
  name!: string;

  @Prop({ type: Number, enum: ServiceDuration, required: true })
  duration!: ServiceDuration;

  @Prop({ required: true })
  requiredStaffType!: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  userId!: Types.ObjectId;

  // BaseModel requirements
  id!: string;
  createdAt!: Date;
  updatedAt!: Date;
}

export const ServiceDefinitionSchema = SchemaFactory.createForClass(ServiceDefinition);
