import { TokenType, User } from '@prisma/generated/browser';
import { randomBytes, randomUUID } from 'crypto';
import { PrismaService } from '../../core/prisma/prisma.service';

const DEFAULT_TOKEN_TTL_MS = 1000 * 60 * 60 * 24;

function getTokenExpiryUnixSeconds(ttlMs = DEFAULT_TOKEN_TTL_MS): number {
  return Math.floor((Date.now() + ttlMs) / 1000);
}

export async function generateToken(
  prismaService: PrismaService,
  user: User,
  type: TokenType,
  isUUID: boolean,
): Promise<string> {
  const token = isUUID ? randomUUID() : randomBytes(16).toString('hex');
  const expiresIn = getTokenExpiryUnixSeconds();

  const existingToken = await prismaService.token.findFirst({
    where: {
      type,
      userId: user.id,
    },
  });

  if (existingToken) {
    await prismaService.token.delete({
      where: { id: existingToken.id },
    });
  }

  const newToken = await prismaService.token.create({
    data: {
      token,
      expiresIn,
      type,
      userId: user.id,
    },
  });

  return newToken.token;
}
