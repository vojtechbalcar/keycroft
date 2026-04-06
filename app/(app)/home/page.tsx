import Link from 'next/link'

import { VillageScene } from '@/components/village/village-scene'

export default function AppHomePage() {
  return (
    <div className="space-y-6">
      {/* Village canvas with CTA overlay */}
      <section className="relative overflow-hidden rounded-[32px] border border-[var(--kc-line)] shadow-[0_18px_50px_rgba(58,45,30,0.12)]">
        <div className="aspect-[16/7] w-full bg-[linear-gradient(180deg,#f9f3e6_0%,#f1e7d2_100%)]">
          <VillageScene />
        </div>

        {/* Gradient overlay + CTA */}
        <div className="absolute bottom-0 left-0 right-0 bg-[linear-gradient(to_top,rgba(245,239,223,0.97)_0%,rgba(245,239,223,0.82)_55%,transparent_100%)] px-8 pb-8 pt-20">
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--kc-muted)]">
            Your next step
          </p>
          <h2 className="mt-1 text-2xl tracking-tight text-[var(--kc-text)]">
            Chapter 1 · Arrival
          </h2>
          <p className="mt-1 max-w-xs text-sm leading-6 text-[var(--kc-muted)]">
            Begin with a short placement session to find your level.
          </p>
          <Link
            href="/play"
            className="mt-4 inline-flex items-center justify-center rounded-full bg-[var(--kc-accent)] px-5 py-3 text-sm font-medium text-white transition hover:bg-[var(--kc-accent-strong)]"
          >
            Begin the journey
          </Link>
        </div>
      </section>

      {/* Mini stats row */}
      <div className="grid grid-cols-3 gap-4">
        {(
          [
            { label: 'Current WPM', value: '—' },
            { label: 'Accuracy', value: '—' },
            { label: 'Sessions', value: '0' },
          ] as const
        ).map(({ label, value }) => (
          <div
            key={label}
            className="rounded-[20px] border border-[var(--kc-line)] bg-[var(--kc-surface)] p-5 shadow-[0_8px_24px_rgba(58,45,30,0.06)]"
          >
            <p className="text-xs uppercase tracking-[0.18em] text-[var(--kc-muted)]">
              {label}
            </p>
            <p className="mt-2 text-2xl text-[var(--kc-text)]">{value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
