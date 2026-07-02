import { InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from '@prisma/generated/browser';
import type { Request } from 'express';
import type { SessionMetadata } from '../types/session-metadata.types';

export function saveSession(
  request: Request,
  user: User,
  metadata: SessionMetadata,
): Promise<void> {
  request.session.userId = user.id;
  request.session.createdAt = new Date();
  request.session.metadata = metadata;

  return new Promise((resolve, reject) => {
    request.session.save((err) => {
      if (err) {
        reject(new InternalServerErrorException('Failed to save session'));
        return;
      }
      resolve();
    });
  });
}

export function destroySession(
  request: Request,
  configService: ConfigService,
): Promise<void> {
  return new Promise((resolve, reject) => {
    request.session.destroy((err) => {
      if (err) {
        reject(new InternalServerErrorException('Failed to destroy session'));
        return;
      }

      request.res?.clearCookie(
        configService.getOrThrow<string>('SESSION_NAME'),
      );

      resolve();
    });
  });
}
