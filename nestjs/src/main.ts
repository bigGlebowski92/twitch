import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import 'dotenv/config';
import { CoreModule } from './core/core.module';
import { RedisService } from './core/redis/redis.service';
import {
  buildCookieParser,
  buildSessionMiddleware,
} from './shared/utils/express-middleware.util';
import { msOrThrow } from './shared/utils/ms';
import { parseBooleanOrThrow } from './shared/utils/parse-boolean';

function parseSessionSecure(value: string): boolean | 'auto' {
  if (value.toLowerCase() === 'auto') {
    return 'auto';
  }

  return parseBooleanOrThrow(value);
}

async function bootstrap() {
  const app = await NestFactory.create(CoreModule);

  const config = app.get<ConfigService>(ConfigService);
  const redis = app.get<RedisService>(RedisService);

  app.use(buildCookieParser(config.getOrThrow<string>('COOKIE_SECRET')));

  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  app.use(
    buildSessionMiddleware({
      secret: config.getOrThrow<string>('SESSION_SECRET'),
      name: config.getOrThrow<string>('SESSION_NAME'),
      resave: false,
      saveUninitialized: false,
      cookie: {
        domain: config.getOrThrow<string>('SESSION_DOMAIN'),
        maxAge: msOrThrow(config.getOrThrow<string>('SESSION_MAX_AGE')),
        httpOnly: parseBooleanOrThrow(
          config.getOrThrow<string>('SESSION_HTTP_ONLY'),
        ),
        secure: parseSessionSecure(config.getOrThrow<string>('SESSION_SECURE')),
        sameSite: 'lax',
      },
      store: redis.createSessionStore(
        config.getOrThrow<string>('SESSION_FOLDER'),
      ),
    }),
  );

  app.enableCors({
    origin: config.getOrThrow<string>('ALLOWED_ORIGINS'),
    credentials: true,
    exposedHeaders: ['Set-Cookie'],
  });

  await app.listen(config.getOrThrow<number>('APPLICATION_PORT'));
}

void bootstrap();
