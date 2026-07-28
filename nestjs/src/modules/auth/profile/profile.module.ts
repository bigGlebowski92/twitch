import { Module } from '@nestjs/common';
import { StorageModule } from '@/modules/libs/storage/storage.module';
import { GraphQLAuthGuard } from '@/shared/guards/graphql-auth.guard';
import { ProfileResolver } from './profile.resolver';
import { ProfileService } from './profile.service';

@Module({
  imports: [StorageModule],
  providers: [ProfileResolver, ProfileService, GraphQLAuthGuard],
})
export class ProfileModule {}
