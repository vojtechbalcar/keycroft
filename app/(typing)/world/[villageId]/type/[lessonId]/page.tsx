'use client'

import Link from 'next/link'
import { use, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'

import { desertMarket } from '@/content/villages/desert-market'
import { fishingDocks } from '@/content/villages/fishing-docks'
import { forestWatch } from '@/content/villages/forest-watch'
import type { VillageContent } from '@/content/villages/meadow-farm'
import { meadowFarm } from '@/content/villages/meadow-farm'
import { mountainMine } from '@/content/villages/mountain-mine'
import { volcanoForge } from '@/content/villages/volcano-forge'
import { TypingSurface } from '@/components/typing/typing-surface'
import { buildVillageLessonGallery } from '@/lib/content/build-village-lesson-gallery'
import { markLessonComplete } from '@/lib/storage/lesson-progress'
import {
  readGuestProgress,
  recordVillageMasteryGain,
  saveGuestProgress,
} from '@/lib/storage/guest-progress'
import { useResolvedProgress } from '@/lib/storage/use-resolved-progress'
import { calculateSessionMetrics } from '@/lib/typing/session-metrics'
import type { TypingSessionState } from '@/lib/typing/text-runner'
import { applyMasteryGain, computeMasteryGain } from '@/lib/world/mastery-rules'
import { villageDefinitions, type VillageId } from '@/lib/world/village-definitions'

const VILLAGE_CONTENT: Record<VillageId, VillageContent> = {
  'meadow-farm': meadowFarm,
  'fishing-docks': fishingDocks,
  'mountain-mine': mountainMine,
  'forest-watch': forestWatch,
  'desert-market': desertMarket,
  'volcano-forge': volcanoForge,
}

const BG     = '#0d1117'
const BORDER = '#21262d'
const TEXT   = '#e6edf3'
const MUTED  = '#7d8590'
const GOLD   = '#c49a3a'
const GREEN  = '#3fb950'

type Props = { params: Promise<{ villageId: string; lessonId: string }> }

export default function LessonTypingPage({ params }: Props) {
  const { villageId, lessonId } = use(params)
  const router = useRouter()
  const { progress, setProgress } = useResolvedProgress()
  const [sessionKey, setSessionKey] = useState(0)
  const [result, setResult] = useState<{ wpm: number; accuracy: number } | null>(null)

  useEffect(() => {
    if (progress === null) return
  }, [progress, router])

  const definition = useMemo(
    () => villageDefinitions.find((v) => v.id === villageId),
    [villageId],
  )

  const lessons = useMemo(() => {
    if (!definition) return []
    const content = VILLAGE_CONTENT[villageId as VillageId]
    if (!content) return []
    return buildVillageLessonGallery(content, definition)
  }, [definition, villageId])

  const lesson = useMemo(
    () => lessons.find((l) => l.id === lessonId),
    [lessons, lessonId],
  )

  const lessonIndex = useMemo(
    () => lessons.findIndex((l) => l.id === lessonId),
    [lessons, lessonId],
  )

  const nextLesson = lessons[lessonIndex + 1] ?? null

  if (!definition || !lesson || !progress) {
    return (
      <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', background: BG }}>
        <p style={{ color: MUTED, fontFamily: 'var(--font-mono,monospace)', fontSize: '0.78rem' }}>Loading…</p>
      </div>
    )
  }

  function handleComplete(session: TypingSessionState) {
    const metrics = calculateSessionMetrics(session)
    markLessonComplete(lessonId)

    // Update mastery
    const storage = window.localStorage
    const current = readGuestProgress(storage)
    const gained = computeMasteryGain({ accuracy: metrics.accuracy })
    const updated = recordVillageMasteryGain(current, villageId as VillageId, gained)
    saveGuestProgress(storage, updated)
    setProgress(updated)

    setResult({ wpm: Math.round(metrics.wpm), accuracy: Math.round(metrics.accuracy) })
  }

  function handleReset() {
    setResult(null)
    setSessionKey((k) => k + 1)
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      background: BG,
      fontFamily: 'var(--font-mono, monospace)',
      color: TEXT,
    }}>
      {/* ── Header ─────────────────────────────────────────────── */}
      <header style={{
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.6rem 1.5rem',
        borderBottom: `1px solid ${BORDER}`,
      }}>
        <Link href={`/world/${villageId}/type`} style={{
          color: MUTED,
          fontSize: '0.7rem',
          textDecoration: 'none',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
        }}>
          ← Back
        </Link>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          fontFamily: 'var(--font-display, monospace)',
          fontSize: '1.1rem',
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: TEXT,
        }}>
          <span>{definition.emoji}</span>
          <span>{definition.name}</span>
          <span style={{ fontSize: '0.65rem', color: MUTED, fontFamily: 'var(--font-mono,monospace)' }}>
            {lessonIndex + 1}/{lessons.length}
          </span>
        </div>

        <button
          onClick={handleReset}
          style={{
            background: 'none',
            border: 'none',
            color: MUTED,
            fontSize: '0.7rem',
            cursor: 'pointer',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            padding: 0,
            fontFamily: 'var(--font-mono, monospace)',
          }}
        >
          ↺ Reset
        </button>
      </header>

      {/* ── Typing or completion ────────────────────────────────── */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        {!result ? (
          <TypingSurface
            key={`${lessonId}-${sessionKey}`}
            prompt={lesson}
            keyFocus={lesson.keyFocus.length > 0 ? lesson.keyFocus : definition.keyFocus}
            onComplete={handleComplete}
          />
        ) : (
          <LessonComplete
            lessonTitle={lesson.label}
            wpm={result.wpm}
            accuracy={result.accuracy}
            onRetry={handleReset}
            nextLessonHref={nextLesson ? `/world/${villageId}/type/${nextLesson.id}` : null}
            galleryHref={`/world/${villageId}/type`}
          />
        )}
      </main>
    </div>
  )
}

function LessonComplete({
  lessonTitle,
  wpm,
  accuracy,
  onRetry,
  nextLessonHref,
  galleryHref,
}: {
  lessonTitle: string
  wpm: number
  accuracy: number
  onRetry: () => void
  nextLessonHref: string | null
  galleryHref: string
}) {
  return (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '2rem',
      padding: '2rem',
    }}>
      {/* Title */}
      <div style={{ textAlign: 'center' }}>
        <div style={{
          fontFamily: 'var(--font-display, monospace)',
          fontSize: 'clamp(2rem, 5vw, 3.5rem)',
          color: GOLD,
          letterSpacing: '0.06em',
          lineHeight: 1,
          marginBottom: '0.5rem',
        }}>
          Lesson Complete
        </div>
        <div style={{ fontSize: '0.72rem', color: MUTED, letterSpacing: '0.12em' }}>
          {lessonTitle}
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', gap: '1.5rem' }}>
        <StatBox label="WPM" value={String(wpm)} highlight={wpm >= 40} />
        <StatBox label="ACC" value={`${accuracy}%`} highlight={accuracy >= 90} />
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <button
          onClick={onRetry}
          style={{
            padding: '0.7rem 1.5rem',
            background: 'rgba(255,255,255,0.05)',
            border: `1px solid ${BORDER}`,
            borderRadius: 4,
            color: TEXT,
            fontSize: '0.72rem',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            fontFamily: 'var(--font-mono, monospace)',
          }}
        >
          ↺ Retry
        </button>

        {nextLessonHref && (
          <Link
            href={nextLessonHref}
            style={{
              padding: '0.7rem 1.75rem',
              background: GOLD,
              border: `1px solid ${GOLD}`,
              borderRadius: 4,
              color: BG,
              fontSize: '0.72rem',
              fontWeight: 700,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              textDecoration: 'none',
            }}
          >
            Next Lesson →
          </Link>
        )}

        <Link
          href={galleryHref}
          style={{
            padding: '0.7rem 1.5rem',
            background: 'none',
            border: `1px solid ${BORDER}`,
            borderRadius: 4,
            color: MUTED,
            fontSize: '0.72rem',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            textDecoration: 'none',
          }}
        >
          ← Gallery
        </Link>
      </div>
    </div>
  )
}

function StatBox({ label, value, highlight }: { label: string; value: string; highlight: boolean }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 4,
      padding: '1.25rem 2rem',
      background: highlight ? 'rgba(63,185,80,0.07)' : 'rgba(255,255,255,0.03)',
      border: `1px solid ${highlight ? 'rgba(63,185,80,0.3)' : BORDER}`,
      borderRadius: 6,
      minWidth: 100,
    }}>
      <div style={{
        fontFamily: 'var(--font-display, monospace)',
        fontSize: '2.5rem',
        color: highlight ? GREEN : TEXT,
        lineHeight: 1,
      }}>
        {value}
      </div>
      <div style={{ fontSize: '0.58rem', color: MUTED, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
        {label}
      </div>
    </div>
  )
}
