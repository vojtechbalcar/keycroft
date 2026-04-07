import React, { type PropsWithChildren } from 'react'
import Link from 'next/link'

import { AppNav } from '@/components/layout/app-nav'

export function AppShell({ children }: PropsWithChildren) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside
        className="flex w-[220px] shrink-0 flex-col lg:sticky lg:top-0 lg:h-screen"
        style={{ background: 'var(--kc-sidebar)', borderRight: '1px solid var(--kc-sidebar-border)' }}
      >
        {/* Brand */}
        <div className="px-5 pt-6 pb-1">
          <p className="text-[10px] uppercase tracking-[0.28em]" style={{ color: 'var(--kc-muted)' }}>
            Keycroft
          </p>
        </div>

        {/* World card */}
        <div className="px-5 pt-2 pb-5" style={{ borderBottom: '1px solid var(--kc-sidebar-border)' }}>
          <h2 className="text-[22px] font-semibold leading-tight tracking-tight text-white">
            The Hamlet
          </h2>
          <span
            className="mt-1.5 inline-block rounded-full px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.16em]"
            style={{ background: 'var(--kc-accent)', color: '#fff' }}
          >
            Level 1 · Apprentice
          </span>
        </div>

        {/* Nav */}
        <AppNav />

        {/* Bottom stats */}
        <div className="mt-auto px-5 pb-2 pt-4" style={{ borderTop: '1px solid var(--kc-sidebar-border)' }}>
          <p className="mb-2 text-[10px] uppercase tracking-[0.18em]" style={{ color: 'var(--kc-muted)' }}>
            This week
          </p>
          <dl className="space-y-2">
            {([
              { label: 'Sessions', value: '—' },
              { label: 'Best WPM', value: '—' },
              { label: 'Accuracy', value: '—' },
            ] as const).map(({ label, value }) => (
              <div key={label} className="flex items-baseline justify-between">
                <dt className="text-xs" style={{ color: 'var(--kc-muted)' }}>{label}</dt>
                <dd className="text-sm text-white">{value}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* CTA */}
        <div className="px-4 pb-6 pt-4">
          <Link
            href="/play"
            className="block w-full rounded-full py-2.5 text-center text-sm font-semibold text-white transition hover:opacity-90"
            style={{ background: 'var(--kc-accent)' }}
          >
            Start Session
          </Link>
        </div>
      </aside>

      {/* Main */}
      <main className="min-w-0 flex-1">
        {children}
      </main>
    </div>
  )
}
