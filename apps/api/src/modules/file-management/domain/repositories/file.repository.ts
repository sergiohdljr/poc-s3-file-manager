import { StoredFile } from '../entities/stored-file.entity';

export const FILE_REPOSITORY = Symbol('FILE_REPOSITORY');

export interface FileRepository {
  save(file: StoredFile): Promise<void>;
  findById(id: string): Promise<StoredFile | null>;
  update(file: StoredFile): Promise<void>;
}
