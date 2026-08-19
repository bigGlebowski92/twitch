import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '@prisma/generated/browser';
import { PrismaService } from '@/core/prisma/prisma.service';

@Injectable()
export class ChannelService {
  public constructor(private readonly prismaService: PrismaService) {}

  public async findRecommendedChannels(): Promise<User[]> {
    const channels = await this.prismaService.user.findMany({
      where: {
        isDeactivated: false,
      },
      orderBy: {
        followings: {
          _count: 'desc',
        },
      },
      include: {
        stream: true,
      },
      take: 10,
    });

    return channels;
  }

  public async findChannelByUsername(username: string): Promise<User> {
    const channel = await this.prismaService.user.findUnique({
      where: {
        username,
        isDeactivated: false,
      },
      include: {
        socialLinks: {
          orderBy: {
            position: 'asc',
          },
        },
        stream: {
          include: {
            category: true,
          },
        },
        followings: true,
      },
    });
    if (!channel) {
      throw new NotFoundException('Channel not found');
    }
    return channel;
  }

  public async findFollowersByChannelId(channelId: string): Promise<User[]> {
    const follows = await this.prismaService.follow.findMany({
      where: {
        followingId: channelId,
      },
      include: {
        follower: true,
      },
    });
    return follows.map((follow) => follow.follower);
  }
}
