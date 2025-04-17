import { Device, DeviceFilterDto } from '@device-management/types';
import {
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, RootFilterQuery } from 'mongoose';

@Controller('devices')
export class DevicesController {
  constructor(@InjectModel(Device.name) private deviceModel: Model<Device>) {}

  @Get()
  getAll() {
    return this.deviceModel.find().sort({ createdAt: -1, serial: -1 }).exec();
  }

  @Post('filter')
  async filter(@Body() dto: DeviceFilterDto) {
    const filter: RootFilterQuery<Device> = {};

    if (dto.query) {
      filter.$or = [
        { title: { $regex: dto.query, $options: 'i' } },
        { serial: { $regex: dto.query, $options: 'i' } },
      ];
    }

    if (dto.tag) {
      filter.tags = { $in: dto.tag };
    }

    if (dto.nullConnectionAt) {
      filter.connectedAt = null;
    } else {
      if (dto.minConnectionAt) {
        filter.connectedAt = {
          ...filter.connectedAt,
          $gte: dto.minConnectionAt,
        };
      }

      if (dto.maxConnectionAt) {
        filter.connectedAt = {
          ...filter.connectedAt,
          $lte: dto.maxConnectionAt,
        };
      }
    }

    if (dto.currentVersion !== undefined) {
      filter.currentVersion = dto.currentVersion;
    }

    let data: Device[] = [];
    const count = await this.deviceModel.countDocuments(filter).exec();
    if (dto.limit) {
      data = await this.deviceModel
        .find(filter)
        .sort({ createdAt: -1, serial: -1 })
        .skip(((dto.page || 1) - 1) * dto.limit)
        .limit(dto.limit)
        .exec();
    } else {
      data = await this.deviceModel
        .find(filter)
        .sort({ createdAt: -1, serial: -1 })
        .exec();
    }

    return { data, count };
  }

  @Post()
  async save(@Body() dto: Partial<Device> | Partial<Device>[]) {
    try {
      if (Array.isArray(dto)) {
        return await this.deviceModel.insertMany(dto);
      } else {
        if (dto._id) {
          const { _id, ...updatedDto } = dto;
          return await this.deviceModel
            .findByIdAndUpdate(_id, updatedDto)
            .exec();
        } else {
          const createdDevice = new this.deviceModel(dto);
          return await createdDevice.save();
        }
      }
    } catch (error) {
      if (error.code === 11000)
        throw new ConflictException('سریال وارد شده تکراری');
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

  @Post('remove')
  remove(@Body() ids: string[]) {
    return this.deviceModel.deleteMany({ _id: { $in: ids } });
  }

  @Get('tags')
  async getUniqueTags(): Promise<string[]> {
    const result = await this.deviceModel.aggregate([
      { $unwind: '$tags' }, // Flatten the tags array
      { $group: { _id: '$tags' } }, // Group by tag to get unique values
      { $project: { _id: 0, tag: '$_id' } }, // Format output
    ]);

    return result.map((item) => item.tag);
  }
}
