import { InitiateStoredFileProps, StoredFile } from '../entities/stored-file.entity';
import { FileStatus } from '../enums/file-status.enum';

export const FILE_REPOSITORY = Symbol('FILE_REPOSITORY');

export interface FileRepository {
  save(file: StoredFile): Promise<void>;
  findById(id: string): Promise<StoredFile | null>;
  update(file: StoredFile): Promise<void>;
  updateUploadStatus(status: FileStatus, external_upload_id: string): Promise<void>
  findByUploadExternalId(externalId: string): Promise<StoredFile | null>
}
