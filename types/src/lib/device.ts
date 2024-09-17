import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type DeviceDocument = HydratedDocument<Device>;

@Schema({ timestamps: true })
export class Device {
  id: any;
  _id: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true, unique: true })
  serial: string;

  @Prop()
  version?: number;

  @Prop()
  currentVersion?: number;

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop()
  connectedAt?: Date;
}

export const DeviceSchema = SchemaFactory.createForClass(Device);
