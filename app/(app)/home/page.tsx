import React from 'react'

export default function AppHomePage() {
  return (
    <section className="rounded-[32px] border border-[var(--kc-line)] bg-[var(--kc-surface)] p-8 shadow-[0_18px_50px_rgba(58,45,30,0.10)]">
      <p className="text-sm uppercase tracking-[0.18em] text-[var(--kc-muted)]">
        Product shell
      </p>
      <h1 className="mt-4 text-4xl tracking-tight text-[var(--kc-text)]">
        Keycroft home
      </h1>
      <p className="mt-4 max-w-2xl text-base leading-7 text-[var(--kc-muted)]">
        Stage 1 only needs a stable route, layout, and visual foundation.
        Placement, typing, and village systems come next.
      </p>
    </section>
  )
}
