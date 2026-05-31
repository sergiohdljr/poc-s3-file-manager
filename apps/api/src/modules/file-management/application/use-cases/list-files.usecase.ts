import { FILE_REPOSITORY } from "../../domain/repositories/file.repository";
import { OBJECT_STORAGE } from "../../infrastructure/storage/object-storage.port";
import { Inject, Injectable } from "@nestjs/common";
import { S3ObjectStorageAdapter } from "../../infrastructure/storage/s3-object-storage.adapter";
import { SqlFileRepository } from "../../infrastructure/persistence/sql-file.repository";


@Injectable()
export class ListFileUseCase {
    constructor(
        @Inject(FILE_REPOSITORY) private readonly fileRepository: SqlFileRepository,
    ) { }

    async execute(userId: string) {
        return await this.fileRepository.list(userId)
    }
}