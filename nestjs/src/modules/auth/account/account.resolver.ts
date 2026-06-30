import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { User } from '@prisma/generated/browser';
import { AccountService } from './account.service';
import { CreateUserInput } from './inputs/create-user.input';
import { UserModel } from './models/user.model';

@Resolver('Account')
export class AccountResolver {
  constructor(private readonly accountService: AccountService) {}

  @Query(() => [UserModel], { name: 'findAllUsers' })
  public async findAll(): Promise<User[]> {
    return this.accountService.findAll();
  }

  @Mutation(() => UserModel, { name: 'createUser' })
  public async create(
    @Args('input') input: CreateUserInput,
  ): Promise<UserModel> {
    return this.accountService.create(input);
  }
}
