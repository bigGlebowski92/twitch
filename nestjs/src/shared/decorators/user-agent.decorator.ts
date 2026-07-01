import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import type { Request } from 'express';
import type { GraphQLContext } from '../types/graphql-context.types';

export const UserAgent = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): string | undefined => {
    if (ctx.getType() === 'http') {
      const request = ctx.switchToHttp().getRequest<Request>();
      return request.headers['user-agent'];
    }

    const gqlContext = GqlExecutionContext.create(ctx);
    const { req } = gqlContext.getContext<GraphQLContext>();
    return req.headers['user-agent'];
  },
);
