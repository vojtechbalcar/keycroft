import { PrismaClient } from '@prisma/client'

declare global {
  var __keycroftPrisma__: PrismaClient | undefined
}

export const db =
  globalThis.__keycroftPrisma__ ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') {
  globalThis.__keycroftPrisma__ = db
}
