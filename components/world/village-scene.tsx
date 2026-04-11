import type { VillageDefinition, VillageId } from '@/lib/world/village-definitions'
import { MasteryBar } from './mastery-bar'

// Per-village building sets — each inner array is one milestone tier
const VILLAGE_BUILDINGS: Record<VillageId, string[][]> = {
  'meadow-farm':   [['🌾', '🌾'], ['🏚️', '🌾', '🌾'], ['🌾', '🏠', '🌾', '🌽'], ['🌾', '🏡', '🌾', '🌽', '🐄']],
  'fishing-docks': [['🌊', '🌊'], ['⛵', '🌊', '🌊'], ['⛵', '🏠', '🐟', '🌊'], ['⚓', '🏠', '⛵', '🐟', '🦭']],
  'mountain-mine': [['⛰️', '⛰️'], ['⛏️', '⛰️', '⛰️'], ['⛏️', '🏚️', '⛰️', '🪨'], ['⛏️', '🏠', '🔥', '⛰️', '🪨']],
  'forest-watch':  [['🌲', '🌲'], ['🌲', '🦉', '🌲'], ['🌲', '🏚️', '🌲', '🌲'], ['🌲', '🏠', '🦉', '🌲', '🌿']],
  'desert-market': [['🏜️', '🏜️'], ['🏺', '🏜️', '🏜️'], ['🏺', '🏚️', '☀️', '🏜️'], ['🏺', '🏠', '🐪', '☀️', '🏜️']],
  'volcano-forge': [['🌋', '🌋'], ['🔥', '🌋', '🌋'], ['🌋', '🏚️', '⚒️', '🔥'], ['🌋', '🏠', '⚒️', '🔥', '🌋']],
}

function getBuildingTier(mastery: number): number {
  if (mastery >= 75) return 3
  if (mastery >= 50) return 2
  if (mastery >= 25) return 1
  return 0
}

type VillageSceneProps = {
  definition: VillageDefinition
  mastery: number
}

export function VillageScene({ definition, mastery }: VillageSceneProps) {
  const tier = getBuildingTier(mastery)
  const buildings = VILLAGE_BUILDINGS[definition.id]?.[tier] ?? ['🏚️']

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        borderRadius: 12,
        overflow: 'hidden',
        background: `linear-gradient(180deg, ${definition.palette.bg} 0%, ${definition.palette.surface} 60%, ${definition.palette.accent}33 100%)`,
      }}
    >
      {/* Sky gradient */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '45%',
          background: `linear-gradient(180deg, ${definition.palette.bg} 0%, transparent 100%)`,
        }}
      />

      {/* Ground strip */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '40%',
          background: `linear-gradient(180deg, transparent 0%, ${definition.palette.accent}44 100%)`,
        }}
      />

      {/* Village name + tagline */}
      <div
        style={{
          position: 'absolute',
          top: 16,
          left: 20,
          right: 20,
        }}
      >
        <div
          style={{
            fontSize: '0.6rem',
            textTransform: 'uppercase',
            letterSpacing: '0.2em',
            color: definition.palette.text,
            opacity: 0.7,
            marginBottom: 4,
          }}
        >
          {definition.emoji} {definition.name}
        </div>
        <div
          style={{
            fontSize: '0.85rem',
            color: definition.palette.text,
            fontWeight: 600,
            lineHeight: 1.3,
          }}
        >
          {definition.tagline}
        </div>
      </div>

      {/* Buildings */}
      <div
        style={{
          position: 'absolute',
          bottom: 48,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-end',
          gap: 12,
          padding: '0 20px',
        }}
      >
        {buildings.map((emoji, i) => (
          <div
            key={`${definition.id}-${tier}-${i}`}
            style={{
              fontSize: i % 2 === 0 ? '2.4rem' : '3rem',
              lineHeight: 1,
              filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.5))',
              animation: 'fadeInUp 0.5s ease both',
              animationDelay: `${i * 80}ms`,
              imageRendering: 'pixelated',
            }}
          >
            {emoji}
          </div>
        ))}
      </div>

      {/* Key focus label */}
      <div
        style={{
          position: 'absolute',
          top: 16,
          right: 16,
          background: 'rgba(0,0,0,0.4)',
          borderRadius: 6,
          padding: '4px 8px',
          fontSize: '0.65rem',
          color: definition.palette.text,
          fontFamily: 'monospace',
          letterSpacing: '0.1em',
        }}
      >
        {definition.keyFocus.slice(0, 6).join(' ')}
        {definition.keyFocus.length > 6 && '…'}
      </div>

      {/* Mastery bar at bottom */}
      <div
        style={{
          position: 'absolute',
          bottom: 12,
          left: 16,
          right: 16,
        }}
      >
        <MasteryBar mastery={mastery} accent={definition.palette.accent} showLabel />
      </div>

      {/* CSS animation keyframe — injected inline */}
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
