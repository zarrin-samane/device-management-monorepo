import { Device, File } from '@device-management/types';
import { Body, Controller, Get, Param, Post, Query, Res } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Response } from 'express';
import { default as md5 } from 'md5';
import { Model } from 'mongoose';
import fetch from 'node-fetch';
import { Public } from '../auth/public.decorator';

const ERROR_TEXT = 'exit update: ';
const STORAGE_BASE_URL = `https://${process.env.LIARA_BUCKET_NAME}.${process.env.LIARA_BUCKET_ENDPOINT}`;

@Public()
@Controller('update')
export class UpdateController {
  codes = new Map<string, string>();

  constructor(
    @InjectModel(Device.name) private deviceModel: Model<Device>,
    @InjectModel(File.name) private fileModel: Model<File>,
  ) {}

  @Get('check/:serial/:version')
  async check(
    @Param('serial') serial: string,
    @Param('version') version: string,
    @Query() query,
  ) {
    console.log('check', serial, version, query);
    let device = await this.deviceModel
      .findOneAndUpdate(
        { serial },
        { connectedAt: new Date(), currentVersion: Number(version) },
      )
      .exec();

    // for updating 00-... series to 31-... series
    if (!device && serial.startsWith('00')) {
      device = await this.deviceModel
        .findOneAndUpdate(
          { serial: serial.replace('00', '31') },
          { connectedAt: new Date(), currentVersion: Number(version) },
        )
        .exec();
    } else if (!device && serial.startsWith('31')) {
      device = await this.deviceModel
        .findOneAndUpdate(
          { serial: serial.replace('31', '00') },
          {
            connectedAt: new Date(),
            currentVersion: Number(version),
            serial,
          },
        )
        .exec();
    }

    if (!device) return ERROR_TEXT + 'device not found.';

    if (query) {
      this.deviceModel
        .findByIdAndUpdate(device.id, {
          details: { ...device.details, ...query },
        })
        .exec();
    }

    if (!device.version || device.version <= Number(version))
      return ERROR_TEXT + 'your version is last version.';

    let code;
    do {
      code = this.makeid();
    } while (this.codes.get(code));
    const hash = md5(md5(code));

    this.codes.set(code, hash);
    setTimeout(() => {
      this.codes.delete(code);
    }, 60000);
    return `${code}`;
  }

  @Get('download/:serial/:code/:hash')
  async download(
    @Res() res: Response,
    @Param('serial') serial: string,
    @Param('code') code: string,
    @Param('hash') hash: string,
  ) {
    const realHash = this.codes.get(code);
    if (hash === realHash) {
      let device = await this.deviceModel
        .findOneAndUpdate({ serial }, { connectedAt: new Date() })
        .exec();

      // for updating 00-... series to 31-... series
      if (!device && serial.startsWith('00')) {
        device = await this.deviceModel
          .findOneAndUpdate(
            { serial: serial.replace('00', '31') },
            { connectedAt: new Date() },
          )
          .exec();
      } else if (!device && serial.startsWith('31')) {
        device = await this.deviceModel
          .findOneAndUpdate(
            { serial: serial.replace('31', '00') },
            { connectedAt: new Date() },
          )
          .exec();
      }
      if (!device)
        return res.status(200).send(ERROR_TEXT + 'device not found.');

      const file = await this.fileModel
        .findOne({ version: device.version })
        .exec();

      if (!file) return res.status(200).send(ERROR_TEXT + 'file not found.');

      const link = `${STORAGE_BASE_URL}/${file.path}`;
      const remoteResponse = await fetch(link);
      if (remoteResponse.ok) {
        res.setHeader(
          'Content-Type',
          remoteResponse.headers.get('content-type') ||
            'application/octet-stream',
        );
        return remoteResponse.body.pipe(res);
      } else {
        return res
          .status(200)
          .send(ERROR_TEXT + 'error to fetch file from storage');
      }
    }
    return res
      .status(200)
      .send(
        ERROR_TEXT + realHash
          ? 'your hash is not valid'
          : 'your code is not valid',
      );
  }

  makeid(length = 10) {
    let result = '';
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
  }
}
