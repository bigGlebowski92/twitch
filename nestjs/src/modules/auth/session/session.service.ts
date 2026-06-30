import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from '@prisma/generated/browser';
import { verify } from 'argon2';
import { Request } from 'express';
import { PrismaService } from '../../../core/prisma/prisma.service';
import { LoginInput } from './inputs/login.input';

@Injectable()
export class SessionService {
  public constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  public async login(request: Request, input: LoginInput): Promise<User> {
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

    request.session.userId = user.id;
    request.session.createdAt = new Date();

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
}
