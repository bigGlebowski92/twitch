import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import type { User } from '@prisma/generated/browser';
import GraphQLUpload from 'graphql-upload/GraphQLUpload.mjs';
import type Upload from 'graphql-upload/Upload.mjs';
import { Authorization } from '@/shared/decorators/auth.decorator';
import { Authorized } from '@/shared/decorators/authorized.decorator';
import { FileValidationPipe } from '@/shared/pipes/file-validation.pipe';
import { UserModel } from '../account/models/user.model';
import { UpdateProfileInput } from './inputs/update-profile.input';
import { ProfileModel } from './models/profile.model';
import { ProfileService } from './profile.service';

@Resolver('Profile')
export class ProfileResolver {
  public constructor(private readonly profileService: ProfileService) {}

  @Query(() => ProfileModel, { name: 'profile' })
  public async profile(
    @Args('username') username: string,
  ): Promise<ProfileModel> {
    return this.profileService.getByUsername(username);
  }

  @Authorization()
  @Mutation(() => UserModel, { name: 'updateProfile' })
  public async updateProfile(
    @Authorized() user: User,
    @Args('input') input: UpdateProfileInput,
  ): Promise<UserModel> {
    return this.profileService.updateProfile(user, input);
  }

  @Authorization()
  @Mutation(() => UserModel, { name: 'changeAvatar' })
  public async changeAvatar(
    @Authorized() user: User,
    @Args({ name: 'avatar', type: () => GraphQLUpload }, FileValidationPipe)
    avatar: Upload,
  ): Promise<UserModel> {
    return this.profileService.changeAvatar(avatar, user);
  }

  @Authorization()
  @Mutation(() => UserModel, { name: 'removeAvatar' })
  public async removeAvatar(@Authorized() user: User): Promise<UserModel> {
    return this.profileService.removeAvatar(user);
  }
}
