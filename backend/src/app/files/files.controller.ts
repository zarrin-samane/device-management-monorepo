import { File } from '@device-management/types';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { S3 } from 'aws-sdk';
import { awsConfig } from './aws.config';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('files')
export class FilesController {
  private client = new S3(awsConfig);
  constructor(@InjectModel(File.name) private fileModel: Model<File>) {}

  @Get()
  getAll() {
    return this.fileModel.find().sort({ createdAt: -1 }).exec();
  }

  @Get(':path')
  async serveFile(@Param('path') path, @Res() res): Promise<any> {
    res.sendFile(path, { root: '../files' });
  }

  @Post('upload/:title')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: any,
    @Body() body,
    @Param('title') title: string,
  ) {
    const savedFile = await this.upload(file);
    const createdDevice = new this.fileModel({
      path: savedFile.Key,
      title,
    });
    return createdDevice.save();
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    const file = await this.fileModel.findByIdAndDelete(id).exec();
    console.log(file)
    if (file) {
      this.client.deleteObject({
        Bucket: process.env.LIARA_BUCKET_NAME,
        Key: file.path,
      });
    }
  }

  upload(file: any) {
    return new Promise<any>((resolve, reject) => {
      const key = `${Date.now()}_${file.originalname}`;
      this.client.upload(
        {
          Bucket: process.env.LIARA_BUCKET_NAME,
          Key: key,
          Body: file.buffer,
        },
        (err, data) => {
          if (err) reject(err);
          else resolve(data);
        },
      );
    });
  }
}
