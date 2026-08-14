import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/core/prisma/prisma.service';
import { LivekitService } from '../libs/livekit/livekit.service';

@Injectable()
export class WebhookService {
  public constructor(
    private readonly prismaService: PrismaService,
    private readonly livekitService: LivekitService,
  ) {}

  public async receiveWebhookLivekit(body: string, authorization: string) {
    const event = await this.livekitService.webhook.receive(
      body,
      authorization,
    );

    if (!event.ingressInfo) {
      return;
    }

    if (event.event === 'ingress_started') {
      await this.prismaService.stream.updateMany({
        where: { ingressId: event.ingressInfo.ingressId },
        data: { isLive: true },
      });
    }

    if (event.event === 'ingress_ended') {
      await this.prismaService.stream.updateMany({
        where: { ingressId: event.ingressInfo.ingressId },
        data: { isLive: false },
      });
    }
  }
}
