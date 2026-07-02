import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { UserAgent } from '@/shared/decorators/user-agent.decorator';
import type { GraphQLContext } from '@/shared/types/graphql-context.types';
import { UserModel } from '../account/models/user.model';
import { VerificationInput } from './input/verification.input';
import { VerificationService } from './verification.service';

@Resolver('Verification')
export class VerificationResolver {
  constructor(private readonly verificationService: VerificationService) {}

  @Mutation(() => UserModel, { name: 'verify' })
  public verify(
    @Context() { req }: GraphQLContext,
    @Args('input') input: VerificationInput,
    @UserAgent() userAgent: string,
  ) {
    return this.verificationService.verify(req, input, userAgent);
  }
}
