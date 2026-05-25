import { Module } from '@nestjs/common';
import { FilesController } from './presentation/controllers/files.controller';

@Module({
  controllers: [FilesController],
  providers: [],
})
export class FileManagementModule {}
