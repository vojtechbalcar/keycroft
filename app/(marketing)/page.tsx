import React from 'react'
import Link from 'next/link'

import { SiteShell } from '@/components/layout/site-shell'
import { PrimaryButton } from '@/components/shared/primary-button'
import { VillagePreview } from '@/components/village/village-preview'

export default function MarketingHomePage() {
  return (
    <SiteShell>
      {/* ── Hero ── */}
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
            <Link
              href="/play"
              className="inline-flex items-center justify-center rounded-full bg-[var(--kc-accent)] px-5 py-3 text-sm font-medium text-white transition hover:bg-[var(--kc-accent-strong)]"
            >
              Start the journey
            </Link>
            <button
              className="inline-flex items-center rounded-full border border-[var(--kc-line)] px-5 py-3 text-sm text-[var(--kc-text)] transition hover:bg-[rgba(255,250,240,0.72)]"
              type="button"
            >
              See the overview
            </button>
          </div>
        </div>

        {/* Village preview */}
        <div className="overflow-hidden rounded-[28px] border border-[var(--kc-line)] bg-[linear-gradient(180deg,#f3e8d0_0%,#ebe0c8_100%)]">
          <div className="h-full min-h-[320px]">
            <VillagePreview />
          </div>
        </div>
      </section>

      {/* ── Feature strip ── */}
      <div className="grid gap-10 md:grid-cols-3">
        {(
          [
            {
              index: '01',
              title: 'Your world grows with you',
              body: 'Every session rebuilds and expands your village. The world exists because you practice — without you, it stays dormant.',
            },
            {
              index: '02',
              title: 'Progress you can actually feel',
              body: 'Speed, accuracy, and rhythm tracked honestly. Improvement you see over days, not just one session.',
            },
            {
              index: '03',
              title: 'No drills. No grind.',
              body: 'Short sessions by default. Come back for a few minutes or stay longer. It never punishes you for leaving.',
            },
          ] as const
        ).map(({ index, title, body }) => (
          <div key={index} className="space-y-4">
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--kc-warm)]">
              {index}
            </p>
            <h3 className="text-xl tracking-tight text-[var(--kc-text)]">
              {title}
            </h3>
            <p className="text-sm leading-7 text-[var(--kc-muted)]">{body}</p>
          </div>
        ))}
      </div>

      {/* ── Statement ── */}
      <div className="py-2 text-center">
        <p className="mx-auto max-w-2xl text-2xl leading-relaxed tracking-tight text-[var(--kc-text)]">
          &ldquo;A cozy village-building typing game for people who want to get
          better without suffering through another ugly typing website.&rdquo;
        </p>
      </div>

      {/* ── Closing CTA ── */}
      <div className="flex flex-col items-center gap-4 rounded-[32px] border border-[var(--kc-line)] bg-[var(--kc-surface)] p-10 text-center shadow-[0_18px_50px_rgba(58,45,30,0.08)]">
        <p className="text-xs uppercase tracking-[0.18em] text-[var(--kc-muted)]">
          Start from wherever you are
        </p>
        <h2 className="text-3xl tracking-tight text-[var(--kc-text)]">
          Your village is waiting.
        </h2>
        <p className="max-w-sm text-sm leading-7 text-[var(--kc-muted)]">
          Takes two minutes to set up. No account needed to begin.
        </p>
        <Link
          href="/play"
          className="mt-2 inline-flex items-center justify-center rounded-full bg-[var(--kc-accent)] px-5 py-3 text-sm font-medium text-white transition hover:bg-[var(--kc-accent-strong)]"
        >
          Begin the journey
        </Link>
      </div>
    </SiteShell>
  )
}
