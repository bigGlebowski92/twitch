import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SocialLink, User } from '@prisma/generated/browser';
import type Upload from 'graphql-upload/Upload.mjs';
import sharp from 'sharp';
import { PrismaService } from '@/core/prisma/prisma.service';
import { StorageService } from '@/modules/libs/storage/storage.service';
import { readStreamToBuffer } from '@/shared/utils/read-stream.util';
import {
  SocialLinkInput,
  SocialLinkOrderInput,
} from './inputs/social-link.input';
import { UpdateProfileInput } from './inputs/update-profile.input';
import { ProfileModel } from './models/profile.model';

const DEFAULT_AVATAR_URL =
  'https://static-cdn.jtvnw.net/jtv_user_pictures/default-profile_image-300x300.png';

@Injectable()
export class ProfileService {
  public constructor(
    private readonly prismaService: PrismaService,
    private readonly storageService: StorageService,
  ) {}

  public async getByUsername(username: string): Promise<ProfileModel> {
    const user = await this.prismaService.user.findUnique({
      where: { username },
      include: {
        socialLinks: {
          orderBy: { position: 'asc' },
        },
      },
    });

    if (!user || user.isDeactivated) {
      throw new NotFoundException('Profile not found');
    }

    return this.toProfileModel(user);
  }

  public async findSocialLinks(user: User): Promise<SocialLink[]> {
    return this.prismaService.socialLink.findMany({
      where: { userId: user.id },
      orderBy: { position: 'asc' },
    });
  }

  public async updateProfile(
    user: User,
    input: UpdateProfileInput,
  ): Promise<User> {
    const { displayName, bio, username } = input;

    if (username !== undefined && username !== user.username) {
      const isUsernameExists = await this.prismaService.user.findUnique({
        where: { username },
      });

      if (isUsernameExists) {
        throw new BadRequestException('Username already exists');
      }
    }

    return this.prismaService.user.update({
      where: { id: user.id },
      data: {
        ...(username !== undefined && { username }),
        ...(displayName !== undefined && { displayName }),
        ...(bio !== undefined && { bio }),
      },
    });
  }

  public async changeAvatar(avatar: Upload, user: User): Promise<User> {
    const { createReadStream } = await avatar.promise;
    const rawBuffer = await readStreamToBuffer(createReadStream());

    const processedBuffer = await sharp(rawBuffer)
      .resize(300, 300, { fit: 'cover' })
      .webp()
      .toBuffer();

    const avatarUrl = await this.storageService.uploadAvatar(
      user.id,
      processedBuffer,
      'image/webp',
    );

    if (user.avatar) {
      await this.storageService.delete(user.avatar);
    }

    return this.prismaService.user.update({
      where: { id: user.id },
      data: { avatar: avatarUrl },
    });
  }

  public async removeAvatar(user: User): Promise<User> {
    if (user.avatar) {
      await this.storageService.delete(user.avatar);
    }

    return this.prismaService.user.update({
      where: { id: user.id },
      data: { avatar: DEFAULT_AVATAR_URL },
    });
  }

  public async addSocialLink(
    user: User,
    input: SocialLinkInput,
  ): Promise<boolean> {
    const { title, url } = input;

    const lastSocialLink = await this.prismaService.socialLink.findFirst({
      where: { userId: user.id },
      orderBy: { position: 'desc' },
    });

    const newPosition = lastSocialLink ? lastSocialLink.position + 1 : 1;

    await this.prismaService.socialLink.create({
      data: {
        title,
        url,
        position: newPosition,
        user: {
          connect: {
            id: user.id,
          },
        },
      },
    });
    return true;
  }

  public async reorderSocialLinks(
    user: User,
    list: SocialLinkOrderInput[],
  ): Promise<boolean> {
    if (list.length === 0) {
      return true;
    }

    const ownedLinks = await this.prismaService.socialLink.findMany({
      where: {
        userId: user.id,
        id: { in: list.map((socialLink) => socialLink.id) },
      },
      select: { id: true },
    });

    if (ownedLinks.length !== list.length) {
      throw new BadRequestException('Invalid social links');
    }

    await Promise.all(
      list.map((socialLink) =>
        this.prismaService.socialLink.update({
          where: { id: socialLink.id },
          data: { position: socialLink.position },
        }),
      ),
    );

    return true;
  }

  public async updateSocialLink(
    user: User,
    id: string,
    input: SocialLinkInput,
  ): Promise<boolean> {
    await this.findOwnedSocialLink(user.id, id);

    const { title, url } = input;

    await this.prismaService.socialLink.update({
      where: { id },
      data: {
        title,
        url,
      },
    });
    return true;
  }

  public async removeSocialLink(user: User, id: string): Promise<boolean> {
    await this.findOwnedSocialLink(user.id, id);

    await this.prismaService.socialLink.delete({
      where: { id },
    });
    return true;
  }

  private async findOwnedSocialLink(
    userId: string,
    id: string,
  ): Promise<SocialLink> {
    const socialLink = await this.prismaService.socialLink.findFirst({
      where: { id, userId },
    });

    if (!socialLink) {
      throw new NotFoundException('Social link not found');
    }

    return socialLink;
  }

  private toProfileModel(
    user: User & { socialLinks: SocialLink[] },
  ): ProfileModel {
    return {
      id: user.id,
      username: user.username,
      displayName: user.displayName,
      avatar: user.avatar,
      bio: user.bio,
      isVerified: user.isVerified,
      socialLinks: user.socialLinks.map((link) => ({
        id: link.id,
        title: link.title,
        url: link.url,
        position: link.position,
      })),
      createdAt: user.createdAt,
    };
  }
}
