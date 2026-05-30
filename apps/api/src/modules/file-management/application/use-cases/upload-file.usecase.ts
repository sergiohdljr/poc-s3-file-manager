import { FILE_REPOSITORY } from "../../domain/repositories/file.repository";
import { OBJECT_STORAGE } from "../../infrastructure/storage/object-storage.port";
import { Inject, Injectable } from "@nestjs/common";
import { S3ObjectStorageAdapter } from "../../infrastructure/storage/s3-object-storage.adapter";
import { SqlFileRepository } from "../../infrastructure/persistence/sql-file.repository";
import { InitiateStoredFileProps, StoredFile } from "../../domain/entities/stored-file.entity";


@Injectable()
export class UploadFileUseCase {
    constructor(
        @Inject(OBJECT_STORAGE) private readonly objectStorage: S3ObjectStorageAdapter,
        @Inject(FILE_REPOSITORY) private readonly fileRepository: SqlFileRepository,
    ) { }

    async execute(input: InitiateStoredFileProps) {

        const { uploadId, key } = await this.objectStorage.createMultipartUpload({
            filename: input.filename,
            contentType: input.mimeType,
        })

        const storedFile = StoredFile.initiate({
            ...input,
            external_upload_id: uploadId
        })


        await this.fileRepository.save(storedFile);

        const CHUNKSIZE = 5 * 1024 * 1024
        const totalParts = Math.ceil(input.size / CHUNKSIZE)
        const partNumbers = Array.from({ length: totalParts }, (_, i) => i + 1)

        const signedUrls = await Promise.all(
            partNumbers.map((partNumber) => this.objectStorage.getPresignedUploadPartUrl({
                partNumber,
                uploadId,
                key,
            }))
        )

        if (!signedUrls) {
            storedFile.fail()
            await this.fileRepository.updateUploadStatus(storedFile.status, storedFile?.externalId ?? '')
        }

        storedFile.startMultipartUpload(uploadId)
        await this.fileRepository.updateUploadStatus(storedFile.status, storedFile?.externalId ?? '')

        return { signedUrls, uploadId, key }

    }
}