import { Provider } from '@nestjs/common';
import { OBJECT_STORAGE } from './object-storage.port';
import { S3ObjectStorageAdapter } from './s3-object-storage.adapter';

export const storageProviders: Provider[] = [
  {
    provide: OBJECT_STORAGE,
    useClass: S3ObjectStorageAdapter,
  },
];
