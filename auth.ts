import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import Nodemailer from 'next-auth/providers/nodemailer'
import { PrismaAdapter } from '@auth/prisma-adapter'

import { db } from '@/lib/db'

const hasMagicLinkProvider = Boolean(
  process.env.EMAIL_SERVER_HOST &&
    process.env.EMAIL_SERVER_PORT &&
    process.env.EMAIL_FROM,
)
const hasTestCredentialsProvider = process.env.AUTH_TEST_MODE === '1'
const sessionStrategy = hasTestCredentialsProvider ? 'jwt' : 'database'

type AuthUser = {
  id?: string
  email?: string | null
  name?: string | null
}

type JwtToken = {
  sub?: string | null
}

const providers = []

if (hasMagicLinkProvider) {
  providers.push(
    Nodemailer({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: Number(process.env.EMAIL_SERVER_PORT),
        secure: Number(process.env.EMAIL_SERVER_PORT) === 465,
        auth:
          process.env.EMAIL_SERVER_USER && process.env.EMAIL_SERVER_PASSWORD
            ? {
                user: process.env.EMAIL_SERVER_USER,
                pass: process.env.EMAIL_SERVER_PASSWORD,
              }
            : undefined,
      },
      from: process.env.EMAIL_FROM,
    }),
  )
}

if (hasTestCredentialsProvider) {
  providers.push(
    Credentials({
      id: 'credentials',
      name: 'Test account',
      credentials: {
        email: { label: 'Email', type: 'email' },
      },
      async authorize(credentials: { email?: string } | undefined) {
        const email = String(credentials?.email ?? '')
          .trim()
          .toLowerCase()

        if (!email) {
          return null
        }

        const user = await db.user.upsert({
          where: { email },
          update: {},
          create: {
            email,
            name: email.split('@')[0],
          },
        })

        return {
          id: user.id,
          email: user.email,
          name: user.name,
        }
      },
    }),
  )
}

export const authFeatures = {
  hasMagicLinkProvider,
  hasTestCredentialsProvider,
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db),
  providers,
  secret: process.env.AUTH_SECRET ?? 'keycroft-development-secret',
  trustHost: true,
  session: {
    strategy: sessionStrategy,
  },
  pages: {
    signIn: '/settings',
    verifyRequest: '/settings',
  },
  callbacks: {
    jwt({ token, user }: { token: JwtToken; user?: AuthUser | null }) {
      if (user?.id) {
        token.sub = user.id
      }

      return token
    },
    session({
      session,
      user,
      token,
    }: {
      session: { user?: AuthUser | null }
      user?: AuthUser | null
      token?: JwtToken | null
    }) {
      if (session.user) {
        session.user.id =
          (typeof user?.id === 'string' && user.id) ||
          (typeof token?.sub === 'string' && token.sub) ||
          session.user.id
      }

      return session
    },
  },
})
