import { FactoryProvider, ModuleMetadata } from '@nestjs/common';

export const LiveKitOptionsSymbol = Symbol('LiveKitOptions');

export type LiveKitOptions = {
  apiKey: string;
  apiSecret: string;
  apiUrl: string;
};

export type TypeLiveKitAsyncOptions = Pick<ModuleMetadata, 'imports'> &
  Pick<FactoryProvider<LiveKitOptions>, 'useFactory' | 'inject'>;
