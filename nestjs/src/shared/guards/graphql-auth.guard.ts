import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { PrismaService } from '../../core/prisma/prisma.service';
import type { GraphQLContext } from '../types/graphql-context.types';

@Injectable()
export class GraphQLAuthGuard implements CanActivate {
  public constructor(private readonly prismaService: PrismaService) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const gqlContext = GqlExecutionContext.create(context);
    const { req } = gqlContext.getContext<GraphQLContext>();

    const userId = req.session.userId;
    if (!userId) {
      throw new UnauthorizedException('Unauthorized');
    }

    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('Unauthorized');
    }

    req.user = user;
    return true;
  }
}
