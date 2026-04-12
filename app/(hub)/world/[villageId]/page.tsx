'use client'

import Link from 'next/link'
import { use, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { VillageScene } from '@/components/world/village-scene'
import { SessionReward } from '@/components/world/session-reward'
import { villageDefinitions, type VillageId } from '@/lib/world/village-definitions'
import { meadowFarm } from '@/content/villages/meadow-farm'
import { fishingDocks } from '@/content/villages/fishing-docks'
import { mountainMine } from '@/content/villages/mountain-mine'
import { forestWatch } from '@/content/villages/forest-watch'
import { desertMarket } from '@/content/villages/desert-market'
import { volcanoForge } from '@/content/villages/volcano-forge'
import type { VillageContent } from '@/content/villages/meadow-farm'
import { TypingSurface } from '@/components/typing/typing-surface'
import { useResolvedProgress } from '@/lib/storage/use-resolved-progress'
import {
  readGuestProgress,
  recordVillageMasteryGain,
  saveGuestProgress,
} from '@/lib/storage/guest-progress'
import { computeMasteryGain, applyMasteryGain } from '@/lib/world/mastery-rules'
import {
  calculateSessionMetrics,
  type SessionMetrics,
} from '@/lib/typing/session-metrics'
import type { TypingSessionState } from '@/lib/typing/text-runner'

const VILLAGE_CONTENT: Record<VillageId, VillageContent> = {
  'meadow-farm':    meadowFarm,
  'fishing-docks':  fishingDocks,
  'mountain-mine':  mountainMine,
  'forest-watch':   forestWatch,
  'desert-market':  desertMarket,
  'volcano-forge':  volcanoForge,
}

type Props = { params: Promise<{ villageId: string }> }

/* ── shared tokens ─────────────────────────────────────────────── */
const BG       = '#0d1117'
const BG_CARD  = '#161b22'
const BORDER   = '#30363d'
const BORDER_S = '#21262d'
const TEXT     = '#e6edf3'
const MUTED    = '#7d8590'
const GOLD     = '#c49a3a'

/* ── stat pill ─────────────────────────────────────────────────── */
function StatPill({ icon, value, label }: { icon: string; value: string; label: string }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      background: BG_CARD,
      border: `1px solid ${BORDER}`,
      borderRadius: 6,
      padding: '0.4rem 0.875rem',
    }}>
      <span style={{ fontSize: '0.75rem' }}>{icon}</span>
      <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.78rem', fontWeight: 700, color: TEXT }}>
        {value}
      </span>
      <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.62rem', color: MUTED, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
        {label}
      </span>
    </div>
  )
}

export default function VillagePage({ params }: Props) {
  const { villageId } = use(params)
  const router = useRouter()
  const { progress, setProgress } = useResolvedProgress()

  const [activeLessonIndex, setActiveLessonIndex] = useState(0)
  const [completedLessonIds, setCompletedLessonIds] = useState<Set<string>>(new Set())
  const [reward, setReward] = useState<{
    metrics: SessionMetrics
    masteryGained: number
    newMastery: number
    prevMastery: number
  } | null>(null)
  const [sessionKey, setSessionKey] = useState(0) // force TypingSurface remount on reset

  const definition = useMemo(
    () => villageDefinitions.find((v) => v.id === villageId),
    [villageId],
  )

  useEffect(() => {
    if (progress === null) return
    if (progress.placement === null) router.replace('/onboarding')
  }, [progress, router])

  if (!definition) {
    return (
      <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', background: BG }}>
        <p style={{ color: MUTED, fontFamily: 'var(--font-mono, monospace)' }}>Village not found.</p>
      </div>
    )
  }

  if (!progress) {
    return (
      <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', background: BG }}>
        <p style={{ color: MUTED, fontFamily: 'var(--font-mono, monospace)' }}>Loading…</p>
      </div>
    )
  }

  const villageMastery = progress.villageMastery[villageId as VillageId] ?? 0
  const content        = VILLAGE_CONTENT[villageId as VillageId]
  const allLessons     = [...content.lessons, content.capstone]
  const activeLesson   = allLessons[activeLessonIndex]

  function handleSessionComplete(session: TypingSessionState) {
    const metrics  = calculateSessionMetrics(session)
    const gained   = computeMasteryGain({ accuracy: metrics.accuracy })
    const storage  = window.localStorage
    const current  = readGuestProgress(storage)
    const prevMastery = current.villageMastery[villageId as VillageId] ?? 0
    const newMastery  = applyMasteryGain(prevMastery, gained)
    const updated  = recordVillageMasteryGain(current, villageId as VillageId, gained)
    saveGuestProgress(storage, updated)
    setProgress(updated)
    setCompletedLessonIds((prev) => new Set([...prev, activeLesson.id]))
    setReward({ metrics, masteryGained: gained, newMastery, prevMastery })
  }

  function handleNextLesson() {
    setReward(null)
    if (activeLessonIndex < allLessons.length - 1) {
      setActiveLessonIndex((i) => i + 1)
    }
  }

  function handleReset() {
    setReward(null)
    setSessionKey((k) => k + 1)
  }

  const mastery = reward ? reward.newMastery : villageMastery

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: BG, fontFamily: 'var(--font-mono, monospace)' }}>

      {/* ── Top bar ─────────────────────────────────────────────── */}
      <header style={{
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.6rem 1.25rem',
        borderBottom: `1px solid ${BORDER_S}`,
        background: 'rgba(13,17,23,0.95)',
        backdropFilter: 'blur(6px)',
      }}>
        <Link href="/world" style={{
          color: MUTED,
          fontSize: '0.72rem',
          textDecoration: 'none',
          letterSpacing: '0.08em',
          display: 'flex',
          alignItems: 'center',
          gap: 5,
        }}>
          ← Back
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <span style={{ fontSize: '0.75rem' }}>⚙</span>
          <span style={{
            fontFamily: 'var(--font-display, monospace)',
            fontSize: '1.2rem',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: TEXT,
          }}>
            {definition.name}
          </span>
        </div>

        <button
          onClick={handleReset}
          style={{
            background: 'none',
            border: 'none',
            color: MUTED,
            fontSize: '0.72rem',
            cursor: 'pointer',
            letterSpacing: '0.08em',
            display: 'flex',
            alignItems: 'center',
            gap: 5,
            padding: 0,
          }}
        >
          ↺ Reset
        </button>
      </header>

      {/* ── Stat pills ──────────────────────────────────────────── */}
      <div style={{
        flexShrink: 0,
        display: 'flex',
        justifyContent: 'center',
        gap: '0.75rem',
        padding: '0.75rem 1.25rem',
        borderBottom: `1px solid ${BORDER_S}`,
      }}>
        <StatPill icon="⚡" value="0" label="WPM" />
        <StatPill icon="🎯" value="100%" label="ACC" />
        <StatPill icon="⏱" value="01:00" label="" />
      </div>

      {/* ── Main area ───────────────────────────────────────────── */}
      <div style={{ flex: 1, display: 'flex', minHeight: 0, overflow: 'hidden' }}>

        {/* Lesson sidebar */}
        <aside style={{
          width: 220,
          flexShrink: 0,
          borderRight: `1px solid ${BORDER_S}`,
          overflowY: 'auto',
          padding: '0.875rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.3rem',
        }}>
          <p style={{ fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: MUTED, margin: '0 0 0.5rem 0' }}>
            Lessons
          </p>
          {allLessons.map((lesson, idx) => {
            const isDone   = completedLessonIds.has(lesson.id)
            const isActive = idx === activeLessonIndex && !reward
            return (
              <button
                key={lesson.id}
                onClick={() => { setReward(null); setActiveLessonIndex(idx) }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '0.5rem 0.625rem',
                  borderRadius: 5,
                  border: isActive
                    ? `1px solid ${definition.palette.accent}`
                    : `1px solid transparent`,
                  background: isActive ? `${definition.palette.accent}18` : 'transparent',
                  cursor: 'pointer',
                  textAlign: 'left',
                  color: isDone ? MUTED : TEXT,
                  width: '100%',
                  fontFamily: 'var(--font-mono, monospace)',
                }}
              >
                <span style={{ fontSize: '0.7rem', flexShrink: 0, color: isDone ? GOLD : MUTED }}>
                  {isDone ? '✓' : idx === allLessons.length - 1 ? '⚑' : `${idx + 1}`}
                </span>
                <div>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700 }}>{lesson.label}</div>
                  <div style={{ fontSize: '0.62rem', color: MUTED, marginTop: 1 }}>{lesson.focus}</div>
                </div>
              </button>
            )
          })}

          {/* Village scene thumbnail */}
          <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: `1px solid ${BORDER_S}` }}>
            <VillageScene definition={definition} mastery={mastery} />
          </div>
        </aside>

        {/* Typing area or reward */}
        <main style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, background: BG }}>
          {!reward && activeLesson && (
            <>
              <div style={{ padding: '0.875rem 1.5rem 0', flexShrink: 0 }}>
                <p style={{ fontFamily: 'var(--font-display, monospace)', fontSize: '1.3rem', color: TEXT, margin: 0 }}>
                  {activeLesson.label}
                </p>
                <p style={{ fontSize: '0.68rem', color: MUTED, margin: '3px 0 0' }}>
                  {activeLesson.goal}
                </p>
              </div>
              <TypingSurface
                key={`${activeLessonIndex}-${sessionKey}`}
                prompt={activeLesson}
                onComplete={handleSessionComplete}
              />
            </>
          )}

          {reward && (
            <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
              <SessionReward
                definition={definition}
                metrics={reward.metrics}
                masteryGained={reward.masteryGained}
                newMastery={reward.newMastery}
                prevMastery={reward.prevMastery}
                onNextLesson={handleNextLesson}
              />
            </div>
          )}
        </main>
      </div>

      {/* ── Mastery bar ─────────────────────────────────────────── */}
      <div style={{
        flexShrink: 0,
        padding: '0.6rem 1.25rem 0.75rem',
        borderTop: `1px solid ${BORDER_S}`,
        background: 'rgba(13,17,23,0.95)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
          <span style={{ fontSize: '0.6rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: MUTED }}>
            Mastery
          </span>
          <span style={{ fontSize: '0.6rem', color: MUTED }}>
            {mastery} / 100 xp
          </span>
        </div>
        <div style={{ height: 4, background: BORDER_S, borderRadius: 2, overflow: 'hidden' }}>
          <div style={{
            height: '100%',
            width: `${mastery}%`,
            background: GOLD,
            borderRadius: 2,
            transition: 'width 400ms ease',
          }} />
        </div>
      </div>
    </div>
  )
}
