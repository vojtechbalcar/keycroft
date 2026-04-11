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
  'meadow-farm': meadowFarm,
  'fishing-docks': fishingDocks,
  'mountain-mine': mountainMine,
  'forest-watch': forestWatch,
  'desert-market': desertMarket,
  'volcano-forge': volcanoForge,
}

type Props = {
  params: Promise<{ villageId: string }>
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

  const definition = useMemo(
    () => villageDefinitions.find((v) => v.id === villageId),
    [villageId],
  )

  useEffect(() => {
    if (progress === null) return
    if (progress.placement === null) {
      router.replace('/onboarding')
    }
  }, [progress, router])

  if (!definition) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p style={{ color: 'var(--kc-muted)' }}>Village not found.</p>
      </div>
    )
  }

  if (!progress) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p style={{ color: 'var(--kc-muted)' }}>Loading…</p>
      </div>
    )
  }

  const villageMastery = progress.villageMastery[villageId as VillageId] ?? 0
  const content = VILLAGE_CONTENT[villageId as VillageId]
  const allLessons = [...content.lessons, content.capstone]
  const activeLesson = allLessons[activeLessonIndex]

  function handleSessionComplete(session: TypingSessionState) {
    const metrics = calculateSessionMetrics(session)
    const gained = computeMasteryGain({ accuracy: metrics.accuracy })

    const storage = window.localStorage
    const current = readGuestProgress(storage)
    const prevMastery = current.villageMastery[villageId as VillageId] ?? 0  // fresh value
    const newMastery = applyMasteryGain(prevMastery, gained)
    const updated = recordVillageMasteryGain(current, villageId as VillageId, gained)
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

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        background: 'var(--kc-background)',
      }}
    >
      {/* Header breadcrumb */}
      <header
        style={{
          padding: '0.75rem 1.5rem',
          borderBottom: '1px solid var(--kc-line)',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          flexShrink: 0,
        }}
      >
        <Link
          href="/world"
          style={{ color: 'var(--kc-muted)', textDecoration: 'none', fontSize: '0.8rem' }}
        >
          ← World map
        </Link>
        <span style={{ color: 'var(--kc-line)' }}>|</span>
        <span style={{ color: '#f4efe4', fontWeight: 700 }}>
          {definition.emoji} {definition.name}
        </span>
        <span style={{ color: 'var(--kc-muted)', fontSize: '0.8rem' }}>
          — {definition.tagline}
        </span>
      </header>

      {/* Main layout: scene left, lessons right */}
      <div style={{ flex: 1, display: 'flex', minHeight: 0, overflow: 'hidden' }}>
        {/* Village scene — 55% */}
        <div
          style={{
            width: '55%',
            padding: '1.25rem',
            flexShrink: 0,
            position: 'relative',
          }}
        >
          <VillageScene
            definition={definition}
            mastery={reward ? reward.newMastery : villageMastery}
          />
        </div>

        {/* Lesson panel — 45% */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            borderLeft: '1px solid var(--kc-line)',
          }}
        >
          {/* Lesson list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {allLessons.map((lesson, idx) => {
              const isDone = completedLessonIds.has(lesson.id)
              const isActive = idx === activeLessonIndex && !reward

              return (
                <button
                  key={lesson.id}
                  onClick={() => {
                    setReward(null)
                    setActiveLessonIndex(idx)
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '8px 12px',
                    borderRadius: 8,
                    border: isActive
                      ? `1px solid ${definition.palette.accent}`
                      : '1px solid transparent',
                    background: isActive
                      ? `${definition.palette.accent}22`
                      : 'rgba(255,255,255,0.04)',
                    cursor: 'pointer',
                    textAlign: 'left',
                    color: isDone ? 'rgba(255,255,255,0.4)' : '#f4efe4',
                    width: '100%',
                  }}
                >
                  <span style={{ fontSize: '1rem', flexShrink: 0 }}>
                    {isDone ? '✓' : idx === allLessons.length - 1 ? '⚑' : `${idx + 1}`}
                  </span>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{lesson.label}</div>
                    <div
                      style={{
                        fontSize: '0.7rem',
                        color: 'rgba(255,255,255,0.45)',
                        marginTop: 1,
                      }}
                    >
                      {lesson.focus}
                    </div>
                  </div>
                </button>
              )
            })}
          </div>

          {/* Active lesson typing surface */}
          {!reward && activeLesson && (
            <div style={{ flex: 1, minHeight: 0 }}>
              <div style={{ marginBottom: 8 }}>
                <p
                  style={{
                    color: '#f4efe4',
                    fontWeight: 700,
                    margin: 0,
                    fontSize: '0.9rem',
                  }}
                >
                  {activeLesson.label}
                </p>
                <p
                  style={{
                    color: 'rgba(255,255,255,0.5)',
                    fontSize: '0.75rem',
                    margin: '4px 0 0',
                  }}
                >
                  {activeLesson.goal}
                </p>
              </div>
              <TypingSurface
                prompt={activeLesson}
                onComplete={handleSessionComplete}
              />
            </div>
          )}

          {/* Session reward overlay */}
          {reward && (
            <div
              style={{
                position: 'relative',
                flex: 1,
                borderRadius: 12,
                overflow: 'hidden',
                minHeight: 280,
              }}
            >
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
        </div>
      </div>
    </div>
  )
}
