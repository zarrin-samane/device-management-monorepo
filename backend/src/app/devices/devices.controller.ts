import { Device } from '@device-management/types';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Controller('devices')
export class DevicesController {
  constructor(@InjectModel(Device.name) private deviceModel: Model<Device>) {}

  @Get()
  getAll() {
    return this.deviceModel.find().sort({ createdAt: -1, serial: -1 }).exec();
  }

  @Post()
  save(@Body() dto: Partial<Device> | Partial<Device>[]) {
    if (Array.isArray(dto)) {
      return this.deviceModel.insertMany(dto);
    } else {
      if (dto._id) {
        const { _id, ...updatedDto } = dto;
        return this.deviceModel.findByIdAndUpdate(_id, updatedDto).exec();
      } else {
        const createdDevice = new this.deviceModel(dto);
        return createdDevice.save();
      }
    }
  }

  @Get('upgrade/:version')
  upgrade(@Query('ids') ids: string, @Param('version') version: string) {
    return this.deviceModel
      .updateMany(
        { _id: { $in: ids.split(',') } },
        { version: Number(version) },
      )
      .exec();
  }

  @Delete()
  remove(@Query('ids') ids: string) {
    return this.deviceModel.deleteMany({ _id: { $in: ids.split(',') } });
  }
}
