export interface LocationInfo {
  country: string;
  city: string;
  longitude: number;
  latitude: number;
}

export interface DeviceInfo {
  browser: string;
  os: string;
  type: string;
}

export interface SessionMetadata {
  location: LocationInfo;
  device: DeviceInfo;
  ip: string;
}

export interface StoredSession {
  id: string;
  userId?: string;
  createdAt?: Date | string;
  metadata?: SessionMetadata;
}

interface RedisSessionPayload {
  userId?: string;
  createdAt?: Date | string;
  metadata?: SessionMetadata;
}

export function parseStoredSession(data: string): RedisSessionPayload {
  return JSON.parse(data) as RedisSessionPayload;
}

export function getSessionIdFromKey(key: string, prefix: string): string {
  return key.startsWith(prefix) ? key.slice(prefix.length) : key;
}

const EMPTY_METADATA: SessionMetadata = {
  ip: 'Unknown',
  location: {
    country: 'Undefined',
    city: 'Undefined',
    longitude: 0,
    latitude: 0,
  },
  device: {
    browser: 'Undefined',
    os: 'Undefined',
    type: 'Undefined',
  },
};

export function normalizeStoredSession(session: StoredSession): StoredSession {
  return {
    id: session.id,
    userId: session.userId ?? '',
    createdAt: session.createdAt ? new Date(session.createdAt) : new Date(),
    metadata: session.metadata ?? EMPTY_METADATA,
  };
}
