import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { User } from '@prisma/generated/browser';
import type { Request } from 'express';
import type { GraphQLContext } from '../types/graphql-context.types';

function resolveUser(ctx: ExecutionContext): User {
  if (ctx.getType() === 'http') {
    const { user } = ctx.switchToHttp().getRequest<Request>();
    if (!user) {
      throw new UnauthorizedException('Unauthorized');
    }
    return user;
  }

  const gqlContext = GqlExecutionContext.create(ctx);
  const { req } = gqlContext.getContext<GraphQLContext>();
  if (!req.user) {
    throw new UnauthorizedException('Unauthorized');
  }
  return req.user;
}

export const Authorized = createParamDecorator(
  (data: keyof User | undefined, ctx: ExecutionContext) => {
    const user = resolveUser(ctx);
    return data ? user[data] : user;
  },
);
