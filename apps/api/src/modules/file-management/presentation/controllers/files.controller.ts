import { Body, Controller, Inject, Post } from '@nestjs/common';
import { UploadFileUseCase } from '../../application/use-cases/upload-file.usecase';
import { InitiateStoredFileProps } from '../../domain/entities/stored-file.entity';
import { CompleteUploadUseCase } from '../../application/use-cases/complete-upload-file.usecase';
import { CompleteMultipartUploadInput } from '../../infrastructure/storage/object-storage.port';


@Controller('files')
export class FilesController {
    constructor(
        private readonly uploadFileUseCase: UploadFileUseCase,
        private readonly completeUploadUseCase: CompleteUploadUseCase
    ) { }

    @Post('upload')
    async uploadFile(@Body() body: InitiateStoredFileProps) {
        return await this.uploadFileUseCase.execute(body);
    }

    @Post('upload/complete')
    async completeUploadFile(@Body() body: CompleteMultipartUploadInput) {
        return await this.completeUploadUseCase.execute(body)
    }
}
