import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import type { User } from '@prisma/generated/browser';
import GraphQLUpload from 'graphql-upload/GraphQLUpload.mjs';
import type Upload from 'graphql-upload/Upload.mjs';
import { Authorization } from '@/shared/decorators/auth.decorator';
import { Authorized } from '@/shared/decorators/authorized.decorator';
import { FileValidationPipe } from '@/shared/pipes/file-validation.pipe';
import { UserModel } from '../account/models/user.model';
import {
  SocialLinkInput,
  SocialLinkOrderInput,
} from './inputs/social-link.input';
import { UpdateProfileInput } from './inputs/update-profile.input';
import { ProfileModel } from './models/profile.model';
import { SocialLinkModel } from './models/social-link.model';
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
  @Query(() => [SocialLinkModel], { name: 'findSocialLinks' })
  public async findSocialLinks(
    @Authorized() user: User,
  ): Promise<SocialLinkModel[]> {
    return this.profileService.findSocialLinks(user);
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

  @Authorization()
  @Mutation(() => Boolean, { name: 'addSocialLink' })
  public async addSocialLink(
    @Authorized() user: User,
    @Args('input') input: SocialLinkInput,
  ): Promise<boolean> {
    return this.profileService.addSocialLink(user, input);
  }

  @Authorization()
  @Mutation(() => Boolean, { name: 'updateSocialLink' })
  public async updateSocialLink(
    @Authorized() user: User,
    @Args('id') id: string,
    @Args('input') input: SocialLinkInput,
  ): Promise<boolean> {
    return this.profileService.updateSocialLink(user, id, input);
  }

  @Authorization()
  @Mutation(() => Boolean, { name: 'removeSocialLink' })
  public async removeSocialLink(
    @Authorized() user: User,
    @Args('id') id: string,
  ): Promise<boolean> {
    return this.profileService.removeSocialLink(user, id);
  }

  @Authorization()
  @Mutation(() => Boolean, { name: 'reorderSocialLinks' })
  public async reorderSocialLinks(
    @Authorized() user: User,
    @Args('list', { type: () => [SocialLinkOrderInput] })
    list: SocialLinkOrderInput[],
  ): Promise<boolean> {
    return this.profileService.reorderSocialLinks(user, list);
  }
}
