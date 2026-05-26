export enum FileStatus {
  PENDING = 'pending',
  UPLOADING = 'uploading',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

const COMPLETABLE_STATUSES: FileStatus[] = [
  FileStatus.PENDING,
  FileStatus.UPLOADING,
];

export function canCompleteUpload(status: FileStatus): boolean {
  return COMPLETABLE_STATUSES.includes(status);
}
