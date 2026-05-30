import { randomUUID } from 'crypto';
import { BaseEntity } from '../../../../shared/domain/base.entity';
import { POC_OWNER_ID } from '../constants/poc-owner';
import {
  canCompleteUpload,
  FileStatus,
} from '../enums/file-status.enum';
import { InvalidFileSizeException } from '../exceptions/invalid-file-size.exception';
import { InvalidFileStatusException } from '../exceptions/invalid-file-status.exception';
import { S3Key } from '../value-objects/s3-key.vo';

export interface InitiateStoredFileProps {
  filename: string;
  mimeType: string;
  size: number;
  folderId?: string | null;
  ownerId?: string;
  external_upload_id: string
}

export interface StoredFileProps {
  ownerId: string;
  folderId: string | null;
  filename: string;
  mimeType: string;
  size: number;
  status: FileStatus;
  external_upload_id: string | null;
}

export class StoredFile extends BaseEntity {
  private readonly _ownerId: string;
  private _folderId: string | null;
  private readonly _filename: string;
  private readonly _mimeType: string;
  private readonly _size: number;
  private _status: FileStatus;
  private _external_upload_id: string | null;

  private constructor(props: StoredFileProps, id?: string, timestamps?: {
    createdAt: Date;
    updatedAt: Date;
  }) {
    super(id);
    if (timestamps) {
      (this as { createdAt: Date }).createdAt = timestamps.createdAt;
      this.updatedAt = timestamps.updatedAt;
    }

    this._ownerId = props.ownerId;
    this._folderId = props.folderId;
    this._filename = props.filename;
    this._mimeType = props.mimeType;
    this._size = props.size;
    this._status = props.status;
    this._external_upload_id = props.external_upload_id
  }

  static initiate(props: InitiateStoredFileProps): StoredFile {
    StoredFile.validateSize(props.size);

    const ownerId = props.ownerId ?? POC_OWNER_ID;
    const id = randomUUID();

    return new StoredFile(
      {
        ownerId,
        folderId: props.folderId ?? null,
        filename: props.filename,
        mimeType: props.mimeType,
        size: props.size,
        status: FileStatus.PENDING,
        external_upload_id: props.external_upload_id
      },
      id,
    );
  }

  static reconstitute(
    props: StoredFileProps & { id: string; createdAt: Date; updatedAt: Date },
  ): StoredFile {
    return new StoredFile(props, props.id, {
      createdAt: props.createdAt,
      updatedAt: props.updatedAt,
    });
  }

  get ownerId(): string {
    return this._ownerId;
  }

  get folderId(): string | null {
    return this._folderId;
  }

  get filename(): string {
    return this._filename;
  }

  get mimeType(): string {
    return this._mimeType;
  }

  get size(): number {
    return this._size;
  }

  get status(): FileStatus {
    return this._status;
  }

  get externalId(): string | null {
    return this._external_upload_id;
  }

  startMultipartUpload(uploadId: string): void {
    if (this._status !== FileStatus.PENDING) {
      throw new InvalidFileStatusException(
        'Multipart upload can only start from pending status',
        this._status,
      );
    }
    if (!uploadId.trim()) {
      throw new Error('uploadId is required');
    }

    this._external_upload_id = uploadId;
    this._status = FileStatus.UPLOADING;
    this.touch();
  }

  complete(uploadId: string): void {
    if (!canCompleteUpload(this._status)) {
      throw new InvalidFileStatusException(
        `Cannot complete upload from status "${this._status}"`,
        this._status,
      );
    }

    this._status = FileStatus.COMPLETED;
    this._external_upload_id = uploadId
    this.touch();
  }

  fail(): void {
    if (this._status === FileStatus.COMPLETED) {
      throw new InvalidFileStatusException(
        'Cannot mark a completed file as failed',
        this._status,
      );
    }

    this._status = FileStatus.FAILED;
    this._external_upload_id = null;
    this.touch();
  }

  private touch(): void {
    this.updatedAt = new Date();
  }

  private static validateSize(size: number): void {
    if (!Number.isFinite(size) || size <= 0) {
      throw new InvalidFileSizeException(size);
    }
  }
}
