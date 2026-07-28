import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import type { FileUpload } from 'graphql-upload/processRequest.mjs';
import { validateFileFormat, validateFileSize } from '../utils/file.util';

@Injectable()
export class FileValidationPipe implements PipeTransform {
  public async transform(
    value: FileUpload | Promise<FileUpload>,
  ): Promise<FileUpload> {
    const file = await value;

    if (!file?.filename) {
      throw new BadRequestException('File name is required');
    }

    const { filename, createReadStream } = file;
    const allowedFormats = ['jpg', 'jpeg', 'png', 'webp', 'gif'];
    const isFileFormatValid = validateFileFormat(filename, allowedFormats);

    if (!isFileFormatValid) {
      throw new BadRequestException('Invalid file format');
    }

    const maxSize = 10 * 1024 * 1024;
    const isFileSizeValid = await validateFileSize(createReadStream(), maxSize);

    if (!isFileSizeValid) {
      throw new BadRequestException(
        'File size exceeds the maximum allowed size',
      );
    }

    return file;
  }
}
