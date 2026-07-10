import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { Authorization } from '@/shared/decorators/auth.decorator';
import { UserAgent } from '@/shared/decorators/user-agent.decorator';
import type { GraphQLContext } from '@/shared/types/graphql-context.types';
import { AuthModel } from '../account/models/auth.model';
import { DeactivateService } from './deactivate.service';
import { DeactivateAccountInput } from './inputs/deactivate-account.input';
import { DeactivateInput } from './inputs/deactivate.input';

@Resolver('Deactivate')
export class DeactivateResolver {
  public constructor(private readonly deactivateService: DeactivateService) {}

  @Authorization()
  @Mutation(() => AuthModel, { name: 'deactivateAccount' })
  public async deactivateAccount(
    @Context() { req }: GraphQLContext,
    @Args('input') input: DeactivateAccountInput,
    @UserAgent() userAgent: string,
  ): Promise<AuthModel> {
    return this.deactivateService.deactivateAccount(req, input, userAgent);
  }

  @Mutation(() => AuthModel, { name: 'deactivate' })
  public async deactivate(
    @Context() { req }: GraphQLContext,
    @Args('input') input: DeactivateInput,
  ): Promise<AuthModel> {
    const user = await this.deactivateService.deactivate(req, input.token);
    return { user, message: 'Account deactivated' };
  }
}
