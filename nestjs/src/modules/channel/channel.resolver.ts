import { Args, Query, Resolver } from '@nestjs/graphql';
import { UserModel } from '../auth/account/models/user.model';
import { ChannelService } from './channel.service';

@Resolver('Channel')
export class ChannelResolver {
  constructor(private readonly channelService: ChannelService) {}

  @Query(() => [UserModel], { name: 'findRecommendedChannels' })
  public async findRecommendedChannels() {
    return this.channelService.findRecommendedChannels();
  }

  @Query(() => UserModel, { name: 'findChannelByUsername' })
  public async findChannelByUsername(@Args('username') username: string) {
    return this.channelService.findChannelByUsername(username);
  }

  @Query(() => [UserModel], { name: 'findFollowersByChannelId' })
  public async findFollowersByChannelId(@Args('channelId') channelId: string) {
    return this.channelService.findFollowersByChannelId(channelId);
  }
}
