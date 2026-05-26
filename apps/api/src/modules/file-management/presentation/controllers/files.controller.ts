import { Body, Controller, Inject, Post } from '@nestjs/common';
import { UploadFileUseCase } from '../../application/use-cases/upload-file.usecase';
import { InitiateStoredFileProps, StoredFile } from '../../domain/entities/stored-file.entity';

@Controller('files')
export class FilesController {
    constructor(
        private readonly uploadFileUseCase: UploadFileUseCase,
    ) { }

    @Post('upload')
    async uploadFile(@Body() body: InitiateStoredFileProps): Promise<string> {
        return await this.uploadFileUseCase.execute(body);
    }
}
