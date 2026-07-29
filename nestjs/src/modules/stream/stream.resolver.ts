import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import type { User } from '@prisma/generated/browser';
import GraphQLUpload from 'graphql-upload/GraphQLUpload.mjs';
import type Upload from 'graphql-upload/Upload.mjs';
import { Authorization } from '@/shared/decorators/auth.decorator';
import { Authorized } from '@/shared/decorators/authorized.decorator';
import { FileValidationPipe } from '@/shared/pipes/file-validation.pipe';
import { ChangeStreamInfoInput } from './inputs/change-stream-info.input';
import { FiltersInput } from './inputs/filters.input';
import { StreamModel } from './models/stream.model';
import { StreamService } from './stream.service';

@Resolver('Stream')
export class StreamResolver {
  public constructor(private readonly streamService: StreamService) {}

  @Query(() => [StreamModel], { name: 'findAllStreams' })
  public async findAllStreams(
    @Args('filters', { nullable: true }) input?: FiltersInput,
  ) {
    return this.streamService.findAllStreams(input);
  }

  @Query(() => [StreamModel], { name: 'findRandomStreams' })
  public async findRandomStreams() {
    return this.streamService.findRandomStreams();
  }

  @Authorization()
  @Mutation(() => Boolean, { name: 'changeStreamInfo' })
  public async changeStreamInfo(
    @Authorized() user: User,
    @Args('input') input: ChangeStreamInfoInput,
  ): Promise<boolean> {
    return this.streamService.changeStreamInfo(input, user);
  }

  @Authorization()
  @Mutation(() => StreamModel, { name: 'changeThumbnail' })
  public async changeThumbnail(
    @Authorized() user: User,
    @Args({ name: 'thumbnail', type: () => GraphQLUpload }, FileValidationPipe)
    thumbnail: Upload,
  ): Promise<StreamModel> {
    return this.streamService.changeThumbnail(thumbnail, user);
  }

  @Authorization()
  @Mutation(() => StreamModel, { name: 'removeThumbnail' })
  public async removeThumbnail(@Authorized() user: User): Promise<StreamModel> {
    return this.streamService.removeThumbnail(user);
  }
}
