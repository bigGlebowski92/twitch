import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Authorization } from '@/shared/decorators/auth.decorator';
import { Authorized } from '@/shared/decorators/authorized.decorator';
import { AccountService } from './account.service';
import { CreateUserInput } from './inputs/create-user.input';
import { UserModel } from './models/user.model';

@Resolver('Account')
export class AccountResolver {
  constructor(private readonly accountService: AccountService) {}

  @Authorization()
  @Query(() => UserModel, { name: 'me' })
  public async me(@Authorized('id') id: string): Promise<UserModel> {
    return this.accountService.me(id);
  }

  @Mutation(() => UserModel, { name: 'createUser' })
  public async create(
    @Args('input') input: CreateUserInput,
  ): Promise<UserModel> {
    return this.accountService.create(input);
  }
}
