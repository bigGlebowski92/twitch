import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Follow, User } from '@prisma/generated/browser';
import { PrismaService } from '@/core/prisma/prisma.service';

@Injectable()
export class FollowService {
  public constructor(private readonly prismaService: PrismaService) {}

  public async findMyFollowers(user: User): Promise<Follow[]> {
    const followers = await this.prismaService.follow.findMany({
      where: {
        followingId: user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        follower: true,
      },
    });

    return followers;
  }

  public async findMyFollowings(user: User): Promise<Follow[]> {
    const followings = await this.prismaService.follow.findMany({
      where: {
        followerId: user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        following: true,
      },
    });
    return followings;
  }

  public async follow(user: User, channelId: string): Promise<boolean> {
    const channel = await this.prismaService.user.findUnique({
      where: {
        id: channelId,
      },
    });

    if (!channel) {
      throw new NotFoundException('Channel not found');
    }

    if (channel.id === user.id) {
      throw new BadRequestException('You cannot follow yourself');
    }

    const existingFollow = await this.prismaService.follow.findFirst({
      where: {
        followerId: user.id,
        followingId: channel.id,
      },
    });

    if (existingFollow) {
      throw new BadRequestException('You already follow this channel');
    }

    await this.prismaService.follow.create({
      data: {
        followerId: user.id,
        followingId: channel.id,
      },
    });

    return true;
  }

  public async unfollow(user: User, channelId: string): Promise<boolean> {
    const channel = await this.prismaService.user.findUnique({
      where: {
        id: channelId,
      },
    });
    if (!channel) {
      throw new NotFoundException('Channel not found');
    }

    if (channel.id === user.id) {
      throw new BadRequestException('You cannot unfollow yourself');
    }

    const existingFollow = await this.prismaService.follow.findFirst({
      where: {
        followerId: user.id,
        followingId: channel.id,
      },
    });

    if (!existingFollow) {
      throw new BadRequestException('You do not follow this channel');
    }

    await this.prismaService.follow.delete({
      where: {
        id: existingFollow.id,
      },
    });

    return true;
  }
}
