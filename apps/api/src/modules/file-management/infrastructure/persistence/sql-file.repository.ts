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
    console.log('Saving file:', JSON.stringify(file, null, 2));

    await this.pool.query(
      `INSERT INTO file_metadata (
          owner_id, folder_id, filename, mime_type, size,
         status, created_at, updated_at
       ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
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
