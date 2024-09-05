import { Device } from '@device-management/types';
import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Controller('devices')
export class DevicesController {
  constructor(@InjectModel(Device.name) private deviceModel: Model<Device>) {}

  @Get()
  getAll() {
    return this.deviceModel.find().exec();
  }

  @Post()
  newDevice(@Body() dto: Partial<Device>) {
    const createdDevice = new this.deviceModel(dto);
    return createdDevice.save();
  }

  @Put(':id')
  updateDevice(@Body() dto: Partial<Device>, @Param('id') deviceId: string) {
    return this.deviceModel.findByIdAndUpdate(deviceId, dto).exec();
  }
}
