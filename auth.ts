import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@auth/prisma-adapter'
import bcrypt from 'bcryptjs'
import { db } from '@/lib/db'

type AuthUser = { id?: string; email?: string | null; name?: string | null }
type JwtToken = { sub?: string | null }
type CredentialsInput = Partial<Record<'email' | 'password', unknown>> | undefined

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db),
  providers: [
    Credentials({
      id: 'credentials',
      name: 'Email & Password',
      credentials: {
        email:    { label: 'Email',    type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials: CredentialsInput) {
        const email    = String(credentials?.email    ?? '').trim().toLowerCase()
        const password = String(credentials?.password ?? '')

        if (!email || !password) return null

        const user = await db.user.findUnique({ where: { email } })
        if (!user?.password) return null

        const valid = await bcrypt.compare(password, user.password)
        if (!valid) return null

        return { id: user.id, email: user.email, name: user.name }
      },
    }),
  ],
  secret: process.env.AUTH_SECRET ?? 'keycroft-dev-secret-change-in-production',
  trustHost: true,
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/login',
  },
  callbacks: {
    jwt({ token, user }: { token: JwtToken; user?: AuthUser | null }) {
      if (user?.id) token.sub = user.id
      return token
    },
    session({ session, token }: { session: { user?: AuthUser | null }; token?: JwtToken | null }) {
      if (session.user && token?.sub) session.user.id = token.sub
      return session
    },
  },
})
