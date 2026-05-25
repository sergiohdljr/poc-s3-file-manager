import { Global, Module } from '@nestjs/common';
import { S3Client } from '@aws-sdk/client-s3';
import { loadS3Config, S3Config } from './s3.config';

export const S3_CLIENT = Symbol('S3_CLIENT');
export const S3_CONFIG = Symbol('S3_CONFIG');

@Global()
@Module({
  providers: [
    {
      provide: S3_CONFIG,
      useFactory: (): S3Config => loadS3Config(),
    },
    {
      provide: S3_CLIENT,
      inject: [S3_CONFIG],
      useFactory: (config: S3Config) =>
        new S3Client({
          region: config.region,
          endpoint: config.endpoint,
          forcePathStyle: config.forcePathStyle,
          credentials: {
            accessKeyId: config.accessKeyId,
            secretAccessKey: config.secretAccessKey,
          },
        }),
    },
  ],
  exports: [S3_CLIENT, S3_CONFIG],
})
export class S3Module {}
