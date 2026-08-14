import { Module } from '@nestjs/common';
import { StorageModule } from '@/modules/libs/storage/storage.module';
import { StreamResolver } from './stream.resolver';
import { StreamService } from './stream.service';
import { IngressModule } from './ingress/ingress.module';

@Module({
  imports: [StorageModule, IngressModule],
  providers: [StreamResolver, StreamService],
})
export class StreamModule {}
