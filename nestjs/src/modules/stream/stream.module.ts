import { Module } from '@nestjs/common';
import { CategoryModule } from '@/modules/category/category.module';
import { StorageModule } from '@/modules/libs/storage/storage.module';
import { IngressModule } from './ingress/ingress.module';
import { StreamResolver } from './stream.resolver';
import { StreamService } from './stream.service';

@Module({
  imports: [StorageModule, IngressModule, CategoryModule],
  providers: [StreamResolver, StreamService],
})
export class StreamModule {}
