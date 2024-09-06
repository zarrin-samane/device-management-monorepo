import { File } from '@device-management/types';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FileInterceptor } from '@nestjs/platform-express';
import { Model } from 'mongoose';
import { diskStorage } from 'multer';
import { extname } from 'path';

const STORAGE = diskStorage({
  destination: '../files',
  filename: (req, file, cb) => {
    const randomName = Array(32)
      .fill(null)
      .map(() => Math.round(Math.random() * 16).toString(16))
      .join('');
    return cb(null, `${randomName}${extname(file.originalname)}`);
  },
});

@Controller('files')
export class FilesController {
  constructor(@InjectModel(File.name) private fileModel: Model<File>) {}

  @Get()
  getAll() {
    return this.fileModel.find().sort({ createdAt: -1 }).exec();
  }

  @Get(':path')
  async serveFile(@Param('path') path, @Res() res): Promise<any> {
    res.sendFile(path, { root: '../files' });
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', { storage: STORAGE }))
  uploadFile(
    @UploadedFile() file,
    @Body()
    createFile: {
      title?: string;
    },
  ): Promise<File> {
    const f = new File();
    f.path = file.path;
    f.title = file.filename;
    if (createFile && createFile.title) {
      f.title = createFile.title;
    } else {
      f.title = file.originalname;
    }
    const createdFile = new this.fileModel(f);
    return createdFile.save();
  }
}
