'use client'

import { useMemo, useState } from 'react'

import { SessionSummary } from '@/components/typing/session-summary'
import { TypingSurface } from '@/components/typing/typing-surface'
import type { ChapterContent } from '@/lib/content/chapter-schema'
import { calculateSessionMetrics } from '@/lib/typing/session-metrics'
import type { TypingSessionState } from '@/lib/typing/text-runner'

type ChapterSessionProps = {
  chapter: ChapterContent
  onPracticeComplete: (session: TypingSessionState) => void
  onChapterComplete: (chapterId: string) => void
}

export function ChapterSession({
  chapter,
  onPracticeComplete,
  onChapterComplete,
}: ChapterSessionProps) {
  const prompts = useMemo(
    () => [...chapter.lessons, chapter.capstone],
    [chapter.capstone, chapter.lessons],
  )
  const [promptIndex, setPromptIndex] = useState(0)
  const [completedSession, setCompletedSession] =
    useState<TypingSessionState | null>(null)

  const prompt = prompts[promptIndex]
  const isCapstone = promptIndex === prompts.length - 1
  const metrics =
    completedSession === null
      ? null
      : calculateSessionMetrics(completedSession)

  function handleComplete(session: TypingSessionState) {
    onPracticeComplete(session)
    if (isCapstone) {
      onChapterComplete(chapter.id)
    }
    setCompletedSession(session)
  }

  function handleAdvance() {
    if (isCapstone) {
      setCompletedSession(null)
      return
    }

    setPromptIndex((current) => current + 1)
    setCompletedSession(null)
  }

  return (
    <section
      className="overflow-hidden rounded-[var(--kc-radius-card)] border"
      style={{
        borderColor: 'var(--kc-line-light)',
        background: 'var(--kc-surface)',
        boxShadow: '0 18px 50px rgba(28,46,30,0.08)',
      }}
    >
      <div
        className="border-b px-6 py-5"
        style={{ borderColor: 'var(--kc-line-light)', background: 'rgba(255,250,240,0.9)' }}
      >
        <p
          className="text-[10px] uppercase tracking-[0.2em]"
          style={{ color: 'var(--kc-on-surface-muted)' }}
        >
          {chapter.title}
        </p>
        <div className="mt-2 flex items-end justify-between gap-4">
          <div>
            <h1
              className="text-2xl font-semibold"
              style={{ color: 'var(--kc-on-surface)' }}
            >
              {prompt.label}
            </h1>
            <p className="mt-1 text-sm leading-6" style={{ color: 'var(--kc-on-surface-muted)' }}>
              {prompt.goal}
            </p>
          </div>
          <div className="text-right">
            <p
              className="text-[10px] uppercase tracking-[0.18em]"
              style={{ color: 'var(--kc-on-surface-muted)' }}
            >
              Lesson {promptIndex + 1} of {prompts.length}
            </p>
            <p className="mt-1 text-sm font-medium" style={{ color: 'var(--kc-accent-on-surface)' }}>
              {isCapstone ? 'Capstone check' : prompt.focus}
            </p>
          </div>
        </div>
      </div>

      <div className="p-6">
        {metrics === null ? (
          <TypingSurface key={prompt.id} onComplete={handleComplete} prompt={prompt} />
        ) : (
          <div className="space-y-4">
            {isCapstone && (
              <div
                className="rounded-[var(--kc-radius-inner)] border px-5 py-4"
                style={{
                  borderColor: 'rgba(58,114,48,0.18)',
                  background: 'rgba(58,114,48,0.08)',
                }}
              >
                <p className="text-sm font-semibold" style={{ color: 'var(--kc-accent-on-surface)' }}>
                  Chapter complete
                </p>
                <p className="mt-1 text-sm leading-6" style={{ color: 'var(--kc-on-surface-muted)' }}>
                  This route is now part of your guided path, and the next chapter can unlock from the village.
                </p>
              </div>
            )}

            <SessionSummary
              metrics={metrics}
              onTryAnother={handleAdvance}
              prompt={prompt}
              primaryActionLabel={isCapstone ? 'Replay capstone' : 'Continue chapter'}
              secondaryHref="/home"
              secondaryLabel={isCapstone ? 'Return to your village →' : 'Pause and head back →'}
            />
          </div>
        )}
      </div>
    </section>
  )
}
