import cookieParser from 'cookie-parser';
import type { RequestHandler } from 'express';
import session, { type SessionOptions } from 'express-session';

export function buildCookieParser(secret: string): RequestHandler {
  return cookieParser(secret);
}

export function buildSessionMiddleware(
  options: SessionOptions,
): RequestHandler {
  return session(options);
}
