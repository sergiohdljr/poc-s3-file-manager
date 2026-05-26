import { Module } from '@nestjs/common';
import { FilesController } from './presentation/controllers/files.controller';
import { FILE_REPOSITORY } from './domain/repositories/file.repository';
import { persistenceProviders } from './infrastructure/persistence/persistence.providers';
import { OBJECT_STORAGE } from './infrastructure/storage/object-storage.port';
import { storageProviders } from './infrastructure/storage/storage.providers';
import { UploadFileUseCase } from './application/use-cases/upload-file.usecase';
import { S3ObjectStorageAdapter } from './infrastructure/storage/s3-object-storage.adapter';
import { SqlFileRepository } from './infrastructure/persistence/sql-file.repository';

@Module({
  controllers: [FilesController],
  providers: [...storageProviders, ...persistenceProviders, UploadFileUseCase],
  exports: [OBJECT_STORAGE, FILE_REPOSITORY],
})
export class FileManagementModule { }
