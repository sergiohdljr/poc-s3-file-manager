import { Module } from '@nestjs/common';
import { FileManagementModule } from './modules/file-management/file-management.module';
import { DatabaseModule } from './shared/infrastructure/database.module';

@Module({
  imports: [DatabaseModule, FileManagementModule],
})
export class AppModule {}
