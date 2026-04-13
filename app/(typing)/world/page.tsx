'use client'

import Link from 'next/link'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { WorldMap } from '@/components/world/world-map'
import { useResolvedProgress } from '@/lib/storage/use-resolved-progress'
import { projectWorld } from '@/lib/world/project-world'
import { getVillageDefinition } from '@/lib/world/village-definitions'
import { villageDefinitions } from '@/lib/world/village-definitions'
import type { VillageId } from '@/lib/world/village-definitions'

const BG       = '#0d1117'
const BORDER_S = '#21262d'
const TEXT     = '#e6edf3'
const MUTED    = '#7d8590'
const GOLD     = '#c49a3a'

export default function WorldPage() {
  const router = useRouter()
  const { progress } = useResolvedProgress()

  useEffect(() => {
    if (progress === null) return
  }, [progress, router])

  if (!progress) {
    return (
      <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', background: BG }}>
        <p style={{ color: MUTED, fontFamily: 'var(--font-mono, monospace)' }}>Loading your world…</p>
      </div>
    )
  }

  const worldState    = projectWorld(progress)
  const currentDef    = getVillageDefinition(worldState.currentVillageId)
  const unlockedCount = villageDefinitions.filter(
    (v) => (progress.villageMastery[v.id as VillageId] ?? 0) > 0
  ).length

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      background: BG,
      fontFamily: 'var(--font-mono, monospace)',
      color: TEXT,
    }}>

      {/* ── Top bar ─────────────────────────────────────────────── */}
      <header style={{
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.65rem 1.25rem',
        borderBottom: `1px solid ${BORDER_S}`,
        background: 'rgba(13,17,23,0.95)',
        backdropFilter: 'blur(6px)',
      }}>
        <Link href="/home" style={{
          color: MUTED,
          fontSize: '0.72rem',
          textDecoration: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: 5,
        }}>
          ← Back
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <span style={{ fontSize: '0.8rem' }}>⊙</span>
          <span style={{
            fontFamily: 'var(--font-display, monospace)',
            fontSize: '1.2rem',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: TEXT,
          }}>
            World Map
          </span>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 5,
          fontSize: '0.68rem',
          color: GOLD,
          letterSpacing: '0.06em',
        }}>
          <span>☆</span>
          <span>{unlockedCount} / {villageDefinitions.length} villages</span>
        </div>
      </header>

      {/* ── Map ─────────────────────────────────────────────────── */}
      <div style={{ flex: 1, padding: '0.75rem', minHeight: 0 }}>
        <WorldMap worldState={worldState} />
      </div>

      {/* ── Bottom bar — current village CTA ────────────────────── */}
      <div style={{
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.75rem 1.25rem',
        borderTop: `1px solid ${BORDER_S}`,
        background: 'rgba(13,17,23,0.95)',
        backdropFilter: 'blur(6px)',
      }}>
        <div>
          <p style={{ fontSize: '0.6rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: MUTED, margin: 0, marginBottom: 3 }}>
            Current destination
          </p>
          <p style={{ fontFamily: 'var(--font-display, monospace)', fontSize: '1.15rem', color: TEXT, margin: 0, letterSpacing: '0.06em' }}>
            {currentDef.emoji} {currentDef.name}
          </p>
          <p style={{ fontSize: '0.62rem', color: MUTED, margin: '2px 0 0' }}>
            {currentDef.tagline}
          </p>
        </div>

        <Link
          href={`/world/${worldState.currentVillageId}`}
          style={{
            display: 'inline-block',
            padding: '0.6rem 1.5rem',
            background: GOLD,
            color: BG,
            fontSize: '0.72rem',
            fontWeight: 700,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            textDecoration: 'none',
            borderRadius: 4,
          }}
        >
          Enter Village →
        </Link>
      </div>
    </div>
  )
}
