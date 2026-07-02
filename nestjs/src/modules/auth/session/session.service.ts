import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from '@prisma/generated/browser';
import { verify } from 'argon2';
import type { Request } from 'express';
import { PrismaService } from '../../../core/prisma/prisma.service';
import { RedisService } from '../../../core/redis/redis.service';
import {
  getSessionIdFromKey,
  normalizeStoredSession,
  parseStoredSession,
  type StoredSession,
} from '../../../shared/types/session-metadata.types';
import { getSessionMetadata } from '../../../shared/utils/session-metadata.util';
import { LoginInput } from './inputs/login.input';

@Injectable()
export class SessionService {
  public constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
    private readonly redisService: RedisService,
  ) {}

  public async findByUser(req: Request): Promise<StoredSession[]> {
    const userId = req.session.userId;
    if (!userId) {
      throw new UnauthorizedException('User not found');
    }

    const prefix = this.configService.getOrThrow<string>('SESSION_FOLDER');
    const keys = await this.redisService.getKeys(`${prefix}*`);
    const userSessions: StoredSession[] = [];

    for (const key of keys) {
      const sessionData = await this.redisService.getValue(key);
      if (!sessionData) {
        continue;
      }

      const session = parseStoredSession(sessionData);
      if (session.userId !== userId) {
        continue;
      }

      userSessions.push(
        normalizeStoredSession({
          ...session,
          id: getSessionIdFromKey(key, prefix),
        }),
      );
    }

    userSessions.sort((a, b) => {
      const aTime = new Date(a.createdAt ?? 0).getTime();
      const bTime = new Date(b.createdAt ?? 0).getTime();
      return bTime - aTime;
    });

    return userSessions;
  }

  public findCurrentSession(req: Request): StoredSession {
    const sessionId = req.session.id;
    const userId = req.session.userId;

    if (!sessionId || !userId) {
      throw new UnauthorizedException('Session not found');
    }

    return normalizeStoredSession({
      id: sessionId,
      userId,
      createdAt: req.session.createdAt,
      metadata: req.session.metadata,
    });
  }

  public async login(
    request: Request,
    input: LoginInput,
    userAgent: string,
  ): Promise<User> {
    const { login, password } = input;
    const user = await this.prismaService.user.findFirst({
      where: {
        OR: [{ username: { equals: login } }, { email: { equals: login } }],
      },
    });
    if (!user) {
      throw new BadRequestException('Invalid login or password');
    }
    const isPasswordValid = await verify(user.password, password);
    if (!isPasswordValid) {
      throw new BadRequestException('Invalid login or password');
    }

    const metadata = getSessionMetadata(request, userAgent);

    request.session.userId = user.id;
    request.session.createdAt = new Date();
    request.session.metadata = metadata;

    await this.saveSession(request);

    return user;
  }

  public async logout(request: Request): Promise<void> {
    await this.destroySession(request);

    request.res?.clearCookie(
      this.configService.getOrThrow<string>('SESSION_NAME'),
    );
  }

  private saveSession(request: Request): Promise<void> {
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

  private destroySession(request: Request): Promise<void> {
    return new Promise((resolve, reject) => {
      request.session.destroy((err) => {
        if (err) {
          reject(new InternalServerErrorException('Failed to destroy session'));
          return;
        }
        resolve();
      });
    });
  }

  public clearSession(request: Request): void {
    request.res?.clearCookie(
      this.configService.getOrThrow<string>('SESSION_NAME'),
    );
  }

  public async removeSession(request: Request, id: string): Promise<void> {
    if (request.session.id === id) {
      throw new BadRequestException('Cannot remove current session');
    }

    const prefix = this.configService.getOrThrow<string>('SESSION_FOLDER');
    await this.redisService.del(`${prefix}${id}`);
  }
}
