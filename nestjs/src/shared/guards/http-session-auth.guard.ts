import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';
import { PrismaService } from '@/core/prisma/prisma.service';

@Injectable()
export class HttpSessionAuthGuard implements CanActivate {
  public constructor(private readonly prismaService: PrismaService) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const userId = request.session.userId;

    if (!userId) {
      throw new UnauthorizedException('Unauthorized');
    }

    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('Unauthorized');
    }

    request.user = user;
    return true;
  }
}
