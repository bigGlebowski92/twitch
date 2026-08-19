import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ChatMessage, User } from '@prisma/generated/browser';
import { PrismaService } from '@/core/prisma/prisma.service';
import { ChangeChatSettingsInput } from './inputs/change-chat-settings.input';
import { SendMessageInput } from './inputs/send-message.input';

@Injectable()
export class ChatService {
  public constructor(private readonly prismaService: PrismaService) {}

  public async findMessageByStreamId(streamId: string): Promise<ChatMessage[]> {
    return await this.prismaService.chatMessage.findMany({
      where: {
        streamId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        user: true,
      },
    });
  }

  public async sendMessage(
    userId: string,
    input: SendMessageInput,
  ): Promise<ChatMessage> {
    const { text, streamId } = input;
    const stream = await this.prismaService.stream.findUnique({
      where: {
        id: streamId,
      },
    });
    if (!stream) {
      throw new NotFoundException('Stream not found');
    }
    if (!stream.isLive) {
      throw new BadRequestException('Stream is not live');
    }

    const message = await this.prismaService.chatMessage.create({
      data: {
        content: text,
        user: {
          connect: {
            id: userId,
          },
        },
        stream: {
          connect: {
            id: streamId,
          },
        },
      },
      include: {
        user: true,
      },
    });
    return message;
  }

  public async changeChatSettings(
    user: User,
    input: ChangeChatSettingsInput,
  ): Promise<boolean> {
    const { isChatEnabled, isChatFollowersOnly, isChatPremiumFollowersOnly } =
      input;
    await this.prismaService.stream.update({
      where: {
        userId: user.id,
      },
      data: {
        isChatEnabled,
        isChatFollowersOnly,
        isChatPremiumFollowersOnly,
      },
    });
    return true;
  }
}
