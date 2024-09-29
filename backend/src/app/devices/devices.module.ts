import { Module } from '@nestjs/common';
import { DevicesController } from './devices.controller';
import { SchemasModule } from '../schemas/schemas.module';

@Module({
  imports: [SchemasModule],
  controllers: [DevicesController],
})
export class DevicesModule {}
