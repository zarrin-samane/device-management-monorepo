import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type DeviceDocument = HydratedDocument<Device>;

@Schema({ timestamps: true })
export class Device {
  _id: any;
  id: string;

  @Prop({ required: true, unique: true })
  serial: string;

  @Prop({ required: false })
  region: number;

  connectedAt?: Date;
}

export const DeviceSchema = SchemaFactory.createForClass(Device);
