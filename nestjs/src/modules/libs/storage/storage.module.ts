import { Module } from '@nestjs/common';
import { AccountModule } from '@/modules/auth/account/account.module';
import { HttpSessionAuthGuard } from '@/shared/guards/http-session-auth.guard';
import { StorageController } from './storage.controller';
import { StorageService } from './storage.service';

@Module({
  imports: [AccountModule],
  controllers: [StorageController],
  providers: [StorageService, HttpSessionAuthGuard],
  exports: [StorageService],
})
export class StorageModule {}
