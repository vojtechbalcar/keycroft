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
import { SessionReward } from '@/components/world/session-reward'
import { buildVillageLessonGallery } from '@/lib/content/build-village-lesson-gallery'
import {
  readGuestProgress,
  recordVillageMasteryGain,
  saveGuestProgress,
} from '@/lib/storage/guest-progress'
import { useResolvedProgress } from '@/lib/storage/use-resolved-progress'
import {
  calculateSessionMetrics,
  type SessionMetrics,
} from '@/lib/typing/session-metrics'
import type { TypingSessionState } from '@/lib/typing/text-runner'
import { applyMasteryGain, computeMasteryGain } from '@/lib/world/mastery-rules'
import {
  villageDefinitions,
  type VillageId,
} from '@/lib/world/village-definitions'

const VILLAGE_CONTENT: Record<VillageId, VillageContent> = {
  'meadow-farm': meadowFarm,
  'fishing-docks': fishingDocks,
  'mountain-mine': mountainMine,
  'forest-watch': forestWatch,
  'desert-market': desertMarket,
  'volcano-forge': volcanoForge,
}

type Props = { params: Promise<{ villageId: string }> }

export default function VillageTypePage({ params }: Props) {
  const { villageId } = use(params)
  const router = useRouter()
  const { progress, setProgress } = useResolvedProgress()

  const [activeLessonIndex, setActiveLessonIndex] = useState(0)
  const [sessionKey, setSessionKey] = useState(0)
  const [reward, setReward] = useState<{
    metrics: SessionMetrics
    masteryGained: number
    newMastery: number
    prevMastery: number
  } | null>(null)

  const definition = useMemo(
    () => villageDefinitions.find((village) => village.id === villageId),
    [villageId],
  )
  const content = VILLAGE_CONTENT[villageId as VillageId]
  const galleryLessons = useMemo(() => {
    if (!definition || !content) {
      return []
    }

    return buildVillageLessonGallery(content, definition)
  }, [content, definition])
  const activeLesson = galleryLessons[activeLessonIndex] ?? galleryLessons[0] ?? null
  const groupedLessons = useMemo(() => {
    const groups = new Map<string, typeof galleryLessons>()

    for (const lesson of galleryLessons) {
      const section =
        lesson.kind === 'foundation'
          ? 'Foundation keys'
          : lesson.kind === 'authored'
            ? 'Village lessons'
            : lesson.kind === 'story'
              ? 'Story drills'
              : 'Capstone'

      groups.set(section, [...(groups.get(section) ?? []), lesson])
    }

    return [...groups.entries()]
  }, [galleryLessons])
  const villageMastery = progress?.villageMastery[villageId as VillageId] ?? 0

  useEffect(() => {
    if (progress === null) {
      return
    }

    if (progress.placement === null) {
      router.replace('/onboarding')
    }
  }, [progress, router])

  if (!definition) {
    return (
      <div className="flex h-screen items-center justify-center bg-[var(--kc-background)]">
        <p className="text-sm text-[var(--kc-muted)]">Village not found.</p>
      </div>
    )
  }

  if (!progress) {
    return (
      <div className="flex h-screen items-center justify-center bg-[linear-gradient(180deg,#f4ebd7_0%,#ebdfc9_100%)]">
        <p className="text-sm text-[var(--kc-on-surface-muted)]">
          Gathering your lesson atlas...
        </p>
      </div>
    )
  }

  if (!activeLesson) {
    return (
      <div className="flex h-screen items-center justify-center bg-[linear-gradient(180deg,#f4ebd7_0%,#ebdfc9_100%)]">
        <p className="text-sm text-[var(--kc-on-surface-muted)]">
          This village does not have lessons yet.
        </p>
      </div>
    )
  }

  function handleSessionComplete(session: TypingSessionState) {
    const metrics = calculateSessionMetrics(session)
    const masteryGained = computeMasteryGain({ accuracy: metrics.accuracy })
    const storage = window.localStorage
    const currentProgress = readGuestProgress(storage)
    const prevMastery = currentProgress.villageMastery[villageId as VillageId] ?? 0
    const updatedProgress = recordVillageMasteryGain(
      currentProgress,
      villageId as VillageId,
      masteryGained,
    )
    const newMastery = applyMasteryGain(prevMastery, masteryGained)

    saveGuestProgress(storage, updatedProgress)
    setProgress(updatedProgress)
    setReward({
      metrics,
      masteryGained,
      newMastery,
      prevMastery,
    })
  }

  function handleReset() {
    setReward(null)
    setSessionKey((current) => current + 1)
  }

  function handleNextLesson() {
    setReward(null)

    if (activeLessonIndex < galleryLessons.length - 1) {
      setActiveLessonIndex((current) => current + 1)
      setSessionKey((current) => current + 1)
    }
  }

  function handleSelectLesson(index: number) {
    setReward(null)
    setActiveLessonIndex(index)
    setSessionKey((current) => current + 1)
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f4ebd7_0%,#ebdfc9_100%)] text-[var(--kc-on-surface)]">
      <div className="mx-auto flex min-h-screen max-w-[1680px] flex-col xl:grid xl:grid-cols-[360px_minmax(0,1fr)]">
        <aside className="border-b border-[rgba(107,94,72,0.12)] bg-[rgba(255,248,238,0.86)] px-5 py-5 xl:border-b-0 xl:border-r xl:px-6 xl:py-6">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <Link
                href={`/world/${villageId}`}
                className="text-xs uppercase tracking-[0.22em] text-[var(--kc-on-surface-muted)]"
              >
                ← Back to village
              </Link>
              <div className="space-y-1">
                <p className="text-xs uppercase tracking-[0.22em] text-[var(--kc-on-surface-muted)]">
                  {definition.emoji} lesson atlas
                </p>
                <h1 className="text-3xl text-[var(--kc-on-surface)]">
                  {definition.name}
                </h1>
                <p className="text-sm leading-6 text-[var(--kc-on-surface-muted)]">
                  {definition.tagline}. This village now unfolds like a real
                  learning path: key pairs first, then studio lines, then fuller
                  story drills.
                </p>
              </div>
            </div>

            <button
              className="rounded-full border border-[rgba(107,94,72,0.16)] bg-[rgba(255,250,240,0.8)] px-3 py-2 text-xs uppercase tracking-[0.18em] text-[var(--kc-on-surface-muted)] transition hover:border-[rgba(74,140,58,0.25)] hover:text-[var(--kc-accent-on-surface)]"
              onClick={handleReset}
              type="button"
            >
              Reset
            </button>
          </div>

          <div className="mt-5 rounded-[28px] border border-[rgba(107,94,72,0.14)] bg-[linear-gradient(180deg,rgba(241,248,235,0.9)_0%,rgba(255,250,240,0.9)_100%)] p-4 shadow-[0_16px_40px_rgba(58,45,30,0.05)]">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--kc-on-surface-muted)]">
                  Village mastery
                </p>
                <p className="mt-2 text-3xl text-[var(--kc-accent-on-surface)]">
                  {villageMastery}%
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--kc-on-surface-muted)]">
                  Lessons
                </p>
                <p className="mt-2 text-3xl text-[var(--kc-on-surface)]">
                  {galleryLessons.length}
                </p>
              </div>
            </div>

            <div className="mt-4 h-2 overflow-hidden rounded-full bg-[rgba(107,94,72,0.12)]">
              <div
                className="h-full rounded-full bg-[linear-gradient(90deg,#7ca267_0%,#4a8c3a_100%)]"
                style={{ width: `${villageMastery}%` }}
              />
            </div>
          </div>

          <div className="mt-5 space-y-5 xl:max-h-[calc(100vh-240px)] xl:overflow-y-auto xl:pr-1">
            {groupedLessons.map(([section, lessons]) => (
              <section key={section} className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs uppercase tracking-[0.22em] text-[var(--kc-on-surface-muted)]">
                    {section}
                  </p>
                  <span className="text-xs text-[var(--kc-on-surface-muted)]">
                    {lessons.length}
                  </span>
                </div>

                <div className="space-y-2">
                  {lessons.map((lesson) => {
                    const index = lesson.order - 1
                    const isActive = index === activeLessonIndex
                    const isComplete = index < activeLessonIndex

                    return (
                      <button
                        key={lesson.id}
                        className="w-full rounded-[22px] border p-4 text-left transition"
                        onClick={() => handleSelectLesson(index)}
                        style={{
                          borderColor: isActive
                            ? 'rgba(74,140,58,0.32)'
                            : 'rgba(107,94,72,0.12)',
                          background: isActive
                            ? 'linear-gradient(180deg,rgba(238,245,229,0.98)_0%,rgba(255,250,240,0.98)_100%)'
                            : 'rgba(255,250,240,0.72)',
                          boxShadow: isActive
                            ? '0 16px 32px rgba(74,140,58,0.12)'
                            : '0 10px 24px rgba(58,45,30,0.03)',
                        }}
                        type="button"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-[0.68rem] uppercase tracking-[0.18em] text-[var(--kc-on-surface-muted)]">
                              Lesson {lesson.order}
                            </p>
                            <h3 className="mt-1 text-base text-[var(--kc-on-surface)]">
                              {lesson.label}
                            </h3>
                          </div>
                          <span
                            className="rounded-full px-2.5 py-1 text-[0.62rem] uppercase tracking-[0.16em]"
                            style={{
                              background: isActive
                                ? 'rgba(223,234,213,0.9)'
                                : isComplete
                                  ? 'rgba(74,140,58,0.12)'
                                  : 'rgba(107,94,72,0.08)',
                              color:
                                isActive || isComplete
                                  ? 'var(--kc-accent-on-surface)'
                                  : 'var(--kc-on-surface-muted)',
                            }}
                          >
                            {isActive ? 'Current' : isComplete ? 'Done' : 'Queued'}
                          </span>
                        </div>

                        <p className="mt-2 text-sm leading-6 text-[var(--kc-on-surface-muted)]">
                          {lesson.goal}
                        </p>
                      </button>
                    )
                  })}
                </div>
              </section>
            ))}
          </div>
        </aside>

        <main className="flex min-h-screen flex-col">
          <header className="border-b border-[rgba(107,94,72,0.12)] bg-[rgba(255,250,240,0.68)] px-5 py-5 backdrop-blur-sm lg:px-7">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="space-y-2">
                <p className="text-xs uppercase tracking-[0.22em] text-[var(--kc-on-surface-muted)]">
                  {definition.name} / Lesson {activeLesson.order}
                </p>
                <h2 className="text-[clamp(2rem,3vw,3rem)] leading-none text-[var(--kc-on-surface)]">
                  {activeLesson.label}
                </h2>
                <p className="max-w-2xl text-sm leading-7 text-[var(--kc-on-surface-muted)]">
                  {activeLesson.goal}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {activeLesson.keyFocus.map((key) => (
                  <span
                    key={key}
                    className="rounded-full border border-[rgba(74,140,58,0.22)] bg-[rgba(238,245,229,0.86)] px-3 py-1.5 text-xs uppercase tracking-[0.18em] text-[var(--kc-accent-on-surface)]"
                  >
                    {key.toUpperCase()}
                  </span>
                ))}
              </div>
            </div>
          </header>

          <div className="flex-1 p-5 lg:p-7">
            <div className="grid h-full gap-6 xl:grid-cols-[minmax(0,1fr)_300px]">
              <div className="relative min-h-[620px] overflow-hidden rounded-[40px] border border-[rgba(107,94,72,0.12)] bg-[rgba(255,250,240,0.48)] p-4 shadow-[0_24px_60px_rgba(58,45,30,0.05)] md:p-6">
                {!reward && activeLesson && (
                  <TypingSurface
                    key={`${villageId}-${activeLessonIndex}-${sessionKey}`}
                    keyFocus={
                      activeLesson.keyFocus.length > 0
                        ? activeLesson.keyFocus
                        : definition.keyFocus
                    }
                    onComplete={handleSessionComplete}
                    prompt={activeLesson}
                  />
                )}

                {reward && (
                  <div className="relative h-full overflow-hidden rounded-[32px]">
                    <SessionReward
                      definition={definition}
                      masteryGained={reward.masteryGained}
                      metrics={reward.metrics}
                      newMastery={reward.newMastery}
                      onNextLesson={handleNextLesson}
                      prevMastery={reward.prevMastery}
                    />
                  </div>
                )}
              </div>

              <aside className="space-y-4 rounded-[36px] border border-[rgba(107,94,72,0.12)] bg-[rgba(255,250,240,0.72)] p-5 shadow-[0_24px_60px_rgba(58,45,30,0.05)]">
                <div className="space-y-2">
                  <p className="text-xs uppercase tracking-[0.22em] text-[var(--kc-on-surface-muted)]">
                    Lesson detail
                  </p>
                  <h3 className="text-2xl text-[var(--kc-on-surface)]">
                    {activeLesson.focus}
                  </h3>
                  <p className="text-sm leading-6 text-[var(--kc-on-surface-muted)]">
                    This panel stays visible so the lesson feels like part of a
                    longer crafted curriculum, not a one-off typing box.
                  </p>
                </div>

                <div className="rounded-[24px] border border-[rgba(107,94,72,0.12)] bg-[rgba(255,250,240,0.86)] p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-[var(--kc-on-surface-muted)]">
                    Current objective
                  </p>
                  <p className="mt-2 text-sm leading-6 text-[var(--kc-on-surface)]">
                    {activeLesson.goal}
                  </p>
                </div>

                <div className="rounded-[24px] border border-[rgba(107,94,72,0.12)] bg-[linear-gradient(180deg,rgba(241,248,235,0.88)_0%,rgba(255,250,240,0.92)_100%)] p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-[var(--kc-on-surface-muted)]">
                    Path progress
                  </p>
                  <p className="mt-2 text-3xl text-[var(--kc-accent-on-surface)]">
                    {activeLesson.order}
                    <span className="ml-2 text-base text-[var(--kc-on-surface-muted)]">
                      / {galleryLessons.length}
                    </span>
                  </p>
                  <p className="mt-2 text-sm leading-6 text-[var(--kc-on-surface-muted)]">
                    The village now supports a long-form lesson atlas, so the
                    route can scale into dozens of lessons instead of a tiny
                    handful of screens.
                  </p>
                </div>
              </aside>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
