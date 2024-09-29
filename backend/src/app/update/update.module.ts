import { Module } from '@nestjs/common';
import { UpdateController } from './update.controller';
import { SchemasModule } from '../schemas/schemas.module';

@Module({
  imports: [SchemasModule],
  controllers: [UpdateController],
})
export class UpdateModule {}
