import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from '@prisma/generated/browser';
import type Upload from 'graphql-upload/Upload.mjs';
import sharp from 'sharp';
import { PrismaService } from '@/core/prisma/prisma.service';
import { StorageService } from '@/modules/libs/storage/storage.service';
import { readStreamToBuffer } from '@/shared/utils/read-stream.util';
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
    });

    if (!user || user.isDeactivated) {
      throw new NotFoundException('Profile not found');
    }

    return this.toProfileModel(user);
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

  private toProfileModel(user: User): ProfileModel {
    return {
      id: user.id,
      username: user.username,
      displayName: user.displayName,
      avatar: user.avatar,
      bio: user.bio,
      isVerified: user.isVerified,
      createdAt: user.createdAt,
    };
  }
}
