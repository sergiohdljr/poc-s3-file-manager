import { FileStatus } from '../enums/file-status.enum';

export class InvalidFileStatusException extends Error {
  constructor(message: string, readonly currentStatus: FileStatus) {
    super(message);
    this.name = 'InvalidFileStatusException';
  }
}
