import { ConfigService } from '@nestjs/config';

export function getRedisUrl(configService: ConfigService): string {
  const url = configService.get<string>('REDIS_URL');

  if (url && !url.includes('${')) {
    return url;
  }

  const host = configService.getOrThrow<string>('REDIS_HOST');
  const port = configService.getOrThrow<string>('REDIS_PORT');
  const password = configService.get<string>('REDIS_PASSWORD')?.trim();
  const user = configService
    .get<string>('REDIS_USER')
    ?.trim()
    .replace(/^['"]|['"]$/g, '');

  if (user && password) {
    return `redis://${user}:${password}@${host}:${port}`;
  }

  if (password) {
    return `redis://:${password}@${host}:${port}`;
  }

  return `redis://${host}:${port}`;
}
