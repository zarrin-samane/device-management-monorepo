import { Module } from '@nestjs/common';
import { FilesController } from './files.controller';
import { SchemasModule } from '../schemas/schemas.module';

@Module({
  imports: [SchemasModule],
  controllers: [FilesController],
})
export class FilesModule {}
