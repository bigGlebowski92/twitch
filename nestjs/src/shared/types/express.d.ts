import type { User } from '@prisma/generated/browser';

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

export {};
