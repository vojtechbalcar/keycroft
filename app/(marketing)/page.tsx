import React from 'react'

import { SiteShell } from '@/components/layout/site-shell'
import { PrimaryButton } from '@/components/shared/primary-button'

export default function MarketingHomePage() {
  return (
    <SiteShell>
      <section className="grid gap-8 rounded-[32px] border border-[var(--kc-line)] bg-[var(--kc-surface)] p-8 shadow-[0_18px_50px_rgba(58,45,30,0.10)] md:grid-cols-[1.2fr_0.8fr] md:p-12">
        <div className="space-y-6">
          <p className="text-sm uppercase tracking-[0.18em] text-[var(--kc-muted)]">
            A better way to get better at typing
          </p>
          <h1 className="max-w-3xl text-5xl leading-tight tracking-tight text-[var(--kc-text)]">
            Build a village while you build real typing skill.
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-[var(--kc-muted)]">
            Keycroft is a cozy typing world for people tired of ugly,
            repetitive typing websites.
          </p>
          <div className="flex flex-wrap gap-3">
            <PrimaryButton>Start the journey</PrimaryButton>
            <button
              className="inline-flex items-center rounded-full border border-[var(--kc-line)] px-5 py-3 text-sm text-[var(--kc-text)] transition hover:bg-[rgba(255,250,240,0.72)]"
              type="button"
            >
              See the overview
            </button>
          </div>
        </div>
        <div className="rounded-[28px] border border-[var(--kc-line)] bg-[linear-gradient(180deg,#efe3c9_0%,#e4d5b5_100%)] p-6">
          <div className="h-full min-h-[320px] rounded-[22px] border border-dashed border-[var(--kc-line)] bg-[rgba(255,250,240,0.72)] p-6">
            <p className="text-sm text-[var(--kc-muted)]">
              Village preview placeholder
            </p>
          </div>
        </div>
      </section>
    </SiteShell>
  )
}
