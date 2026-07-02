import { Module } from '@nestjs/common';
import { GraphQLAuthGuard } from '../../../shared/guards/graphql-auth.guard';
import { VerificationModule } from '../verification/verification.module';
import { AccountResolver } from './account.resolver';
import { AccountService } from './account.service';

@Module({
  imports: [VerificationModule],
  providers: [AccountResolver, AccountService, GraphQLAuthGuard],
})
export class AccountModule {}
