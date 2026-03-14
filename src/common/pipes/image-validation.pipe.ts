import {
  BadRequestException,
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
} from '@nestjs/common';

import { IMAGE_UPLOAD_CONFIG } from '../constants/image-upload-config.constant';

export class ImageValidationPipe extends ParseFilePipe {
  constructor({ isRequired = false }: { isRequired?: boolean }) {
    super({
      validators: [
        new MaxFileSizeValidator({
          maxSize: IMAGE_UPLOAD_CONFIG.maxSize,
          message: 'Ukuran file terlalu besar (Maks 5MB)',
        }),
        new FileTypeValidator({
          fileType: IMAGE_UPLOAD_CONFIG.fileType,
        }),
      ],
      fileIsRequired: isRequired,
      exceptionFactory: (error) => {
        if (error.includes('required')) {
          return new BadRequestException('Image is required!');
        }
        return new BadRequestException(error);
      },
    });
  }
}
