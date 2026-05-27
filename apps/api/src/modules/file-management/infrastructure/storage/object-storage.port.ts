export const OBJECT_STORAGE = Symbol('OBJECT_STORAGE');

export interface PutObjectInput {
  key: string;
  body: Buffer | Uint8Array | string;
  contentType?: string;
}

export interface GetObjectInput {
  key: string;
}

export interface DeleteObjectInput {
  key: string;
}

export interface PresignedDownloadInput {
  key: string;
  expiresInSeconds?: number;
}

export interface PresignedUploadPartInput {
  key: string;
  uploadId: string;
  partNumber: number;
  expiresInSeconds?: number;
}

export interface MultipartUploadInput {
  filename: string;
  contentType?: string;
}

export interface UploadPartInput {
  key: string;
  uploadId: string;
  partNumber: number;
  body: Buffer | Uint8Array;
}

export interface CompleteMultipartUploadInput {
  key: string;
  uploadId: string;
  parts: { PartNumber: number; ETag: string }[];
}

export interface ObjectStorage {
  putObject(input: PutObjectInput): Promise<void>;
  getObject(input: GetObjectInput): Promise<Uint8Array>;
  deleteObject(input: DeleteObjectInput): Promise<void>;
  getPresignedDownloadUrl(input: PresignedDownloadInput): Promise<string>;
  getPresignedUploadPartUrl(input: PresignedUploadPartInput): Promise<string>;
  createMultipartUpload(input: MultipartUploadInput): Promise<{ uploadId: string }>;
  uploadPart(input: UploadPartInput): Promise<{ etag: string }>;
  completeMultipartUpload(input: CompleteMultipartUploadInput): Promise<void>;
  abortMultipartUpload(key: string, uploadId: string): Promise<void>;
}
