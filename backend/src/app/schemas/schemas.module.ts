import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './user';
import { Device, File, User } from '@device-management/types';
import { FileSchema } from './file';
import { DeviceSchema } from './device';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Device.name, schema: DeviceSchema },
      { name: File.name, schema: FileSchema },
    ]),
  ],
  exports: [MongooseModule],
})
export class SchemasModule {}
