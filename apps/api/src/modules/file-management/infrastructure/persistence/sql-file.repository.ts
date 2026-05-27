import { Inject, Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import { PG_POOL } from '../../../../shared/infrastructure/database.module';
import { InitiateStoredFileProps, StoredFile } from '../../domain/entities/stored-file.entity';
import { FileRepository } from '../../domain/repositories/file.repository';
import { FileMetadataMapper } from './file-metadata.mapper';
import { randomUUID } from 'crypto';
import { FileStatus } from '../../domain/enums/file-status.enum';

@Injectable()
export class SqlFileRepository implements FileRepository {
  constructor(@Inject(PG_POOL) private readonly pool: Pool) { }

  async save(file: InitiateStoredFileProps): Promise<void> {

    await this.pool.query(
      `INSERT INTO file_metadata (
          owner_id, folder_id, filename, mime_type, size,
         status, created_at, updated_at, external_upload_id
       ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       `,
      [
        file.ownerId,
        file.folderId,
        file.filename,
        file.mimeType,
        file.size,
        FileStatus.PENDING,
        new Date(),
        new Date(),
        file.external_upload_id
      ],
    );
  }

  async findById(id: string): Promise<StoredFile | null> {
    const { rows } = await this.pool.query(
      `SELECT
         id, owner_id, folder_id, filename, mime_type, size,
         status,external_upload_id, created_at, updated_at
       FROM file_metadata
       WHERE id = $1`,
      [id],
    );

    return rows[0] ? FileMetadataMapper.toDomain(rows[0]) : null;
  }

  async update(file: StoredFile): Promise<void> {
    await this.pool.query(
      `UPDATE file_metadata SET
         folder_id = $2,
         status = $3,
         external_upload_id = $4,
         updated_at = $5
       WHERE id = $1`,
      [
        file.id,
        file.folderId,
        file.status,
        file.externalId,
        file.updatedAt,
      ],
    );

  }

  async findByUploadExternalId(externalUploadId: string) {
    const { rows } = await this.pool.query(
      `SELECT
         id, owner_id, folder_id, filename, mime_type, size,
         status, external_upload_id, created_at, updated_at
       FROM file_metadata
       WHERE id = $1`,
      [externalUploadId],
    );

    return rows[0] ? FileMetadataMapper.toDomain(rows[0]) : null;
  }

}
