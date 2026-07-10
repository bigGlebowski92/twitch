import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { CronService } from './cron.service';

@Module({
  providers: [CronService],
  imports: [ScheduleModule.forRoot()],
})
export class CronModule {}
