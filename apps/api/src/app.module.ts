import { Module } from '@nestjs/common';
import { FileManagementModule } from './modules/file-management/file-management.module';
import { DatabaseModule } from './shared/infrastructure/database.module';
import { S3Module } from './shared/infrastructure/s3';

@Module({
  imports: [DatabaseModule, S3Module, FileManagementModule],
})
export class AppModule {}
