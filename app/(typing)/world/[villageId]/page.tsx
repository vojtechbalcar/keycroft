'use client'

import Link from 'next/link'
import { use, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { villageDefinitions, type VillageId } from '@/lib/world/village-definitions'
import { useResolvedProgress } from '@/lib/storage/use-resolved-progress'
import { projectWorld } from '@/lib/world/project-world'
import { VillageStageBackdrop } from '@/components/world/village-stage-backdrop'
import { getVillageStageLevel } from '@/lib/world/village-stage-art'
import {
  VILLAGE_BUILDINGS,
  getBuildingLevel,
  getNextLevelProgress,
  type BuildingDefinition,
} from '@/lib/world/village-buildings'

const TEXT  = '#e6edf3'
const MUTED = '#7d8590'
const GOLD  = '#c49a3a'
const GREEN = '#3fb950'
const BG    = '#0d1117'

type Props = { params: Promise<{ villageId: string }> }

export default function VillageLandingPage({ params }: Props) {
  const { villageId } = use(params)
  const router = useRouter()
  const { progress } = useResolvedProgress()
  const [activeBuilding, setActiveBuilding] = useState<BuildingDefinition | null>(null)

  useEffect(() => {
    if (progress === null) return
  }, [progress, router])

  const definition = useMemo(
    () => villageDefinitions.find((v) => v.id === villageId),
    [villageId],
  )

  if (!definition) return (
    <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', background: BG }}>
      <p style={{ color: MUTED, fontFamily: 'var(--font-mono,monospace)' }}>Village not found.</p>
    </div>
  )

  if (!progress) return (
    <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', background: BG }}>
      <p style={{ color: MUTED, fontFamily: 'var(--font-mono,monospace)' }}>Loading…</p>
    </div>
  )

  const worldState = projectWorld(progress)
  const projection = worldState.villages.find((v) => v.definition.id === villageId)
  const mastery    = projection?.mastery ?? 0
  const isLocked   = projection?.state === 'locked'
  const buildings  = VILLAGE_BUILDINGS[villageId as VillageId] ?? []

  return (
    <div style={{
      position: 'relative',
      height: '100vh',
      width: '100%',
      overflow: 'hidden',
      fontFamily: 'var(--font-mono, monospace)',
      background: '#1a1008',
    }}>
      {!isLocked && (
        <VillageStageBackdrop
          villageId={villageId as VillageId}
          mastery={mastery}
        />
      )}

      {/* Gradient overlay */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.25) 40%, rgba(0,0,0,0.45) 70%, rgba(0,0,0,0.88) 100%)',
      }} />

      {/* Backdrop to close popup */}
      {activeBuilding && (
        <div
          style={{ position: 'absolute', inset: 0, zIndex: 20 }}
          onClick={() => setActiveBuilding(null)}
        />
      )}

      {/* ── Back link ─────────────────────────────────── */}
      <div style={{ position: 'absolute', top: '1.25rem', left: '1.5rem', zIndex: 30 }}>
        <Link href="/world" style={{
          color: 'rgba(230,237,243,0.7)', fontSize: '0.72rem', textDecoration: 'none',
          letterSpacing: '0.1em', textTransform: 'uppercase',
        }}>
          ← Back to Map
        </Link>
      </div>

      {/* ── Building hotspots ─────────────────────────── */}
      {!isLocked && buildings.map((building) => {
        const lvl = getBuildingLevel(mastery, building)
        const displayLevel =
          villageId === 'meadow-farm' ? getVillageStageLevel(mastery) - 1 : lvl
        const isActive = activeBuilding?.id === building.id
        return (
          <BuildingHotspot
            key={building.id}
            building={building}
            level={displayLevel}
            isActive={isActive}
            onClick={() => setActiveBuilding(isActive ? null : building)}
          />
        )
      })}

      {/* ── Building popup ────────────────────────────── */}
      {activeBuilding && (
        <BuildingPopup
          building={activeBuilding}
          mastery={mastery}
          onClose={() => setActiveBuilding(null)}
        />
      )}

      {/* ── Bottom village info ───────────────────────── */}
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'flex-end',
        paddingBottom: '3.5rem', zIndex: 10,
        pointerEvents: 'none',
      }}>
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          gap: '0.6rem', textAlign: 'center', maxWidth: 480, width: '100%',
          padding: '0 1.5rem', pointerEvents: 'auto',
        }}>
          <div style={{ fontSize: '2.5rem', lineHeight: 1 }}>{isLocked ? '🔒' : definition.emoji}</div>

          <h1 style={{
            fontFamily: 'var(--font-display, monospace)',
            fontSize: 'clamp(2.4rem, 6vw, 3.8rem)',
            color: TEXT, margin: 0, lineHeight: 1,
            letterSpacing: '0.06em',
            textShadow: '0 2px 20px rgba(0,0,0,0.8)',
          }}>
            {definition.name}
          </h1>

          <p style={{ fontSize: '0.75rem', color: 'rgba(230,237,243,0.6)', margin: 0, letterSpacing: '0.08em' }}>
            {definition.tagline}
          </p>

          {/* Key focus */}
          {!isLocked && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: '0.58rem', color: MUTED, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Keys:</span>
              <div style={{ display: 'flex', gap: 3 }}>
                {definition.keyFocus.slice(0, 8).map((k) => (
                  <div key={k} style={{
                    width: 22, height: 22, borderRadius: 3,
                    border: '1px solid rgba(196,154,58,0.45)',
                    background: 'rgba(196,154,58,0.1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.55rem', fontWeight: 700, color: GOLD,
                  }}>{k.toUpperCase()}</div>
                ))}
              </div>
            </div>
          )}

          {/* Mastery bar */}
          {!isLocked && (
            <div style={{ width: '100%', marginTop: '0.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: '0.56rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: MUTED }}>Mastery</span>
                <span style={{ fontSize: '0.56rem', color: GOLD }}>{mastery}%</span>
              </div>
              <div style={{ height: 3, background: 'rgba(255,255,255,0.1)', borderRadius: 2, overflow: 'hidden' }}>
                <div style={{
                  height: '100%', width: `${mastery}%`,
                  background: mastery > 0 ? GREEN : 'transparent',
                  borderRadius: 2, transition: 'width 400ms ease',
                }} />
              </div>
            </div>
          )}

          {/* CTA */}
          {isLocked ? (
            <div style={{
              marginTop: '0.75rem', padding: '0.65rem 1.75rem',
              background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 4, fontSize: '0.7rem', color: MUTED, letterSpacing: '0.12em', textTransform: 'uppercase',
            }}>
              🔒 Complete previous village to unlock
            </div>
          ) : (
            <Link href={`/world/${villageId}/type`} style={{
              marginTop: '0.75rem', display: 'inline-block',
              padding: '0.8rem 2.25rem', background: GOLD, color: BG,
              fontSize: '0.76rem', fontWeight: 700, letterSpacing: '0.16em',
              textTransform: 'uppercase', textDecoration: 'none', borderRadius: 4,
              boxShadow: '0 4px 24px rgba(196,154,58,0.35)',
            }}>
              Start Typing →
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}

/* ── Hotspot button ──────────────────────────────────────────── */
function BuildingHotspot({
  building, level, isActive, onClick,
}: {
  building: BuildingDefinition
  level: number
  isActive: boolean
  onClick: () => void
}) {
  const labelX = building.labelPosition?.x ?? building.hotspot.x
  const labelY = building.labelPosition?.y ?? building.hotspot.y
  const labelText = `${building.name} Lv. ${level + 1}`

  return (
    <button
      onClick={(e) => { e.stopPropagation(); onClick() }}
      aria-label={labelText}
      title={labelText}
      style={{
        position: 'absolute',
        left: `${labelX}%`,
        top: `${labelY}%`,
        transform: 'translate(-50%, -50%)',
        zIndex: isActive ? 22 : 18,
        background: 'none',
        border: 'none',
        padding: 0,
        cursor: 'pointer',
        display: 'block',
      }}
    >
      <div style={{
        background: isActive ? 'rgba(57,70,77,0.98)' : 'rgba(42,52,58,0.94)',
        border: isActive
          ? '1px solid rgba(196,154,58,0.75)'
          : '1px solid rgba(84,103,109,0.92)',
        boxShadow: isActive
          ? '0 1px 0 rgba(255,255,255,0.08) inset, 0 4px 0 rgba(0,0,0,0.38), 0 0 0 2px rgba(196,154,58,0.12)'
          : '0 1px 0 rgba(255,255,255,0.08) inset, 0 4px 0 rgba(0,0,0,0.35)',
        padding: '4px 9px 5px',
        fontSize: '0.64rem',
        fontWeight: 700,
        color: '#f8fbff',
        letterSpacing: '0.03em',
        whiteSpace: 'nowrap',
        transition: 'transform 150ms ease, box-shadow 150ms ease, border-color 150ms ease',
        transform: isActive ? 'translateY(-1px)' : 'translateY(0)',
      }}>
        {labelText}
      </div>
    </button>
  )
}

/* ── Building info popup ─────────────────────────────────────── */
function BuildingPopup({
  building, mastery, onClose,
}: {
  building: BuildingDefinition
  mastery: number
  onClose: () => void
}) {
  const { currentLevel, nextThreshold, progressPct } = getNextLevelProgress(mastery, building)
  const lvlData   = building.levels[currentLevel]
  const nextData  = building.levels[currentLevel + 1]
  const maxLevel  = building.levels.length - 1
  const isMaxed   = currentLevel >= maxLevel

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 40,
        width: 'min(420px, calc(100vw - 2rem))',
        background: 'rgba(16,20,28,0.97)',
        border: `1px solid rgba(196,154,58,0.25)`,
        borderRadius: 8,
        boxShadow: '0 24px 60px rgba(0,0,0,0.7), 0 0 40px rgba(196,154,58,0.1)',
        fontFamily: 'var(--font-mono, monospace)',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '1rem 1.25rem 0.75rem',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 6,
            background: 'rgba(196,154,58,0.1)',
            border: '1px solid rgba(196,154,58,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.5rem',
          }}>
            {building.emoji}
          </div>
          <div>
            <div style={{ fontSize: '0.95rem', fontWeight: 600, color: TEXT, letterSpacing: '0.04em' }}>
              {building.name}
            </div>
            <div style={{ fontSize: '0.6rem', color: GREEN, letterSpacing: '0.1em', marginTop: 2 }}>
              {lvlData.label} — Level {currentLevel + 1}/{building.levels.length}
            </div>
          </div>
        </div>
        <button
          onClick={onClose}
          style={{
            background: 'none', border: 'none', color: MUTED,
            fontSize: '1rem', cursor: 'pointer', padding: '2px 6px',
            lineHeight: 1,
          }}
        >
          ×
        </button>
      </div>

      {/* Body */}
      <div style={{ padding: '0.9rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {/* Description */}
        <p style={{ fontSize: '0.72rem', color: 'rgba(230,237,243,0.7)', margin: 0, lineHeight: 1.7 }}>
          {building.description}
        </p>

        {/* Current bonus */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '0.5rem 0.75rem',
          background: 'rgba(196,154,58,0.07)',
          border: '1px solid rgba(196,154,58,0.15)',
          borderRadius: 5,
        }}>
          <span style={{ color: GOLD, fontSize: '0.75rem' }}>🔑</span>
          <span style={{ fontSize: '0.65rem', color: MUTED, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            Current Bonus:
          </span>
          <span style={{ fontSize: '0.72rem', color: GOLD, fontWeight: 700 }}>
            {lvlData.bonusLabel}
          </span>
        </div>

        {/* Progress to next level */}
        {!isMaxed && nextData && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span style={{ fontSize: '0.6rem', color: MUTED, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                Next: <span style={{ color: TEXT }}>{nextData.label}</span>
              </span>
              <span style={{ fontSize: '0.6rem', color: MUTED }}>
                {mastery} / {nextThreshold}% mastery
              </span>
            </div>
            {/* Progress bar */}
            <div style={{ height: 6, background: 'rgba(255,255,255,0.07)', borderRadius: 3, overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                width: `${progressPct}%`,
                borderRadius: 3,
                background: `linear-gradient(90deg, ${GREEN} 0%, ${GOLD} 100%)`,
                transition: 'width 400ms ease',
              }} />
            </div>
            <p style={{ fontSize: '0.6rem', color: MUTED, margin: 0, letterSpacing: '0.06em' }}>
              ↑ Keep practicing to upgrade
            </p>
          </div>
        )}

        {isMaxed && (
          <div style={{
            textAlign: 'center', padding: '0.5rem',
            fontSize: '0.65rem', color: GREEN, letterSpacing: '0.1em',
          }}>
            ✓ Fully upgraded
          </div>
        )}
      </div>
    </div>
  )
}
