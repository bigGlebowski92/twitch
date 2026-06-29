import { PrismaPg } from '@prisma/adapter-pg';
import type { SqlMigrationAwareDriverAdapterFactory } from '@prisma/driver-adapter-utils';

export function createPgAdapter(
  databaseUrl: string,
): SqlMigrationAwareDriverAdapterFactory {
  return new PrismaPg(databaseUrl);
}
