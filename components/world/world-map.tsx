'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { WorldState, VillageProjection } from '@/lib/world/project-world'
import type { VillageId } from '@/lib/world/village-definitions'

/* Village positions on the parchment map image (% of container) */
const VILLAGE_POSITIONS: Record<VillageId, { left: string; top: string }> = {
  'meadow-farm':    { left: '36%', top: '64%' },
  'fishing-docks':  { left: '62%', top: '72%' },
  'mountain-mine':  { left: '55%', top: '40%' },
  'forest-watch':   { left: '38%', top: '22%' },
  'desert-market':  { left: '17%', top: '38%' },
  'volcano-forge':  { left: '72%', top: '30%' },
}

/* ── Hover overlay card ─────────────────────────────────────────── */
function VillageOverlay({ projection }: { projection: VillageProjection }) {
  const { definition, mastery, state } = projection
  const locked = state === 'locked'

  return (
    <div style={{
      position: 'absolute',
      bottom: 'calc(100% + 10px)',
      left: '50%',
      transform: 'translateX(-50%)',
      width: 210,
      background: 'rgba(13,17,23,0.95)',
      border: '1px solid #30363d',
      borderRadius: 6,
      padding: '0.875rem',
      pointerEvents: 'none',
      zIndex: 20,
      boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
      fontFamily: 'var(--font-mono, monospace)',
    }}>
      {/* Village name */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 6 }}>
        <span style={{ fontSize: '1rem' }}>{locked ? '🔒' : definition.emoji}</span>
        <span style={{
          fontFamily: 'var(--font-display, monospace)',
          fontSize: '1.1rem',
          color: locked ? '#7d8590' : '#e6edf3',
          letterSpacing: '0.04em',
        }}>
          {definition.name}
        </span>
      </div>

      {/* Tagline */}
      <p style={{ fontSize: '0.65rem', color: '#7d8590', margin: '0 0 8px', lineHeight: 1.6 }}>
        {definition.tagline}
      </p>

      {/* Key focus */}
      {!locked && (
        <p style={{ fontSize: '0.62rem', color: '#7d8590', margin: '0 0 10px', letterSpacing: '0.06em' }}>
          Keys:{' '}
          <span style={{ color: '#c49a3a', letterSpacing: '0.12em' }}>
            {definition.keyFocus.map((k) => k.toUpperCase()).join(' ')}
          </span>
        </p>
      )}

      {/* Mastery bar */}
      {!locked && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ fontSize: '0.58rem', color: '#7d8590', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              🔥 Mastery
            </span>
            <span style={{ fontSize: '0.58rem', color: '#c49a3a' }}>{mastery}%</span>
          </div>
          <div style={{ height: 4, background: '#21262d', borderRadius: 2, overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              width: `${mastery}%`,
              background: mastery > 0 ? '#3fb950' : 'transparent',
              borderRadius: 2,
              transition: 'width 300ms ease',
            }} />
          </div>
        </div>
      )}

      {locked && (
        <p style={{ fontSize: '0.62rem', color: '#444c56', margin: 0, letterSpacing: '0.08em' }}>
          Complete previous village to unlock
        </p>
      )}

      {/* Arrow */}
      <div style={{
        position: 'absolute',
        bottom: -6,
        left: '50%',
        transform: 'translateX(-50%)',
        width: 10,
        height: 10,
        background: '#30363d',
        clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
      }} />
    </div>
  )
}

/* ── Village pin ────────────────────────────────────────────────── */
function VillagePin({ projection }: { projection: VillageProjection }) {
  const [hovered, setHovered] = useState(false)
  const { definition, state, isCurrentVillage, mastery } = projection
  const locked = state === 'locked'

  const pin = (
    <div
      style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Hover overlay */}
      {hovered && <VillageOverlay projection={projection} />}

      {/* Icon */}
      <div style={{
        width: 38,
        height: 38,
        borderRadius: 6,
        border: isCurrentVillage
          ? '2px solid #c49a3a'
          : locked
            ? '1px solid rgba(255,255,255,0.1)'
            : '1px solid rgba(255,255,255,0.25)',
        background: isCurrentVillage
          ? 'rgba(196,154,58,0.18)'
          : locked
            ? 'rgba(0,0,0,0.5)'
            : 'rgba(13,17,23,0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.3rem',
        cursor: locked ? 'default' : 'pointer',
        opacity: locked ? 0.4 : 1,
        boxShadow: isCurrentVillage ? '0 0 14px rgba(196,154,58,0.45)' : 'none',
        transition: 'all 0.2s',
        transform: hovered && !locked ? 'scale(1.08)' : 'scale(1)',
        backdropFilter: 'blur(4px)',
      }}>
        {locked ? '🔒' : definition.emoji}
      </div>

      {/* Name label */}
      <div style={{
        fontFamily: 'var(--font-display, monospace)',
        fontSize: '0.75rem',
        color: isCurrentVillage ? '#c49a3a' : locked ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.8)',
        letterSpacing: '0.04em',
        textAlign: 'center',
        whiteSpace: 'nowrap',
        textShadow: '0 1px 4px rgba(0,0,0,0.8)',
      }}>
        {definition.name}
      </div>
    </div>
  )

  if (locked) return pin

  return (
    <Link href={`/world/${definition.id}`} style={{ textDecoration: 'none' }}>
      {pin}
    </Link>
  )
}

/* ── World Map ──────────────────────────────────────────────────── */
type WorldMapProps = { worldState: WorldState }

export function WorldMap({ worldState }: WorldMapProps) {
  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: '100%',
      borderRadius: 12,
      overflow: 'hidden',
      backgroundImage: 'url(/images/map-image.png)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundColor: '#1a1008',
    }}>
      {/* Slight dark vignette so pins pop */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.35) 100%)',
        pointerEvents: 'none',
      }} />

      {/* Village pins */}
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
              zIndex: 5,
            }}
          >
            <VillagePin projection={projection} />
          </div>
        )
      })}
    </div>
  )
}
