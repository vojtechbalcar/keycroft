/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
declare module 'next-auth' {
  type SessionUser = {
    id?: string
    email?: string | null
    name?: string | null
  }

  type Session = {
    user?: SessionUser | null
  }

  type AppRouteHandler = (
    request: Request,
    context: {
      params: Promise<Record<string, string | string[] | undefined>>
    },
  ) => void | Response | Promise<void | Response>

  type AuthRequest = Request & {
    auth?: {
      user?: SessionUser
    }
  }

  type NextAuthResult = {
    handlers: {
      GET: AppRouteHandler
      POST: AppRouteHandler
    }
    auth: (() => Promise<Session | null>) & {
      <T>(handler: (request: AuthRequest) => T): (request: AuthRequest) => T
    }
    signIn: (provider?: string, options?: unknown) => Promise<void>
    signOut: (options?: unknown) => Promise<void>
  }

  export default function NextAuth(config: unknown): NextAuthResult
}

declare module 'next-auth/providers/credentials' {
  export default function Credentials(config: unknown): unknown
}

declare module 'next-auth/providers/nodemailer' {
  export default function Nodemailer(config: unknown): unknown
}

declare module '@auth/prisma-adapter' {
  export function PrismaAdapter(client: unknown): unknown
}

declare module '@prisma/client' {
  export class PrismaClient {
    constructor(options?: unknown)
    [key: string]: any
  }

  export namespace Prisma {
    type TransactionClient = PrismaClient
    type UserGetPayload<T = unknown> = any
  }
}
