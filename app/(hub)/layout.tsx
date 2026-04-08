import React, { type ReactNode } from 'react'

import { AppShell } from '@/components/layout/app-shell'
import { getSessionUser } from '@/lib/auth/get-session-user'

export default async function HubLayout({
  children,
}: {
  children: ReactNode
}) {
  const sessionUser = await getSessionUser()

  return <AppShell sessionUser={sessionUser}>{children}</AppShell>
}
