import { StoredFile } from "../../domain/entities/stored-file.entity";
import { FILE_REPOSITORY, FileRepository } from "../../domain/repositories/file.repository";
import { OBJECT_STORAGE, ObjectStorage } from "../../infrastructure/storage/object-storage.port";
import { Inject, Injectable } from "@nestjs/common";
import { S3ObjectStorageAdapter } from "../../infrastructure/storage/s3-object-storage.adapter";
import { SqlFileRepository } from "../../infrastructure/persistence/sql-file.repository";
import { InitiateStoredFileProps } from "../../domain/entities/stored-file.entity";

@Injectable()
export class UploadFileUseCase {
    constructor(
        @Inject(OBJECT_STORAGE) private readonly objectStorage: S3ObjectStorageAdapter,
        @Inject(FILE_REPOSITORY) private readonly fileRepository: SqlFileRepository,
    ) { }

    async execute(input: InitiateStoredFileProps): Promise<string> {

        await this.fileRepository.save(input);

        const { uploadId } = await this.objectStorage.createMultipartUpload({
            filename: input.filename,
            contentType: input.mimeType,
        })

        return uploadId;

    }
}