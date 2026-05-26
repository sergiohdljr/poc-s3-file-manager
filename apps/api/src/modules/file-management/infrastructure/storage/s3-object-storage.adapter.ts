import { Inject, Injectable } from '@nestjs/common';
import {
  AbortMultipartUploadCommand,
  CompleteMultipartUploadCommand,
  CreateMultipartUploadCommand,
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
  UploadPartCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { S3_CLIENT, S3_CONFIG, S3Config } from '../../../../shared/infrastructure/s3';
import {
  CompleteMultipartUploadInput,
  DeleteObjectInput,
  GetObjectInput,
  MultipartUploadInput,
  ObjectStorage,
  PresignedDownloadInput,
  PresignedUploadPartInput,
  PutObjectInput,
  UploadPartInput,
} from './object-storage.port';
import { S3Key } from '../../domain/value-objects/s3-key.vo';
import { POC_OWNER_ID } from '../../domain/constants/poc-owner';
import { randomUUID } from 'crypto';

@Injectable()
export class S3ObjectStorageAdapter implements ObjectStorage {
  constructor(
    @Inject(S3_CLIENT) private readonly client: S3Client,
    @Inject(S3_CONFIG) private readonly config: S3Config,
  ) { }

  async putObject(input: PutObjectInput): Promise<void> {
    await this.client.send(
      new PutObjectCommand({
        Bucket: this.config.bucket,
        Key: input.key,
        Body: input.body,
        ContentType: input.contentType,
      }),
    );
  }

  async getObject(input: GetObjectInput): Promise<Uint8Array> {
    const response = await this.client.send(
      new GetObjectCommand({
        Bucket: this.config.bucket,
        Key: input.key,
      }),
    );

    if (!response.Body) {
      throw new Error(`Object not found: ${input.key}`);
    }

    return response.Body.transformToByteArray();
  }

  async deleteObject(input: DeleteObjectInput): Promise<void> {
    await this.client.send(
      new DeleteObjectCommand({
        Bucket: this.config.bucket,
        Key: input.key,
      }),
    );
  }

  async getPresignedDownloadUrl(input: PresignedDownloadInput): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.config.bucket,
      Key: input.key,
    });

    return getSignedUrl(this.client, command, {
      expiresIn: input.expiresInSeconds ?? 3600,
    });
  }

  async getPresignedUploadPartUrl(
    input: PresignedUploadPartInput,
  ): Promise<string> {
    const command = new UploadPartCommand({
      Bucket: this.config.bucket,
      Key: input.key,
      UploadId: input.uploadId,
      PartNumber: input.partNumber,
    });

    return getSignedUrl(this.client, command, {
      expiresIn: input.expiresInSeconds ?? 3600,
    });
  }

  async createMultipartUpload(
    input: MultipartUploadInput,
  ): Promise<{ uploadId: string }> {
    const s3Key = S3Key.create(POC_OWNER_ID, randomUUID(), input.filename);
    const response = await this.client.send(
      new CreateMultipartUploadCommand({
        Bucket: this.config.bucket,
        Key: s3Key.getValue(),
        ContentType: input.contentType,

      }),
    );

    if (!response.UploadId) {
      throw new Error('S3 did not return an upload ID');
    }

    return { uploadId: response.UploadId };
  }

  async uploadPart(input: UploadPartInput): Promise<{ etag: string }> {
    const response = await this.client.send(
      new UploadPartCommand({
        Bucket: this.config.bucket,
        Key: input.key,
        UploadId: input.uploadId,
        PartNumber: input.partNumber,
        Body: input.body,
      }),
    );

    if (!response.ETag) {
      throw new Error(`S3 did not return ETag for part ${input.partNumber}`);
    }

    return { etag: response.ETag };
  }

  async completeMultipartUpload(
    input: CompleteMultipartUploadInput,
  ): Promise<void> {
    await this.client.send(
      new CompleteMultipartUploadCommand({
        Bucket: this.config.bucket,
        Key: input.key,
        UploadId: input.uploadId,
        MultipartUpload: {
          Parts: input.parts.map((p) => ({
            PartNumber: p.partNumber,
            ETag: p.etag,
          })),
        },
      }),
    );
  }

  async abortMultipartUpload(key: string, uploadId: string): Promise<void> {
    await this.client.send(
      new AbortMultipartUploadCommand({
        Bucket: this.config.bucket,
        Key: key,
        UploadId: uploadId,
      }),
    );
  }
}
