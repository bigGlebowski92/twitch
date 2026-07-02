import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { User } from '@prisma/generated/browser';
import { Authorization } from '@/shared/decorators/auth.decorator';
import { UserAgent } from '@/shared/decorators/user-agent.decorator';
import type { GraphQLContext } from '../../../shared/types/graphql-context.types';
import { UserModel } from '../account/models/user.model';
import { LoginInput } from './inputs/login.input';
import { SessionModel } from './models/session.model';
import { SessionService } from './session.service';

@Resolver('Session')
export class SessionResolver {
  public constructor(private readonly sessionService: SessionService) {}

  @Authorization()
  @Query(() => [SessionModel], { name: 'findByUser' })
  public async findByUser(@Context() { req }: GraphQLContext) {
    return this.sessionService.findByUser(req);
  }

  @Authorization()
  @Query(() => SessionModel, { name: 'findCurrentSession' })
  public findCurrentSession(@Context() { req }: GraphQLContext) {
    return this.sessionService.findCurrentSession(req);
  }

  @Mutation(() => UserModel, { name: 'login' })
  public async login(
    @Context() { req }: GraphQLContext,
    @Args('data') input: LoginInput,
    @UserAgent() userAgent: string,
  ): Promise<User> {
    return this.sessionService.login(req, input, userAgent);
  }

  @Authorization()
  @Mutation(() => Boolean, { name: 'logout' })
  public async logout(@Context() { req }: GraphQLContext): Promise<boolean> {
    await this.sessionService.logout(req);
    return true;
  }

  @Mutation(() => Boolean, { name: 'clearSession' })
  public clearSession(@Context() { req }: GraphQLContext) {
    return this.sessionService.clearSession(req);
  }

  @Authorization()
  @Mutation(() => Boolean, { name: 'removeSession' })
  public async removeSession(
    @Context() { req }: GraphQLContext,
    @Args('id') id: string,
  ): Promise<boolean> {
    await this.sessionService.removeSession(req, id);
    return true;
  }
}
