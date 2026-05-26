import { Inject, Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import { PG_POOL } from '../../../../shared/infrastructure/database.module';
import { StoredFile } from '../../domain/entities/stored-file.entity';
import { FileRepository } from '../../domain/repositories/file.repository';
import { FileMetadataMapper } from './file-metadata.mapper';

@Injectable()
export class SqlFileRepository implements FileRepository {
  constructor(@Inject(PG_POOL) private readonly pool: Pool) {}

  async save(file: StoredFile): Promise<void> {
    await this.pool.query(
      `INSERT INTO file_metadata (
         id, owner_id, folder_id, filename, mime_type, size,
         status, s3_key, upload_id, created_at, updated_at
       ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       ON CONFLICT (id) DO UPDATE SET
         folder_id = EXCLUDED.folder_id,
         status = EXCLUDED.status,
         upload_id = EXCLUDED.upload_id,
         updated_at = EXCLUDED.updated_at`,
      [
        file.id,
        file.ownerId,
        file.folderId,
        file.filename,
        file.mimeType,
        file.size,
        file.status,
        file.s3Key,
        file.uploadId,
        file.createdAt,
        file.updatedAt,
      ],
    );
  }

  async findById(id: string): Promise<StoredFile | null> {
    const { rows } = await this.pool.query(
      `SELECT
         id, owner_id, folder_id, filename, mime_type, size,
         status, s3_key, upload_id, created_at, updated_at
       FROM file_metadata
       WHERE id = $1`,
      [id],
    );

    return rows[0] ? FileMetadataMapper.toDomain(rows[0]) : null;
  }

  async update(file: StoredFile): Promise<void> {
    const { rowCount } = await this.pool.query(
      `UPDATE file_metadata SET
         folder_id = $2,
         status = $3,
         upload_id = $4,
         updated_at = $5
       WHERE id = $1`,
      [
        file.id,
        file.folderId,
        file.status,
        file.uploadId,
        file.updatedAt,
      ],
    );

    if (rowCount === 0) {
      await this.save(file);
    }
  }
}
