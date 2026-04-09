/* eslint-disable @typescript-eslint/no-namespace, @typescript-eslint/no-explicit-any */
export class PrismaClient {
  user = {
    findUnique: async () => null,
    upsert: async () => null,
    update: async () => null,
  }

  guestProfileLink = {
    findUnique: async () => null,
    upsert: async () => null,
  }

  chapterProgress = {
    upsert: async () => null,
  }

  typingRun = {
    upsert: async () => null,
  }

  $transaction = async <T>(callback: (tx: PrismaClient) => Promise<T>) => {
    return callback(this)
  }
}

export namespace Prisma {
  export type TransactionClient = PrismaClient
  export type UserGetPayload<T = unknown> = T extends unknown ? any : never
}
