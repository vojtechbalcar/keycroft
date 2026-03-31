import React, { type PropsWithChildren } from 'react'

import { Logo } from '@/components/shared/logo'

export function AppShell({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen px-6 py-6 md:px-8">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="rounded-[24px] border border-[var(--kc-line)] bg-[var(--kc-surface)] p-5 shadow-[0_18px_50px_rgba(58,45,30,0.10)]">
          <Logo />
          <p className="mt-6 text-sm leading-6 text-[var(--kc-muted)]">
            Keycroft home hub placeholder
          </p>
        </aside>
        <main>{children}</main>
      </div>
    </div>
  )
}
