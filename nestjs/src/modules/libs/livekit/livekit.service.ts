import { Inject, Injectable } from '@nestjs/common';
import {
  IngressClient,
  RoomServiceClient,
  WebhookReceiver,
} from 'livekit-server-sdk';
import {
  type LiveKitOptions,
  LiveKitOptionsSymbol,
} from './types/livekit.types';

@Injectable()
export class LivekitService {
  private roomService: RoomServiceClient;
  private ingressClient: IngressClient;
  private webhookReceiver: WebhookReceiver;

  public constructor(
    @Inject(LiveKitOptionsSymbol) private readonly options: LiveKitOptions,
  ) {
    this.roomService = new RoomServiceClient(
      this.options.apiUrl,
      this.options.apiKey,
      this.options.apiSecret,
    );
    this.ingressClient = new IngressClient(
      this.options.apiUrl,
      this.options.apiKey,
      this.options.apiSecret,
    );
    this.webhookReceiver = new WebhookReceiver(
      this.options.apiKey,
      this.options.apiSecret,
    );
  }

  public get ingress(): IngressClient {
    return this.createProxy(this.ingressClient);
  }

  public get room(): RoomServiceClient {
    return this.createProxy(this.roomService);
  }

  public get webhook(): WebhookReceiver {
    return this.createProxy(this.webhookReceiver);
  }

  private createProxy<T extends object>(target: T): T {
    return new Proxy(target, {
      get: (obj, prop) => {
        const value = obj[prop as keyof T];

        if (typeof value === 'function') {
          return (value as (...args: unknown[]) => unknown).bind(
            obj,
          ) as T[keyof T];
        }

        return value;
      },
    });
  }
}
