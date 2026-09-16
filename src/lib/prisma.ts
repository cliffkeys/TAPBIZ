import { PrismaClient } from '@prisma/client';
import { PrismaNeon } from '@prisma/adapter-neon';
import { Pool, neonConfig } from '@neondatabase/serverless';

// In Node.js, we need the ws package for WebSocket support
// In edge/serverless environments (Vercel), native WebSocket is used
if (typeof globalThis.WebSocket === 'undefined') {
  try {
    // Dynamic import for Node.js environments
    const ws = require('ws');
    neonConfig.webSocketConstructor = ws;
  } catch {
    // ws not available — we're likely in an edge runtime with native WebSocket
  }
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL!;
  const pool = new Pool({ connectionString });
  const adapter = new PrismaNeon(pool);

  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
