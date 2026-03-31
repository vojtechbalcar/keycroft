'use client'

import { useState } from 'react'

import { SessionSummary } from '@/components/typing/session-summary'
import { TypingSurface } from '@/components/typing/typing-surface'
import { practiceTexts } from '@/lib/typing/practice-texts'
import { calculateSessionMetrics } from '@/lib/typing/session-metrics'
import type { TypingSessionState } from '@/lib/typing/text-runner'

export default function PlayPage() {
  const [promptIndex, setPromptIndex] = useState(0)
  const [completedSession, setCompletedSession] =
    useState<TypingSessionState | null>(null)

  const prompt = practiceTexts[promptIndex]
  const metrics =
    completedSession === null
      ? null
      : calculateSessionMetrics(completedSession)

  function handleTryAnother() {
    setPromptIndex((current) => (current + 1) % practiceTexts.length)
    setCompletedSession(null)
  }

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6">
      <div className="space-y-2">
        <p className="text-sm uppercase tracking-[0.18em] text-[var(--kc-muted)]">
          Writing desk
        </p>
        <h1 className="text-4xl tracking-tight text-[var(--kc-text)]">
          Practice a single line with full attention.
        </h1>
        <p className="max-w-2xl text-base leading-7 text-[var(--kc-muted)]">
          This Stage 2 route proves the typing loop itself: input, correction,
          completion, and useful feedback.
        </p>
      </div>

      {metrics === null ? (
        <TypingSurface
          key={prompt.id}
          onComplete={setCompletedSession}
          prompt={prompt}
        />
      ) : (
        <SessionSummary
          metrics={metrics}
          onTryAnother={handleTryAnother}
          prompt={prompt}
        />
      )}
    </div>
  )
}
