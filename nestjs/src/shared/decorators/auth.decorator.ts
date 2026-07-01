import { applyDecorators, UseGuards } from '@nestjs/common';
import { GraphQLAuthGuard } from '../guards/graphql-auth.guard';

export function Authorization() {
  return applyDecorators(UseGuards(GraphQLAuthGuard));
}
