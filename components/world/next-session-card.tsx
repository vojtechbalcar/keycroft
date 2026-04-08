import Link from 'next/link'
import type { PhaseDefinition } from '@/lib/placement/phase-definitions'

type NextSessionCardProps = {
  phaseDefinition: PhaseDefinition
  sessionCount: number
}

export function NextSessionCard({ phaseDefinition, sessionCount }: NextSessionCardProps) {
  return (
    <div
      className="w-[230px] rounded-xl p-4"
      style={{
        background: 'rgba(244,239,228,0.96)',
        border: '1px solid var(--kc-line-light)',
        boxShadow: '0 8px 24px rgba(0,0,0,0.14)',
      }}
    >
      <p
        className="text-[9px] uppercase tracking-[0.2em]"
        style={{ color: 'var(--kc-warm)' }}
      >
        Your Next Step
      </p>
      <p
        className="mt-1 text-sm font-bold leading-snug"
        style={{ color: 'var(--kc-text-dark)' }}
      >
        {phaseDefinition.name}
      </p>
      <p
        className="mt-1 text-xs leading-4"
        style={{ color: '#6a7a5e' }}
      >
        {phaseDefinition.recommendedFocus}
      </p>
      {sessionCount > 0 && (
        <p className="mt-2 text-[10px]" style={{ color: 'var(--kc-muted)' }}>
          {sessionCount} session{sessionCount !== 1 ? 's' : ''} recorded
        </p>
      )}
      <Link
        href="/play"
        className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-bold uppercase tracking-wider text-white transition hover:opacity-90"
        style={{ background: 'var(--kc-accent)' }}
      >
        <span>🏗</span> Construct
      </Link>
    </div>
  )
}
