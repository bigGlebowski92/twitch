import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { User } from '@prisma/generated/browser';
import type { GraphQLContext } from '../../../shared/types/graphql-context.types';
import { UserModel } from '../account/models/user.model';
import { LoginInput } from './inputs/login.input';
import { SessionService } from './session.service';

@Resolver('Session')
export class SessionResolver {
  public constructor(private readonly sessionService: SessionService) {}

  @Mutation(() => UserModel, { name: 'login' })
  public async login(
    @Context() { req }: GraphQLContext,
    @Args('data') input: LoginInput,
  ): Promise<User> {
    return this.sessionService.login(req, input);
  }

  @Mutation(() => Boolean, { name: 'logout' })
  public async logout(@Context() { req }: GraphQLContext): Promise<boolean> {
    await this.sessionService.logout(req);
    return true;
  }
}
