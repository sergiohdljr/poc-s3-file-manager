import { Inject, Injectable } from "@nestjs/common";
import { CompleteMultipartUploadInput, OBJECT_STORAGE } from "../../infrastructure/storage/object-storage.port";
import { S3ObjectStorageAdapter } from "../../infrastructure/storage/s3-object-storage.adapter";
import { SqlFileRepository } from "../../infrastructure/persistence/sql-file.repository";
import { FILE_REPOSITORY } from "../../domain";

@Injectable()
export class CompleteUploadUseCase {
    constructor(
        @Inject(OBJECT_STORAGE) private readonly objectStorage: S3ObjectStorageAdapter,
        @Inject(FILE_REPOSITORY) private readonly fileRepository: SqlFileRepository
    ) { }

    async execute(input: CompleteMultipartUploadInput) {

        //await this.fileRepository.update(file)
        await this.objectStorage.completeMultipartUpload(input)

        return {
            message: "upload completed"
        }
    }
}