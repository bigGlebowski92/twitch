import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import type { User } from '@prisma/generated/browser';
import { PubSub } from 'graphql-subscriptions';
import { Authorization } from '@/shared/decorators/auth.decorator';
import { Authorized } from '@/shared/decorators/authorized.decorator';
import { ChatService } from './chat.service';
import { ChangeChatSettingsInput } from './inputs/change-chat-settings.input';
import { SendMessageInput } from './inputs/send-message.input';
import { ChatMessageModel } from './models/chat-message.model';

@Resolver('Chat')
export class ChatResolver {
  private readonly pubSub: PubSub;

  public constructor(private readonly chatService: ChatService) {
    this.pubSub = new PubSub();
  }

  @Query(() => [ChatMessageModel], { name: 'findChatMessages' })
  public async findChatMessages(
    @Args('streamId') streamId: string,
  ): Promise<ChatMessageModel[]> {
    return this.chatService.findMessageByStreamId(streamId);
  }

  @Authorization()
  @Mutation(() => Boolean, { name: 'changeChatSettings' })
  public async changeChatSettings(
    @Authorized() user: User,
    @Args('input') input: ChangeChatSettingsInput,
  ): Promise<boolean> {
    return this.chatService.changeChatSettings(user, input);
  }

  @Authorization()
  @Mutation(() => ChatMessageModel, { name: 'sendMessage' })
  public async sendMessage(
    @Authorized('id') userId: string,
    @Args('input') input: SendMessageInput,
  ): Promise<ChatMessageModel> {
    const message = await this.chatService.sendMessage(userId, input);
    void this.pubSub.publish('CHAT_MESSAGE_ADDED', {
      chatMessageAdded: message,
    });
    return message;
  }

  @Subscription(() => ChatMessageModel, {
    name: 'chatMessageAdded',
    filter: (
      payload: { chatMessageAdded: ChatMessageModel },
      variables: { streamId: string },
    ) => payload.chatMessageAdded.streamId === variables.streamId,
  })
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- streamId declares the subscription argument used by `filter` above
  public chatMessageAdded(@Args('streamId') streamId: string) {
    return this.pubSub.asyncIterableIterator('CHAT_MESSAGE_ADDED');
  }
}
