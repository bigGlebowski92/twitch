import { ConfigService } from '@nestjs/config';
import { LiveKitOptions } from '@/modules/libs/livekit/types/livekit.types';

export function getLivekitConfig(configService: ConfigService): LiveKitOptions {
  return {
    apiUrl: configService.getOrThrow('LIVEKIT_API_URL'),
    apiKey: configService.getOrThrow('LIVEKIT_API_KEY'),
    apiSecret: configService.getOrThrow('LIVEKIT_API_SECRET'),
  };
}
