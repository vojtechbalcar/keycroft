import Link from 'next/link'
import type { SessionMetrics } from '@/lib/typing/session-metrics'
import type { VillageDefinition } from '@/lib/world/village-definitions'
import { getNextVillageId, getVillageDefinition } from '@/lib/world/village-definitions'
import { MasteryBar } from './mastery-bar'

type SessionRewardProps = {
  definition: VillageDefinition
  metrics: SessionMetrics
  masteryGained: number
  newMastery: number       // mastery AFTER this session
  prevMastery: number      // mastery BEFORE this session
  onNextLesson: () => void
}

export function SessionReward({
  definition,
  metrics,
  masteryGained,
  newMastery,
  prevMastery,
  onNextLesson,
}: SessionRewardProps) {
  const nextVillageId = getNextVillageId(definition.id)
  const pathUnlocked = prevMastery < 80 && newMastery >= 80 && nextVillageId !== null
  const nextVillageDef = nextVillageId ? getVillageDefinition(nextVillageId) : null

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: 'rgba(0,0,0,0.65)',
        display: 'flex',
        alignItems: 'flex-end',
        borderRadius: 12,
        overflow: 'hidden',
        animation: 'fadeIn 0.3s ease',
      }}
    >
      <div
        style={{
          width: '100%',
          background: definition.palette.surface,
          borderTop: `3px solid ${definition.palette.accent}`,
          padding: '1.25rem 1.5rem',
          animation: 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Path unlocked banner */}
        {pathUnlocked && nextVillageDef && (
          <div
            style={{
              background: 'rgba(245,200,66,0.15)',
              border: '1px solid rgba(245,200,66,0.4)',
              borderRadius: 8,
              padding: '8px 12px',
              marginBottom: 12,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontSize: '0.8rem',
              color: '#f5c842',
              fontWeight: 700,
            }}
          >
            ✨ Path to {nextVillageDef.name} {nextVillageDef.emoji} now open →
          </div>
        )}

        {/* Stats row */}
        <div style={{ display: 'flex', gap: 16, marginBottom: 12 }}>
          {[
            { label: 'WPM', value: Math.round(metrics.wpm) },
            { label: 'Accuracy', value: `${metrics.accuracy}%` },
            { label: 'Mastery +', value: `+${masteryGained}` },
          ].map(({ label, value }) => (
            <div
              key={label}
              style={{
                flex: 1,
                background: 'rgba(0,0,0,0.3)',
                borderRadius: 8,
                padding: '8px 12px',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '1.2rem', fontWeight: 700, color: definition.palette.text }}>
                {value}
              </div>
              <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>
                {label}
              </div>
            </div>
          ))}
        </div>

        {/* Mastery bar */}
        <div style={{ marginBottom: 16 }}>
          <MasteryBar mastery={newMastery} accent={definition.palette.accent} showLabel />
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={onNextLesson}
            style={{
              flex: 1,
              background: definition.palette.accent,
              color: '#fff',
              fontWeight: 700,
              padding: '0.6rem 1rem',
              borderRadius: 8,
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.875rem',
            }}
          >
            Next lesson →
          </button>
          <Link
            href="/world"
            style={{
              flex: 1,
              background: 'rgba(255,255,255,0.08)',
              color: definition.palette.text,
              fontWeight: 600,
              padding: '0.6rem 1rem',
              borderRadius: 8,
              textDecoration: 'none',
              fontSize: '0.875rem',
              textAlign: 'center',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            World map
          </Link>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn  { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
      `}</style>
    </div>
  )
}
