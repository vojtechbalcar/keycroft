'use client'

import { useState } from 'react'

import { OpeningScene } from '@/components/onboarding/opening-scene'
import { PhaseResult } from '@/components/onboarding/phase-result'
import { PrimaryButton } from '@/components/shared/primary-button'
import { SessionSummary } from '@/components/typing/session-summary'
import { TypingSurface } from '@/components/typing/typing-surface'
import {
  assessPlacement,
  type PlacementResult,
  type PlacementSelfRating,
} from '@/lib/placement/assess'
import { calculateSessionMetrics } from '@/lib/typing/session-metrics'
import type { TypingSessionState } from '@/lib/typing/text-runner'

type PlacementFlowProps = {
  onPlacementComplete: (result: PlacementResult) => void
}

const placementPrompt = {
  id: 'arrival-placement',
  label: 'Arrival line',
  focus: 'steady first rhythm',
  text: 'steady hands shape patient rhythm',
}

type Step = 'opening' | 'typing' | 'rating' | 'result'

export function PlacementFlow({ onPlacementComplete }: PlacementFlowProps) {
  const [step, setStep] = useState<Step>('opening')
  const [completedSession, setCompletedSession] = useState<TypingSessionState | null>(null)
  const [selfRating, setSelfRating] = useState<PlacementSelfRating | null>(null)
  const [result, setResult] = useState<PlacementResult | null>(null)

  function handlePlacementSessionComplete(session: TypingSessionState) {
    setCompletedSession(session)
    setStep('rating')
  }

  function handleRevealPhase() {
    if (!completedSession) return
    const placement = assessPlacement({
      metrics: calculateSessionMetrics(completedSession),
      selfRating,
    })
    setResult(placement)
    onPlacementComplete(placement)
    setStep('result')
  }

  if (step === 'opening') {
    return <OpeningScene onBegin={() => setStep('typing')} />
  }

  if (step === 'typing') {
    return (
      <TypingSurface
        onComplete={handlePlacementSessionComplete}
        prompt={placementPrompt}
      />
    )
  }

  if (step === 'rating' && completedSession) {
    const metrics = calculateSessionMetrics(completedSession)
    return (
      <section className="space-y-6">
        <SessionSummary
          metrics={metrics}
          onTryAnother={() => { setCompletedSession(null); setStep('typing') }}
          prompt={placementPrompt}
        />
        <section className="rounded-[32px] border border-[var(--kc-line-light)] bg-[var(--kc-surface)] p-6 shadow-[0_18px_50px_rgba(58,45,30,0.10)]">
          <fieldset className="space-y-4">
            <legend className="text-lg text-[var(--kc-text-dark)]">
              Which description feels closest right now?
            </legend>
            {([
              { value: 'finding-keys' as const, label: 'I am still finding the keys and want a gentler start.' },
              { value: 'steady-practice' as const, label: 'I already have some steady practice but want structure.' },
              { value: 'already-fast' as const, label: 'I type quickly already and want refinement, not basics.' },
            ]).map(({ value, label }) => (
              <label key={value} className="flex items-start gap-3 rounded-[20px] border border-[var(--kc-line-light)] p-4 text-[var(--kc-text-dark)] cursor-pointer">
                <input
                  checked={selfRating === value}
                  name="self-rating"
                  onChange={() => setSelfRating(value)}
                  type="radio"
                />
                <span>{label}</span>
              </label>
            ))}
          </fieldset>
          <PrimaryButton className="mt-6" onClick={handleRevealPhase}>
            See my starting phase
          </PrimaryButton>
        </section>
      </section>
    )
  }

  if (!result) return null
  return <PhaseResult result={result} />
}
