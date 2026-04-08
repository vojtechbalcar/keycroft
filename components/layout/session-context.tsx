'use client'

import { createContext, useContext, type ReactNode } from 'react'

import type { SessionUser } from '@/lib/auth/get-session-user'

const SessionUserContext = createContext<SessionUser | null>(null)

export function SessionUserProvider({
  children,
  user,
}: {
  children: ReactNode
  user: SessionUser | null
}) {
  return (
    <SessionUserContext.Provider value={user}>
      {children}
    </SessionUserContext.Provider>
  )
}

export function useSessionUser() {
  return useContext(SessionUserContext)
}
