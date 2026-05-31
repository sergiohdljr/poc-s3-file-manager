import { FILE_REPOSITORY } from "../../domain/repositories/file.repository";
import { Inject, Injectable } from "@nestjs/common";
import { SqlFileRepository } from "../../infrastructure/persistence/sql-file.repository";
import { S3ObjectStorageAdapter } from "../../infrastructure/storage/s3-object-storage.adapter";
import { OBJECT_STORAGE } from "../../infrastructure/storage/object-storage.port";
import { S3Key } from "../../domain";


@Injectable()
export class DownloadFileUseCase {
    constructor(
        @Inject(OBJECT_STORAGE) private readonly objectStorage: S3ObjectStorageAdapter,
        @Inject(FILE_REPOSITORY) private readonly fileRepository: SqlFileRepository,
    ) { }

    async execute(userId: string, fileId: string) {

        const file = await this.fileRepository.findById(fileId)

        if (file === null) {
            console.log("caiu erro")
        }

        const externalServiceKey = S3Key.create(userId, file?.filename ?? '').getValue()

        const getSignedUrl = await this.objectStorage.getPresignedDownloadUrl({
            key: externalServiceKey
        })

        return {
            downloadUrl: getSignedUrl
        }

    }
}