import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { DatabaseModule } from './shared/infrastructure/database.module';

@Module({
  imports: [DatabaseModule, UsersModule],
})
export class AppModule {}
