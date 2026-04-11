import type { WorldState } from '@/lib/world/project-world'
import type { VillageId } from '@/lib/world/village-definitions'
import { VillageMarker } from './village-marker'

// Position of each village marker on the map (left%, top% of container)
const VILLAGE_POSITIONS: Record<VillageId, { left: string; top: string }> = {
  'meadow-farm':    { left: '8%',  top: '48%' },
  'fishing-docks':  { left: '32%', top: '35%' },
  'mountain-mine':  { left: '58%', top: '35%' },
  'forest-watch':   { left: '58%', top: '10%' },
  'desert-market':  { left: '32%', top: '62%' },
  'volcano-forge':  { left: '8%',  top: '62%' },
}

// Paths: [from, to] — only drawn if the "to" village is unlocked
const PATHS: [VillageId, VillageId][] = [
  ['meadow-farm',   'fishing-docks'],
  ['fishing-docks', 'mountain-mine'],
  ['mountain-mine', 'forest-watch'],
  ['mountain-mine', 'desert-market'],
  ['desert-market', 'volcano-forge'],
]

type WorldMapProps = {
  worldState: WorldState
}

export function WorldMap({ worldState }: WorldMapProps) {
  // Build a lookup for quick access
  const projectionByIdMap = new Map(
    worldState.villages.map((p) => [p.definition.id, p]),
  )

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        background: 'radial-gradient(ellipse at 40% 40%, #1a3020 0%, #0d1a10 100%)',
        borderRadius: 16,
        overflow: 'hidden',
      }}
    >
      {/* Parchment texture overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `
            repeating-linear-gradient(
              0deg,
              transparent,
              transparent 40px,
              rgba(255,255,255,0.02) 40px,
              rgba(255,255,255,0.02) 41px
            ),
            repeating-linear-gradient(
              90deg,
              transparent,
              transparent 40px,
              rgba(255,255,255,0.02) 40px,
              rgba(255,255,255,0.02) 41px
            )
          `,
          pointerEvents: 'none',
        }}
      />

      {/* SVG layer for paths */}
      <svg
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
        preserveAspectRatio="none"
      >
        {PATHS.map(([fromId, toId]) => {
          const toProjection = projectionByIdMap.get(toId)
          if (!toProjection || toProjection.state === 'locked') return null

          const from = VILLAGE_POSITIONS[fromId]
          const to = VILLAGE_POSITIONS[toId]

          // Convert percentage strings to numbers for SVG
          const x1 = parseFloat(from.left) + 5  // offset to center of marker
          const y1 = parseFloat(from.top) + 6
          const x2 = parseFloat(to.left) + 5
          const y2 = parseFloat(to.top) + 6

          return (
            <line
              key={`${fromId}-${toId}`}
              x1={`${x1}%`}
              y1={`${y1}%`}
              x2={`${x2}%`}
              y2={`${y2}%`}
              stroke="rgba(245,200,66,0.4)"
              strokeWidth="2"
              strokeDasharray="6 4"
            />
          )
        })}
      </svg>

      {/* Village markers */}
      {worldState.villages.map((projection) => {
        const pos = VILLAGE_POSITIONS[projection.definition.id]
        return (
          <div
            key={projection.definition.id}
            style={{
              position: 'absolute',
              left: pos.left,
              top: pos.top,
              transform: 'translate(-50%, -50%)',
            }}
          >
            <VillageMarker projection={projection} />
          </div>
        )
      })}

      {/* Map title */}
      <div
        style={{
          position: 'absolute',
          top: 12,
          left: '50%',
          transform: 'translateX(-50%)',
          color: 'rgba(245,200,66,0.7)',
          fontSize: '0.6rem',
          letterSpacing: '0.3em',
          fontWeight: 700,
          textTransform: 'uppercase',
          whiteSpace: 'nowrap',
        }}
      >
        ✦ The Keycroft World ✦
      </div>
    </div>
  )
}
