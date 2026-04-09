import type { HistoryPoint } from '@/lib/analytics/build-history-series'
import type { ProgressSummary } from '@/lib/analytics/build-progress-summary'
import { getPhaseDefinition } from '@/lib/placement/phase-definitions'

type MonthlyReflectionProps = {
  summary: ProgressSummary
  series: HistoryPoint[]
}

function getMomentumReflection(momentum: ProgressSummary['momentum']) {
  if (momentum === 'rising') {
    return 'The last few sessions are trending upward. Keep the same restraint and let speed keep arriving naturally.'
  }

  if (momentum === 'resetting') {
    return 'The recent dip points to overreaching. Run a few calmer sessions before trying to push again.'
  }

  return 'You are holding a repeatable pace. Small gains will come from sharper accuracy rather than more volume.'
}

function getConsistencyReflection(consistencyBand: ProgressSummary['consistencyBand']) {
  if (consistencyBand === 'locked-in') {
    return 'Results are compact enough to trust. You can start treating faster lines as real practice, not gambling.'
  }

  if (consistencyBand === 'steady') {
    return 'There is a stable floor, but not every session lands on it yet. Keep sessions short enough to avoid drift.'
  }

  return 'The spread is still wide. Repeat the simplest routes until the session outcomes stop jumping around.'
}

export function MonthlyReflection({
  summary,
  series,
}: MonthlyReflectionProps) {
  const latestDay = series.at(-1)
  const phase = summary.phaseId ? getPhaseDefinition(summary.phaseId) : null

  return (
    <section
      className="rounded-[var(--kc-radius-card)] border p-5"
      style={{ borderColor: 'var(--kc-line-light)', background: 'var(--kc-surface)' }}
    >
      <p
        className="text-[10px] uppercase tracking-[0.2em]"
        style={{ color: 'var(--kc-on-surface-muted)' }}
      >
        Monthly Reflection
      </p>
      <h2 className="mt-1 text-xl font-semibold" style={{ color: 'var(--kc-on-surface)' }}>
        What the ledger says right now
      </h2>

      {summary.totalSessions === 0 ? (
        <p className="mt-4 text-sm leading-6" style={{ color: 'var(--kc-on-surface-muted)' }}>
          No reflection yet. Finish a practice line and the stockpile will start turning sessions into trends.
        </p>
      ) : (
        <div className="mt-5 grid gap-3">
          {[
            {
              label: 'Momentum read',
              value: getMomentumReflection(summary.momentum),
            },
            {
              label: 'Consistency read',
              value: getConsistencyReflection(summary.consistencyBand),
            },
            {
              label: 'Next focus',
              value:
                phase?.recommendedFocus ??
                'Keep the next session clean before you try to make it faster.',
            },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="rounded-[var(--kc-radius-inner)] border px-4 py-4"
              style={{
                borderColor: 'var(--kc-line-light)',
                background: 'rgba(255,255,255,0.55)',
              }}
            >
              <p
                className="text-[10px] uppercase tracking-[0.16em]"
                style={{ color: 'var(--kc-on-surface-muted)' }}
              >
                {label}
              </p>
              <p className="mt-2 text-sm leading-6" style={{ color: 'var(--kc-on-surface)' }}>
                {value}
              </p>
            </div>
          ))}

          {latestDay ? (
            <div
              className="rounded-[var(--kc-radius-inner)] border px-4 py-4"
              style={{
                borderColor: 'rgba(58,114,48,0.18)',
                background: 'rgba(58,114,48,0.07)',
              }}
            >
              <p
                className="text-[10px] uppercase tracking-[0.16em]"
                style={{ color: 'var(--kc-accent-on-surface)' }}
              >
                Latest checkpoint
              </p>
              <p className="mt-2 text-sm leading-6" style={{ color: 'var(--kc-accent-on-surface)' }}>
                {latestDay.label} closed at {latestDay.averageWpm} WPM and {latestDay.averageAccuracy}% accuracy across{' '}
                {latestDay.sessionCount} run{latestDay.sessionCount !== 1 ? 's' : ''}.
              </p>
            </div>
          ) : null}
        </div>
      )}
    </section>
  )
}
