import { Module } from '@nestjs/common';
import { GraphQLAuthGuard } from '../../../shared/guards/graphql-auth.guard';
import { AccountResolver } from './account.resolver';
import { AccountService } from './account.service';

@Module({
  providers: [AccountResolver, AccountService, GraphQLAuthGuard],
})
export class AccountModule {}
