'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'

import { AppShell } from '@/components/layout/app-shell'
import { ChapterList } from '@/components/progress/chapter-list'
import { SideQuestCard } from '@/components/progress/side-quest-card'
import { ProgressTree } from '@/components/world/progress-tree'
import { VillageOverview } from '@/components/world/village-overview'
import { listChapters } from '@/lib/content/list-chapters'
import { recommendNextStep } from '@/lib/progression/recommend-next-step'
import { recommendSideQuest } from '@/lib/progression/recommend-side-quest'
import { ensureGuestProfile } from '@/lib/storage/guest-profile'
import { readGuestProgress, type GuestProgress } from '@/lib/storage/guest-progress'
import { projectVillage } from '@/lib/world/project-village'

export default function HubHomePage() {
  const router = useRouter()
  const [progress, setProgress] = useState<GuestProgress | null>(null)

  useEffect(() => {
    const storage = window.localStorage
    ensureGuestProfile(storage)
    const stored = readGuestProgress(storage)
    if (stored.placement === null) {
      router.replace('/onboarding')
      return
    }
    setProgress(stored)
  }, [router])

  const chapters = useMemo(() => listChapters(), [])

  if (!progress) {
    return (
      <AppShell>
        <div className="flex h-screen items-center justify-center">
          <p style={{ color: 'var(--kc-muted)' }}>Loading your village...</p>
        </div>
      </AppShell>
    )
  }

  const villageState = projectVillage(progress)
  const nextStep = recommendNextStep({
    currentPhaseId: progress.currentPhaseId,
    completedChapterIds: progress.completedChapterIds,
  })
  const sideQuest = recommendSideQuest({
    currentPhaseId: progress.currentPhaseId,
    recentSessions: progress.recentSessions,
  })
  const recommendedChapterId =
    nextStep.kind === 'chapter' ? nextStep.chapterId : null

  return (
    <AppShell>
      <div className="flex flex-col">
        <header
          className="border-b px-6 py-6"
          style={{
            background: 'rgba(255,250,240,0.96)',
            borderBottomColor: 'var(--kc-line-light)',
          }}
        >
          <p
            className="text-[10px] uppercase tracking-[0.2em]"
            style={{ color: 'var(--kc-on-surface-muted)' }}
          >
            The Digital Homestead
          </p>
          <div className="mt-3 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <h1 className="text-3xl font-semibold" style={{ color: 'var(--kc-on-surface)' }}>
                One clear route keeps the village moving.
              </h1>
              <p className="mt-2 text-sm leading-6" style={{ color: 'var(--kc-on-surface-muted)' }}>
                Follow the guided chapter path for structured progress, then take an adaptive side quest
                when your recent sessions suggest a weak spot worth cleaning up.
              </p>
            </div>

            <div
              className="rounded-[var(--kc-radius-inner)] border px-4 py-4 lg:max-w-sm"
              style={{ borderColor: 'var(--kc-line-light)', background: 'var(--kc-surface)' }}
            >
              <p
                className="text-[10px] uppercase tracking-[0.18em]"
                style={{ color: 'var(--kc-on-surface-muted)' }}
              >
                Next step
              </p>
              <p className="mt-2 text-lg font-semibold" style={{ color: 'var(--kc-on-surface)' }}>
                {nextStep.label}
              </p>
              <p className="mt-2 text-sm leading-6" style={{ color: 'var(--kc-on-surface-muted)' }}>
                {nextStep.reason}
              </p>
              <Link
                href={recommendedChapterId ? `/chapters/${recommendedChapterId}` : '/play'}
                className="mt-4 inline-flex rounded-full px-4 py-2 text-sm font-medium text-white"
                style={{ background: 'var(--kc-accent)' }}
              >
                {recommendedChapterId ? 'Open chapter' : 'Start free practice'}
              </Link>
            </div>
          </div>
        </header>

        <VillageOverview state={villageState} sessionCount={progress.recentSessions.length} />

        <div className="grid gap-6 px-6 py-6" style={{ background: '#f4efe4' }}>
          <ProgressTree currentPhaseId={progress.currentPhaseId} regions={villageState.regions} />

          <div className="grid gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,0.9fr)]">
            <ChapterList
              chapters={chapters}
              completedChapterIds={progress.completedChapterIds}
              currentPhaseId={progress.currentPhaseId}
              recommendedChapterId={recommendedChapterId}
            />
            <SideQuestCard recommendation={sideQuest} />
          </div>

          <section
            className="rounded-[var(--kc-radius-card)] border p-5"
            style={{ borderColor: 'var(--kc-line-light)', background: 'var(--kc-surface)' }}
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <p
                  className="text-[10px] uppercase tracking-[0.2em]"
                  style={{ color: 'var(--kc-on-surface-muted)' }}
                >
                  Recent History
                </p>
                <h2 className="mt-1 text-xl font-semibold" style={{ color: 'var(--kc-on-surface)' }}>
                  Your latest practice lines
                </h2>
              </div>
              <Link href="/play" className="text-sm underline-offset-4 hover:underline">
                Free practice →
              </Link>
            </div>

            {progress.recentSessions.length === 0 ? (
              <p className="mt-4 text-sm leading-6" style={{ color: 'var(--kc-on-surface-muted)' }}>
                No sessions yet. Finish a chapter line or a free practice line to start shaping the village.
              </p>
            ) : (
              <ul className="mt-4 grid gap-3 md:grid-cols-3">
                {progress.recentSessions.slice(0, 3).map((session) => (
                  <li
                    key={session.completedAt}
                    className="rounded-[var(--kc-radius-inner)] border px-4 py-4"
                    style={{ borderColor: 'var(--kc-line-light)', background: 'rgba(255,255,255,0.55)' }}
                  >
                    <p className="text-lg font-semibold" style={{ color: 'var(--kc-on-surface)' }}>
                      {session.wpm} WPM
                    </p>
                    <p className="mt-1 text-sm" style={{ color: 'var(--kc-on-surface-muted)' }}>
                      {session.accuracy}% accuracy
                    </p>
                    <p className="mt-1 text-sm" style={{ color: 'var(--kc-on-surface-muted)' }}>
                      {session.correctedErrors} corrected error{session.correctedErrors !== 1 ? 's' : ''}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </AppShell>
  )
}
