import Link from 'next/link'
import type { VillageProjection, VillageState } from '@/lib/world/project-world'
import { MasteryBar } from './mastery-bar'

const STATE_ICONS: Record<VillageState, string> = {
  locked: '🔒',
  active: '⚡',
  flourishing: '🌿',
  complete: '⭐',
}

type VillageMarkerProps = {
  projection: VillageProjection
}

export function VillageMarker({ projection }: VillageMarkerProps) {
  const { definition, mastery, state, isCurrentVillage } = projection
  const isClickable = state !== 'locked'

  const markerContent = (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 6,
        width: 90,
        opacity: state === 'locked' ? 0.35 : 1,
        filter: state === 'locked' ? 'grayscale(0.9)' : 'none',
        cursor: isClickable ? 'pointer' : 'default',
        transition: 'opacity 0.3s',
      }}
    >
      {/* Village icon */}
      <div
        style={{
          fontSize: '2.2rem',
          lineHeight: 1,
          padding: '6px 8px',
          borderRadius: 8,
          border: isCurrentVillage
            ? '2px solid #f5c842'
            : '2px solid rgba(255,255,255,0.15)',
          background: isCurrentVillage
            ? 'rgba(245,200,66,0.15)'
            : 'rgba(0,0,0,0.3)',
          imageRendering: 'pixelated',
          boxShadow: isCurrentVillage ? '0 0 16px rgba(245,200,66,0.4)' : 'none',
          transition: 'all 0.3s',
        }}
      >
        {state === 'locked' ? '🔒' : definition.emoji}
      </div>

      {/* State badge + name */}
      <div style={{ textAlign: 'center' }}>
        <div
          style={{
            fontSize: '0.6rem',
            color: 'rgba(255,255,255,0.5)',
            marginBottom: 2,
            letterSpacing: '0.05em',
          }}
        >
          {STATE_ICONS[state]} {state.toUpperCase()}
        </div>
        <div
          style={{
            fontSize: '0.65rem',
            fontWeight: 700,
            color: isCurrentVillage ? '#f5c842' : '#f4efe4',
            lineHeight: 1.3,
          }}
        >
          {definition.name}
        </div>
      </div>

      {/* Mastery bar — only for unlocked villages */}
      {state !== 'locked' && (
        <MasteryBar mastery={mastery} accent={definition.palette.accent} />
      )}
    </div>
  )

  if (!isClickable) return markerContent

  return (
    <Link href={`/world/${definition.id}`} style={{ textDecoration: 'none' }}>
      {markerContent}
    </Link>
  )
}
