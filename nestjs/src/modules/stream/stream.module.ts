import { Module } from '@nestjs/common';
import { StorageModule } from '@/modules/libs/storage/storage.module';
import { StreamResolver } from './stream.resolver';
import { StreamService } from './stream.service';

@Module({
  imports: [StorageModule],
  providers: [StreamResolver, StreamService],
})
export class StreamModule {}
