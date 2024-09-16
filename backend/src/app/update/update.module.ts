import { Module } from '@nestjs/common';
import { UpdateController } from './update.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Device, DeviceSchema, FileSchema } from '@device-management/types';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Device.name, schema: DeviceSchema }, { name: File.name, schema: FileSchema }]),
  ],
  controllers: [UpdateController],
})
export class UpdateModule {}
