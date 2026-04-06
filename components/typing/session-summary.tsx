import Link from 'next/link'

import type { SessionMetrics } from '@/lib/typing/session-metrics'
import type { PracticeText } from '@/lib/typing/practice-texts'

type SessionSummaryProps = {
  prompt: PracticeText
  metrics: SessionMetrics
  onTryAnother: () => void
}

function formatSeconds(elapsedMs: number): string {
  return `${(elapsedMs / 1000).toFixed(1)}s`
}

function getFocusMessage(metrics: SessionMetrics): string {
  if (metrics.correctedErrors > 0) {
    return 'Slow down enough to remove fewer corrections.'
  }

  if (metrics.accuracy < 97) {
    return 'Keep the line cleaner before pushing speed.'
  }

  return 'Keep the same relaxed rhythm and nudge the pace up.'
}

export function SessionSummary({
  prompt,
  metrics,
  onTryAnother,
}: SessionSummaryProps) {
  return (
    <section className="space-y-6 rounded-[36px] border border-[var(--kc-line)] bg-[linear-gradient(180deg,rgba(255,250,240,0.98)_0%,rgba(245,236,218,0.98)_100%)] p-8 shadow-[0_18px_50px_rgba(58,45,30,0.10)] md:p-10">
      <div className="space-y-3">
        <p className="text-sm uppercase tracking-[0.18em] text-[var(--kc-muted)]">
          {prompt.label}
        </p>
        <h1 className="text-4xl tracking-tight text-[var(--kc-text)]">
          Session complete
        </h1>
        {metrics.cleanRun && (
          <div className="inline-flex items-center gap-2 rounded-full bg-[rgba(94,116,72,0.12)] px-4 py-1.5">
            <span className="h-2 w-2 rounded-full bg-[var(--kc-accent)]" />
            <span className="text-sm text-[var(--kc-accent-strong)]">
              Clean run — no corrections
            </span>
          </div>
        )}
        {!metrics.cleanRun && (
          <p className="max-w-2xl text-base leading-7 text-[var(--kc-muted)]">
            Solid finish. The next gain comes from reducing mid-line
            corrections.
          </p>
        )}
      </div>

      <dl className="grid gap-4 md:grid-cols-4">
        <div className="rounded-[24px] border border-[var(--kc-line)] bg-[rgba(255,250,240,0.6)] p-4">
          <dt className="text-xs uppercase tracking-[0.18em] text-[var(--kc-muted)]">
            WPM
          </dt>
          <dd className="mt-2 text-3xl text-[var(--kc-text)]">{metrics.wpm}</dd>
        </div>
        <div className="rounded-[24px] border border-[var(--kc-line)] bg-[rgba(255,250,240,0.6)] p-4">
          <dt className="text-xs uppercase tracking-[0.18em] text-[var(--kc-muted)]">
            Accuracy
          </dt>
          <dd className="mt-2 text-3xl text-[var(--kc-text)]">
            {metrics.accuracy}%
          </dd>
        </div>
        <div className="rounded-[24px] border border-[var(--kc-line)] bg-[rgba(255,250,240,0.6)] p-4">
          <dt className="text-xs uppercase tracking-[0.18em] text-[var(--kc-muted)]">
            Time
          </dt>
          <dd className="mt-2 text-3xl text-[var(--kc-text)]">
            {formatSeconds(metrics.elapsedMs)}
          </dd>
        </div>
        <div className="rounded-[24px] border border-[var(--kc-line)] bg-[rgba(255,250,240,0.6)] p-4">
          <dt className="text-xs uppercase tracking-[0.18em] text-[var(--kc-muted)]">
            Corrections
          </dt>
          <dd className="mt-2 text-3xl text-[var(--kc-text)]">
            {metrics.correctedErrors}
          </dd>
        </div>
      </dl>

      <div className="rounded-[24px] border border-[var(--kc-line)] bg-[rgba(255,250,240,0.72)] p-5">
        <p className="text-sm uppercase tracking-[0.18em] text-[var(--kc-muted)]">
          Focus next
        </p>
        <p className="mt-2 text-lg leading-8 text-[var(--kc-text)]">
          {getFocusMessage(metrics)}
        </p>
      </div>

      <div className="rounded-[24px] border border-[rgba(122,143,98,0.2)] bg-[rgba(122,143,98,0.06)] px-5 py-4">
        <p className="text-sm text-[var(--kc-accent-strong)]">
          A lantern in your village burns a little brighter.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-5">
        <button
          className="inline-flex items-center justify-center rounded-full bg-[var(--kc-accent)] px-5 py-3 text-sm font-medium text-white transition hover:bg-[var(--kc-accent-strong)]"
          onClick={onTryAnother}
          type="button"
        >
          Try another line
        </button>
        <Link
          className="text-sm text-[var(--kc-muted)] underline-offset-4 transition hover:text-[var(--kc-text)] hover:underline"
          href="/home"
        >
          Back to your village →
        </Link>
      </div>
    </section>
  )
}
