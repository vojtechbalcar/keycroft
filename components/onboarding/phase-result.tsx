import Link from 'next/link'

import type { PlacementResult } from '@/lib/placement/assess'

type PhaseResultProps = {
  result: PlacementResult
}

export function PhaseResult({ result }: PhaseResultProps) {
  return (
    <section className="space-y-6 rounded-[36px] border border-[var(--kc-line)] bg-[var(--kc-surface)] p-8 shadow-[0_18px_50px_rgba(58,45,30,0.10)] md:p-10">
      <div className="space-y-2">
        <p className="text-sm uppercase tracking-[0.18em] text-[var(--kc-muted-dark)]">
          Starting phase
        </p>
        <h1 className="text-4xl tracking-tight text-[var(--kc-text-dark)]">
          {result.phaseName}
        </h1>
        <p className="max-w-2xl text-base leading-7 text-[var(--kc-muted-dark)]">
          {result.summary}
        </p>
      </div>

      <dl className="grid gap-4 md:grid-cols-3">
        {[
          { label: 'WPM', value: result.metrics.wpm },
          { label: 'Accuracy', value: `${result.metrics.accuracy}%` },
          { label: 'Corrections', value: result.metrics.correctedErrors },
        ].map(({ label, value }) => (
          <div key={label} className="rounded-[24px] border border-[var(--kc-line-light)] bg-[var(--kc-surface-2)] p-4">
            <dt className="text-xs uppercase tracking-[0.18em] text-[var(--kc-muted-dark)]">{label}</dt>
            <dd className="mt-2 text-3xl text-[var(--kc-text-dark)]">{value}</dd>
          </div>
        ))}
      </dl>

      <div className="rounded-[24px] border border-[var(--kc-line-light)] bg-[var(--kc-surface-2)] p-5">
        <p className="text-sm uppercase tracking-[0.18em] text-[var(--kc-muted-dark)]">Why this phase</p>
        <p className="mt-2 text-base leading-7 text-[var(--kc-text-dark)]">{result.reason}</p>
        <p className="mt-3 text-base leading-7 text-[var(--kc-text-dark)]">Focus next: {result.recommendedFocus}</p>
      </div>

      <Link
        className="inline-flex items-center justify-center rounded-full bg-[var(--kc-accent)] px-5 py-3 text-sm font-medium text-white transition hover:bg-[var(--kc-accent-strong)]"
        href="/home"
      >
        Go to home
      </Link>
    </section>
  )
}
