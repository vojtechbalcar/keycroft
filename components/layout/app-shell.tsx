import React, { type PropsWithChildren } from 'react'
import Link from 'next/link'

import { AppNav } from '@/components/layout/app-nav'
import { SessionUserProvider } from '@/components/layout/session-context'
import type { SessionUser } from '@/lib/auth/get-session-user'

export function AppShell({
  children,
  sessionUser = null,
}: PropsWithChildren<{
  sessionUser?: SessionUser | null
}>) {
  return (
    <SessionUserProvider user={sessionUser}>
      <div
        className="flex min-h-screen"
        style={{ background: 'var(--kc-background)', color: 'var(--kc-text)' }}
      >
        <aside
          className="flex w-[230px] shrink-0 flex-col lg:sticky lg:top-0 lg:h-screen"
          style={{
            background: 'var(--kc-sidebar)',
            borderRight: '1px solid var(--kc-sidebar-border)',
          }}
        >
          <div
            className="px-5 pt-5 pb-5"
            style={{ borderBottom: '1px solid var(--kc-sidebar-border)' }}
          >
            <div className="flex items-center gap-3">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-lg text-lg"
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid var(--kc-sidebar-border)',
                }}
              >
                {sessionUser ? '✉️' : '🏠'}
              </div>
              <div>
                <p className="text-sm font-bold text-white">
                  {sessionUser?.name ?? 'Guest Homesteader'}
                </p>
                <p
                  className="text-[10px] uppercase tracking-[0.16em]"
                  style={{ color: 'var(--kc-muted)' }}
                >
                  {sessionUser?.email ?? 'Local-only progress'}
                </p>
              </div>
            </div>
          </div>

          <AppNav />

          <div
            className="mx-4 mt-auto mb-4 rounded-lg p-3"
            style={{
              background: 'var(--kc-sidebar-active)',
              border: '1px solid var(--kc-sidebar-border)',
            }}
          >
            <div className="flex items-baseline justify-between">
              <p
                className="text-[9px] uppercase tracking-[0.2em]"
                style={{ color: 'var(--kc-muted)' }}
              >
                Season Progress
              </p>
              <span
                className="text-xs font-semibold"
                style={{ color: 'var(--kc-warm)' }}
              >
                74%
              </span>
            </div>
            <p className="mt-1 text-xs font-semibold text-white">
              Winter Harvest
            </p>
            <div
              className="mt-2 h-1.5 overflow-hidden rounded-full"
              style={{ background: 'rgba(255,255,255,0.1)' }}
            >
              <div
                className="h-full rounded-full"
                style={{ width: '74%', background: 'var(--kc-accent)' }}
              />
            </div>
          </div>

          <div
            className="mx-4 mb-4 rounded-lg p-3"
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid var(--kc-sidebar-border)',
            }}
          >
            <p
              className="text-[9px] uppercase tracking-[0.2em]"
              style={{ color: 'var(--kc-muted)' }}
            >
              Daily Quota
            </p>
            <div
              className="mt-2 h-2 overflow-hidden rounded-full"
              style={{ background: 'rgba(255,255,255,0.1)' }}
            >
              <div
                className="h-full rounded-full"
                style={{ width: '65%', background: 'var(--kc-accent)' }}
              />
            </div>
            <p className="mt-1 text-xs" style={{ color: 'var(--kc-muted)' }}>
              650 / 1000 Logs
            </p>
          </div>

          <div className="px-4 pb-5">
            <Link
              href="/play"
              className="block w-full rounded-lg py-2.5 text-center text-sm font-semibold text-white transition-[transform,opacity] hover:opacity-90 active:scale-[0.97]"
              style={{ background: 'var(--kc-accent)' }}
            >
              Start Harvest
            </Link>
          </div>
        </aside>

        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </SessionUserProvider>
  )
}
