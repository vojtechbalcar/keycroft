import Link from 'next/link'

import type { ProgressSummary } from '@/lib/analytics/build-progress-summary'
import { getPhaseDefinition } from '@/lib/placement/phase-definitions'

type ProgressOverviewProps = {
  summary: ProgressSummary
  signedIn: boolean
}

function getMomentumCopy(momentum: ProgressSummary['momentum']) {
  if (momentum === 'rising') {
    return 'Recent sessions are getting faster without slipping backward on accuracy.'
  }

  if (momentum === 'resetting') {
    return 'Accuracy dipped lately. Slow the next few lines down and clean the route back up.'
  }

  return 'Your pace is stable. The next gain should come from deliberate repetition, not forcing speed.'
}

function getConsistencyCopy(consistencyBand: ProgressSummary['consistencyBand']) {
  if (consistencyBand === 'locked-in') {
    return 'Your results are landing inside a tight band. This is a good time to stretch speed carefully.'
  }

  if (consistencyBand === 'steady') {
    return 'There is a repeatable base here already, but a few runs still drift enough to notice.'
  }

  return 'The rhythm is still forming. Short, cleaner sessions will help more than longer pushes.'
}

export function ProgressOverview({
  summary,
  signedIn,
}: ProgressOverviewProps) {
  const phase = summary.phaseId ? getPhaseDefinition(summary.phaseId) : null

  return (
    <section
      className="rounded-[var(--kc-radius-card)] border p-6"
      style={{
        borderColor: 'var(--kc-line-light)',
        background:
          'linear-gradient(180deg, rgba(255,250,240,0.98) 0%, rgba(244,239,228,0.96) 100%)',
      }}
    >
      <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
        <div className="max-w-3xl">
          <p
            className="text-[10px] uppercase tracking-[0.2em]"
            style={{ color: 'var(--kc-on-surface-muted)' }}
          >
            Stockpile Ledger
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <h1
              className="text-3xl font-semibold"
              style={{ color: 'var(--kc-on-surface)' }}
            >
              {summary.phaseName}
            </h1>
            <span
              className="rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em]"
              style={{
                background: 'rgba(58,114,48,0.10)',
                border: '1px solid rgba(58,114,48,0.18)',
                color: 'var(--kc-accent-on-surface)',
              }}
            >
              {summary.totalSessions} sessions logged
            </span>
          </div>
          <p
            className="mt-3 max-w-2xl text-sm leading-6"
            style={{ color: 'var(--kc-on-surface-muted)' }}
          >
            {phase?.summary ?? 'Track how the village is improving over time.'}{' '}
            {phase?.recommendedFocus ?? ''}
          </p>
        </div>

        <div
          className="rounded-[var(--kc-radius-inner)] border px-4 py-4 xl:max-w-sm"
          style={{
            borderColor: 'var(--kc-line-light)',
            background: 'rgba(255,255,255,0.55)',
          }}
        >
          <p
            className="text-[10px] uppercase tracking-[0.18em]"
            style={{ color: 'var(--kc-on-surface-muted)' }}
          >
            Sync state
          </p>
          <p
            className="mt-2 text-lg font-semibold"
            style={{ color: 'var(--kc-on-surface)' }}
          >
            {signedIn ? 'Account sync is active' : 'Guest storage only'}
          </p>
          <p
            className="mt-2 text-sm leading-6"
            style={{ color: 'var(--kc-on-surface-muted)' }}
          >
            {signedIn
              ? 'This stockpile is backed by your account and can travel across devices.'
              : 'This stockpile currently lives in local storage on this browser.'}
          </p>
        </div>
      </div>

      <dl className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {[
          { label: 'Average speed', value: `${summary.averageWpm} WPM` },
          { label: 'Average accuracy', value: `${summary.averageAccuracy}%` },
          { label: 'Clean runs', value: `${summary.cleanRunRate}%` },
          { label: 'Chapters cleared', value: summary.completedChapters },
        ].map(({ label, value }) => (
          <div
            key={label}
            className="rounded-[var(--kc-radius-inner)] border px-4 py-4"
            style={{
              borderColor: 'var(--kc-line-light)',
              background: 'rgba(255,255,255,0.55)',
            }}
          >
            <dt
              className="text-[10px] uppercase tracking-[0.16em]"
              style={{ color: 'var(--kc-on-surface-muted)' }}
            >
              {label}
            </dt>
            <dd
              className="mt-2 text-2xl font-semibold"
              style={{ color: 'var(--kc-on-surface)' }}
            >
              {value}
            </dd>
          </div>
        ))}
      </dl>

      <div className="mt-6 grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]">
        <div
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
            Momentum
          </p>
          <p
            className="mt-2 text-lg font-semibold"
            style={{ color: 'var(--kc-on-surface)' }}
          >
            {summary.momentum[0].toUpperCase() + summary.momentum.slice(1)}
          </p>
          <p
            className="mt-2 text-sm leading-6"
            style={{ color: 'var(--kc-on-surface-muted)' }}
          >
            {getMomentumCopy(summary.momentum)}
          </p>
        </div>

        <div
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
            Consistency band
          </p>
          <p
            className="mt-2 text-lg font-semibold"
            style={{ color: 'var(--kc-on-surface)' }}
          >
            {summary.consistencyBand === 'locked-in'
              ? 'Locked in'
              : summary.consistencyBand[0].toUpperCase() +
                summary.consistencyBand.slice(1)}
          </p>
          <p
            className="mt-2 text-sm leading-6"
            style={{ color: 'var(--kc-on-surface-muted)' }}
          >
            {getConsistencyCopy(summary.consistencyBand)}
          </p>
        </div>

        <div className="flex flex-wrap gap-3 xl:justify-end">
          <Link
            href="/play"
            className="inline-flex items-center rounded-full px-4 py-2 text-sm font-medium text-white"
            style={{ background: 'var(--kc-accent)' }}
          >
            Log another session
          </Link>
          <Link
            href="/home"
            className="inline-flex items-center rounded-full border px-4 py-2 text-sm font-medium"
            style={{
              borderColor: 'var(--kc-line-light)',
              color: 'var(--kc-on-surface)',
            }}
          >
            Back to village
          </Link>
        </div>
      </div>
    </section>
  )
}
