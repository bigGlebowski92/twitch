import {
  BadRequestException,
  Controller,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { User } from '@prisma/generated/browser';
import type { Request } from 'express';
import { AccountService } from '@/modules/auth/account/account.service';
import { HttpSessionAuthGuard } from '@/shared/guards/http-session-auth.guard';
import { StorageService } from './storage.service';

interface AuthenticatedRequest extends Request {
  user: User;
}

@Controller('storage')
export class StorageController {
  public constructor(
    private readonly storageService: StorageService,
    private readonly accountService: AccountService,
  ) {}

  @Post('avatar')
  @UseGuards(HttpSessionAuthGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  public async uploadAvatar(
    @Req() request: AuthenticatedRequest,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    const avatarUrl = await this.storageService.uploadAvatar(
      request.user.id,
      file.buffer,
      file.mimetype,
    );

    return this.accountService.updateAvatar(request.user.id, avatarUrl);
  }
}
