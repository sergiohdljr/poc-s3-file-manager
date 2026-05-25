import { Module } from '@nestjs/common';
import { FilesController } from './presentation/controllers/files.controller';
import { OBJECT_STORAGE } from './infrastructure/storage/object-storage.port';
import { storageProviders } from './infrastructure/storage/storage.providers';

@Module({
  controllers: [FilesController],
  providers: [...storageProviders],
  exports: [OBJECT_STORAGE],
})
export class FileManagementModule {}
