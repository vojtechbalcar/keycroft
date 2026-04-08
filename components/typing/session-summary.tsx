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
    <section
      className="space-y-6 p-8 md:p-10"
      style={{
        borderRadius: 'var(--kc-radius-card)',
        border: '1px solid var(--kc-line-light)',
        background: 'linear-gradient(180deg, #faf7f1 0%, #f0e9d8 100%)',
        boxShadow: '0 18px 50px rgba(28,46,30,0.08)',
      }}
    >
      {/* Header */}
      <div className="space-y-3">
        <p
          className="text-xs uppercase tracking-[0.16em]"
          style={{ color: 'var(--kc-on-surface-muted)' }}
        >
          {prompt.label}
        </p>
        <h1
          className="text-4xl tracking-tight"
          style={{ color: 'var(--kc-on-surface)' }}
        >
          Session complete
        </h1>

        {metrics.cleanRun ? (
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5"
            style={{
              borderRadius: 'var(--kc-radius-badge)',
              background: 'rgba(58,114,48,0.10)',
              border: '1px solid rgba(58,114,48,0.18)',
            }}
          >
            <span
              className="h-2 w-2 rounded-full"
              style={{ background: 'var(--kc-accent-on-surface)' }}
            />
            <span
              className="text-sm font-medium"
              style={{ color: 'var(--kc-accent-on-surface)' }}
            >
              Clean run — no corrections
            </span>
          </div>
        ) : (
          <p
            className="max-w-2xl text-base leading-7"
            style={{ color: 'var(--kc-on-surface-muted)' }}
          >
            Solid finish. The next gain comes from reducing mid-line corrections.
          </p>
        )}
      </div>

      {/* Metrics grid */}
      <dl className="grid gap-3 md:grid-cols-4">
        {[
          { label: 'WPM',         value: metrics.wpm },
          { label: 'Accuracy',    value: `${metrics.accuracy}%` },
          { label: 'Time',        value: formatSeconds(metrics.elapsedMs) },
          { label: 'Corrections', value: metrics.correctedErrors },
        ].map(({ label, value }) => (
          <div
            key={label}
            className="p-4"
            style={{
              borderRadius: 'var(--kc-radius-inner)',
              border: '1px solid var(--kc-line-light)',
              background: 'rgba(250,247,241,0.7)',
            }}
          >
            <dt
              className="text-xs uppercase tracking-[0.16em]"
              style={{ color: 'var(--kc-on-surface-muted)' }}
            >
              {label}
            </dt>
            <dd
              className="mt-2 text-3xl"
              style={{ color: 'var(--kc-on-surface)' }}
            >
              {value}
            </dd>
          </div>
        ))}
      </dl>

      {/* Focus next */}
      <div
        className="p-5"
        style={{
          borderRadius: 'var(--kc-radius-inner)',
          border: '1px solid var(--kc-line-light)',
          background: 'rgba(250,247,241,0.8)',
        }}
      >
        <p
          className="text-xs uppercase tracking-[0.16em]"
          style={{ color: 'var(--kc-on-surface-muted)' }}
        >
          Focus next
        </p>
        <p
          className="mt-2 text-lg leading-8"
          style={{ color: 'var(--kc-on-surface)' }}
        >
          {getFocusMessage(metrics)}
        </p>
      </div>

      {/* Village flavour */}
      <div
        className="px-5 py-4"
        style={{
          borderRadius: 'var(--kc-radius-inner)',
          border: '1px solid rgba(58,114,48,0.15)',
          background: 'rgba(58,114,48,0.05)',
        }}
      >
        <p className="text-sm" style={{ color: 'var(--kc-accent-on-surface)' }}>
          A lantern in your village burns a little brighter.
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-5">
        <button
          className="inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-medium text-white transition-[transform,background-color] hover:bg-[var(--kc-accent-strong)] active:scale-[0.97]"
          style={{ background: 'var(--kc-accent)' }}
          onClick={onTryAnother}
          type="button"
        >
          Try another line
        </button>
        <Link
          className="text-sm underline-offset-4 transition-colors hover:underline"
          style={{ color: 'var(--kc-on-surface-muted)' }}
          href="/home"
        >
          Back to your village →
        </Link>
      </div>
    </section>
  )
}
