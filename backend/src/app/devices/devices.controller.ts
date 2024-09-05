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
  save(@Body() dto: Partial<Device>) {
    if (dto._id) {
      const { _id, ...updatedDto } = dto;
      return this.deviceModel.findByIdAndUpdate(_id, updatedDto).exec();
    } else {
      const createdDevice = new this.deviceModel(dto);
      return createdDevice.save();
    }
  }
}
