import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma?: PrismaClient };

let _prisma: PrismaClient | undefined;
let initError: unknown = null;
try {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = new PrismaClient({ log: ['query'] });
  }
  _prisma = globalForPrisma.prisma;
} catch (e) {
  // If Prisma fails to initialize (invalid DATABASE_URL or network issues),
  // capture the error and export a proxy that will throw when used. This
  // prevents Next.js build-time crashes while keeping runtime errors visible.
  initError = e;
  // Create a harmless proxy that throws when any method is called.
  _prisma = new Proxy({}, {
    get() {
      return () => {
        throw initError || new Error('Prisma client not initialized');
      };
    },
  }) as unknown as PrismaClient;
}

export const prisma: PrismaClient = _prisma as PrismaClient;

if (process.env.NODE_ENV !== 'production' && typeof globalForPrisma.prisma === 'object') {
  globalForPrisma.prisma = prisma;
}
