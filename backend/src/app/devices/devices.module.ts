import { Module } from '@nestjs/common';
import { DevicesController } from './devices.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Device, DeviceSchema } from '@device-management/types';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Device.name, schema: DeviceSchema }]),
  ],
  controllers: [DevicesController],
})
export class DevicesModule {}
