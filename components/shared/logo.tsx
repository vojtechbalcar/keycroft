import React from 'react'

export function Logo() {
  return (
    <div className="inline-flex items-center gap-3 font-medium tracking-tight">
      <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--kc-line)] bg-[var(--kc-surface)] text-[var(--kc-text)]">
        K
      </span>
      <span className="text-lg text-[var(--kc-text)]">Keycroft</span>
    </div>
  )
}
