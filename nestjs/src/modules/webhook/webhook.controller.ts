import { Controller, Headers, HttpCode, Post, Req } from '@nestjs/common';
import type { Request } from 'express';
import { WebhookService } from './webhook.service';

@Controller('webhook')
export class WebhookController {
  public constructor(private readonly webhookService: WebhookService) {}

  @Post('livekit')
  @HttpCode(200)
  public async receiveLivekitWebhook(
    @Req() req: Request,
    @Headers('authorization') authorization: string,
  ) {
    const body = Buffer.isBuffer(req.body) ? req.body.toString('utf-8') : '';
    await this.webhookService.receiveWebhookLivekit(body, authorization);
  }
}
