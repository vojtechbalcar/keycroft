import React, { type PropsWithChildren } from 'react'

import { AppNav } from '@/components/layout/app-nav'
import { Logo } from '@/components/shared/logo'

export function AppShell({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen px-6 py-6 md:px-8">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="flex flex-col rounded-[24px] border border-[var(--kc-line)] bg-[var(--kc-surface)] p-5 shadow-[0_18px_50px_rgba(58,45,30,0.10)] lg:sticky lg:top-6 lg:h-[calc(100vh-3rem)]">
          <Logo />
          <AppNav />
          <div className="mt-auto border-t border-[var(--kc-line)] pt-5">
            <p className="mb-3 text-xs uppercase tracking-[0.18em] text-[var(--kc-muted)]">
              This week
            </p>
            <dl className="space-y-2.5">
              {(
                [
                  { label: 'Sessions', value: '—' },
                  { label: 'Best WPM', value: '—' },
                  { label: 'Accuracy', value: '—' },
                ] as const
              ).map(({ label, value }) => (
                <div key={label} className="flex items-baseline justify-between">
                  <dt className="text-xs text-[var(--kc-muted)]">{label}</dt>
                  <dd className="text-sm text-[var(--kc-text)]">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </aside>
        <main>{children}</main>
      </div>
    </div>
  )
}
