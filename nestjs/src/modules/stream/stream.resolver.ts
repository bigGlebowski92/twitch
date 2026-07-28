import { Args, Query, Resolver } from '@nestjs/graphql';
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
}
