import React, { type PropsWithChildren } from 'react'

import { Logo } from '@/components/shared/logo'

export function SiteShell({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen px-6 py-8 md:px-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-10">
        <header className="flex items-center justify-between gap-4">
          <Logo />
          <span className="text-right text-sm text-[var(--kc-muted)]">
            Cozy typing, not grind.
          </span>
        </header>
        {children}
      </div>
    </div>
  )
}
