import { Global, Module } from '@nestjs/common';
import { S3Client, S3ClientConfig } from '@aws-sdk/client-s3';
import { loadS3Config, S3Config } from './s3.config';

export const S3_CLIENT = Symbol('S3_CLIENT');
export const S3_CONFIG = Symbol('S3_CONFIG');

function createS3Client(config: S3Config): S3Client {
  const options: S3ClientConfig = { region: config.region };

  if (config.credentials) {
    options.credentials = config.credentials;
  }

  if (config.endpoint) {
    options.endpoint = config.endpoint;
    options.forcePathStyle = config.forcePathStyle ?? false;
  }

  return new S3Client(options);
}

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
      useFactory: createS3Client,
    },
  ],
  exports: [S3_CLIENT, S3_CONFIG],
})
export class S3Module {}
