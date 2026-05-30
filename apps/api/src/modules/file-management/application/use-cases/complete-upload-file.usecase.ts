import { Inject, Injectable } from "@nestjs/common";
import { CompleteMultipartUploadInput, OBJECT_STORAGE } from "../../infrastructure/storage/object-storage.port";
import { S3ObjectStorageAdapter } from "../../infrastructure/storage/s3-object-storage.adapter";
import { SqlFileRepository } from "../../infrastructure/persistence/sql-file.repository";
import { FILE_REPOSITORY, FileStatus, StoredFile } from "../../domain";

@Injectable()
export class CompleteUploadUseCase {
    constructor(
        @Inject(OBJECT_STORAGE) private readonly objectStorage: S3ObjectStorageAdapter,
        @Inject(FILE_REPOSITORY) private readonly fileRepository: SqlFileRepository
    ) { }

    async execute(input: CompleteMultipartUploadInput) {


        await this.objectStorage.completeMultipartUpload(input)
        await this.fileRepository.updateUploadStatus(FileStatus.COMPLETED, input.uploadId)

        return {
            message: "upload completed"
        }
    }
}