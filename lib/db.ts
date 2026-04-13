import { PrismaClient } from '@prisma/client'

declare global {
  var __keycroftPrisma__: PrismaClient | undefined
}

function getDatasourceUrl() {
  const databaseUrl = process.env.DATABASE_URL

  if (!databaseUrl) return undefined

  try {
    const parsed = new URL(databaseUrl)

    if (parsed.hostname.includes('pooler.supabase.com') && parsed.port === '6543') {
      if (!parsed.searchParams.has('pgbouncer')) {
        parsed.searchParams.set('pgbouncer', 'true')
      }

      if (!parsed.searchParams.has('connection_limit')) {
        parsed.searchParams.set('connection_limit', '1')
      }

      return parsed.toString()
    }
  } catch {
    return databaseUrl
  }

  return databaseUrl
}

export const db =
  globalThis.__keycroftPrisma__ ??
  new PrismaClient({
    datasourceUrl: getDatasourceUrl(),
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') {
  globalThis.__keycroftPrisma__ = db
}
