import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { UserAgent } from '@/shared/decorators/user-agent.decorator';
import type { GraphQLContext } from '@/shared/types/graphql-context.types';
import { NewPasswordInput } from './inputs/new-password.input';
import { ResetPasswordInput } from './inputs/reset-password.input';
import { PasswordRecoveryService } from './password-recovery.service';

@Resolver('PasswordRecovery')
export class PasswordRecoveryResolver {
  public constructor(
    private readonly passwordRecoveryService: PasswordRecoveryService,
  ) {}

  @Mutation(() => Boolean)
  public async resetPassword(
    @Context() { req }: GraphQLContext,
    @Args('data') input: ResetPasswordInput,
    @UserAgent() userAgent: string,
  ): Promise<boolean> {
    return this.passwordRecoveryService.resetPassword(req, input, userAgent);
  }

  @Mutation(() => Boolean)
  public async setNewPassword(
    @Args('data') input: NewPasswordInput,
  ): Promise<boolean> {
    return this.passwordRecoveryService.setNewPassword(input);
  }
}
