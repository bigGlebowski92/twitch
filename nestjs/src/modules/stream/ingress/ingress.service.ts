import { Injectable } from '@nestjs/common';
import type { User } from '@prisma/generated/browser';
import {
  CreateIngressOptions,
  IngressAudioEncodingPreset,
  IngressAudioOptions,
  IngressInput,
  IngressVideoEncodingPreset,
  IngressVideoOptions,
  TrackSource,
} from 'livekit-server-sdk';
import { PrismaService } from '@/core/prisma/prisma.service';
import { LivekitService } from '@/modules/libs/livekit/livekit.service';

@Injectable()
export class IngressService {
  public constructor(
    private readonly livekitService: LivekitService,
    private readonly prismaService: PrismaService,
  ) {}

  public async createIngress(user: User, ingressType: IngressInput) {
    await this.resetIngress(user);

    const options: CreateIngressOptions = {
      name: user.username,
      roomName: user.id,
      participantName: user.username,
      participantIdentity: user.id,
    };

    if (ingressType === IngressInput.WHIP_INPUT) {
      options.enableTranscoding = false;
    } else {
      options.video = new IngressVideoOptions({
        source: TrackSource.CAMERA,
        encodingOptions: {
          case: 'preset',
          value: IngressVideoEncodingPreset.H264_1080P_30FPS_3_LAYERS,
        },
      });
      options.audio = new IngressAudioOptions({
        source: TrackSource.MICROPHONE,
        encodingOptions: {
          case: 'preset',
          value: IngressAudioEncodingPreset.OPUS_STEREO_96KBPS,
        },
      });
    }

    const ingress = await this.livekitService.ingress.createIngress(
      ingressType,
      options,
    );

    if (!ingress || !ingress.url || !ingress.streamKey) {
      throw new Error('Failed to create ingress');
    }

    await this.prismaService.stream.update({
      where: {
        userId: user.id,
      },
      data: {
        ingressId: ingress.ingressId,
        serverUrl: ingress.url,
        streamKey: ingress.streamKey,
      },
    });

    return true;
  }

  public async resetIngress(user: User) {
    const ingresses = await this.livekitService.ingress.listIngress({
      roomName: user.id,
    });

    const rooms = await this.livekitService.room.listRooms([user.id]);

    for (const room of rooms) {
      await this.livekitService.room.deleteRoom(room.name);
    }

    for (const ingress of ingresses) {
      if (ingress.ingressId) {
        await this.livekitService.ingress.deleteIngress(ingress.ingressId);
      }
    }

    return true;
  }
}
