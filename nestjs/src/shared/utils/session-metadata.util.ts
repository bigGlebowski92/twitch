import DeviceDetector from 'device-detector-js';
import type { Request } from 'express';
import { lookup } from 'geoip-lite';
import { getName, registerLocale } from 'i18n-iso-countries';
import enLocale from 'i18n-iso-countries/langs/en.json';
import type { SessionMetadata } from '../types/session-metadata.types';
import { IS_DEV_ENV } from './is-dev.util';

const deviceDetector = new DeviceDetector();

registerLocale(enLocale);

function resolveClientIp(req: Request): string {
  if (IS_DEV_ENV) {
    return '173.244.192.87';
  }

  const cfConnectingIp = req.headers['cf-connecting-ip'];
  if (Array.isArray(cfConnectingIp)) {
    return cfConnectingIp[0] ?? req.ip ?? 'Unknown';
  }
  if (typeof cfConnectingIp === 'string' && cfConnectingIp.length > 0) {
    return cfConnectingIp;
  }

  const forwardedFor = req.headers['x-forwarded-for'];
  if (typeof forwardedFor === 'string' && forwardedFor.length > 0) {
    return forwardedFor.split(',')[0]?.trim() ?? req.ip ?? 'Unknown';
  }

  return req.ip ?? 'Unknown';
}

function resolveCountryName(countryCode?: string): string {
  if (!countryCode) {
    return 'Undefined';
  }

  return getName(countryCode, 'en') ?? countryCode;
}

function resolveBrowserName(
  client: ReturnType<DeviceDetector['parse']>['client'],
): string {
  if (!client || !('name' in client) || !client.name) {
    return 'Undefined';
  }

  return client.name;
}

export function getSessionMetadata(
  req: Request,
  userAgent: string,
): SessionMetadata {
  const ip = resolveClientIp(req);
  const location = lookup(ip);
  const device = deviceDetector.parse(userAgent);

  return {
    ip,
    location: {
      country: resolveCountryName(location?.country),
      city: location?.city ?? 'Undefined',
      longitude: location?.ll?.[0] ?? 0,
      latitude: location?.ll?.[1] ?? 0,
    },
    device: {
      browser: resolveBrowserName(device.client),
      os: device.os?.name ?? 'Undefined',
      type: device.device?.type ?? 'Undefined',
    },
  };
}
