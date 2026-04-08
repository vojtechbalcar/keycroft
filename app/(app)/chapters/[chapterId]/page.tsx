'use client'

import { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'

import { ChapterSession } from '@/components/typing/chapter-session'
import { loadChapter } from '@/lib/content/load-chapter'
import { isChapterUnlocked } from '@/lib/progression/chapter-progress'
import {
  readGuestProgress,
  recordCompletedChapter,
  recordPracticeSession,
  saveGuestProgress,
} from '@/lib/storage/guest-progress'
import { syncProgressAfterLocalWrite } from '@/lib/storage/progress-sync'
import { useResolvedProgress } from '@/lib/storage/use-resolved-progress'
import { calculateSessionMetrics } from '@/lib/typing/session-metrics'
import type { TypingSessionState } from '@/lib/typing/text-runner'

export default function ChapterPage() {
  const params = useParams<{ chapterId: string }>()
  const router = useRouter()
  const { progress, setProgress, signedIn } = useResolvedProgress()

  const chapterId = params.chapterId
  const chapter = loadChapter(chapterId)

  useEffect(() => {
    if (progress === null) {
      return
    }

    if (progress.placement === null) {
      router.replace('/onboarding')
      return
    }

    if (!isChapterUnlocked(progress.currentPhaseId, chapter.phaseId)) {
      router.replace('/home')
      return
    }
  }, [chapter.phaseId, progress, router])

  function persistSession(session: TypingSessionState) {
    const storage = window.localStorage
    const currentProgress = readGuestProgress(storage)
    const metrics = calculateSessionMetrics(session)
    const nextProgress = recordPracticeSession(currentProgress, {
      completedAt: new Date().toISOString(),
      wpm: metrics.wpm,
      accuracy: metrics.accuracy,
      correctedErrors: metrics.correctedErrors,
    })
    saveGuestProgress(storage, nextProgress)
    setProgress(nextProgress)
    void syncProgressAfterLocalWrite(storage, signedIn)
  }

  function handleChapterComplete(completedChapterId: string) {
    const storage = window.localStorage
    const currentProgress = readGuestProgress(storage)
    const nextProgress = recordCompletedChapter(currentProgress, completedChapterId)
    saveGuestProgress(storage, nextProgress)
    setProgress(nextProgress)
    void syncProgressAfterLocalWrite(storage, signedIn)
  }

  if (!progress) {
    return (
      <section className="rounded-[32px] border border-[var(--kc-line-light)] bg-[var(--kc-surface)] p-8 text-[var(--kc-on-surface)] shadow-[0_18px_50px_rgba(58,45,30,0.10)]">
        Preparing your chapter path...
      </section>
    )
  }

  return (
    <ChapterSession
      chapter={chapter}
      onChapterComplete={handleChapterComplete}
      onPracticeComplete={persistSession}
    />
  )
}
