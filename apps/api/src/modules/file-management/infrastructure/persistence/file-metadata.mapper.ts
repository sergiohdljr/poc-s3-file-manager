import { FileStatus } from '../../domain/enums/file-status.enum';
import { StoredFile } from '../../domain/entities/stored-file.entity';
import { S3Key } from '../../domain/value-objects/s3-key.vo';

export interface FileMetadataRow {
  id: string;
  owner_id: string;
  folder_id: string | null;
  filename: string;
  mime_type: string;
  size: string;
  status: string;
  s3_key: string;
  external_upload_id: string | null;
  created_at: Date;
  updated_at: Date;
}

export class FileMetadataMapper {
  static toDomain(row: FileMetadataRow): StoredFile {
    return StoredFile.reconstitute({
      id: row.id,
      ownerId: row.owner_id,
      folderId: row.folder_id,
      filename: row.filename,
      mimeType: row.mime_type,
      size: Number(row.size),
      status: row.status as FileStatus,
      external_upload_id: row.external_upload_id,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    });
  }
}
