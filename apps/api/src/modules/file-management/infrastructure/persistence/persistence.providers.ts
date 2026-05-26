import { Provider } from '@nestjs/common';
import { FILE_REPOSITORY } from '../../domain/repositories/file.repository';
import { SqlFileRepository } from './sql-file.repository';

export const persistenceProviders: Provider[] = [
  {
    provide: FILE_REPOSITORY,
    useClass: SqlFileRepository,
  },
];
