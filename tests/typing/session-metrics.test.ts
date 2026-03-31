import { describe, expect, it } from 'vitest'

import { calculateSessionMetrics } from '@/lib/typing/session-metrics'
import type { TypingSessionState } from '@/lib/typing/text-runner'

function createCompletedSession(
  overrides: Partial<TypingSessionState> = {},
): TypingSessionState {
  return {
    targetText: 'calm',
    inputValue: 'calm',
    startedAt: 1000,
    completedAt: 5000,
    characterInputCount: 4,
    correctedErrors: 0,
    isComplete: true,
    ...overrides,
  }
}

describe('session-metrics', () => {
  it('calculates elapsed time, accuracy, and wpm for a clean run', () => {
    const metrics = calculateSessionMetrics(createCompletedSession())

    expect(metrics.elapsedMs).toBe(4000)
    expect(metrics.correctCharacters).toBe(4)
    expect(metrics.accuracy).toBe(100)
    expect(metrics.wpm).toBe(12)
    expect(metrics.cleanRun).toBe(true)
  })

  it('reduces accuracy when extra character inputs were needed', () => {
    const metrics = calculateSessionMetrics(
      createCompletedSession({
        characterInputCount: 6,
        correctedErrors: 2,
      }),
    )

    expect(metrics.accuracy).toBe(66.7)
    expect(metrics.correctedErrors).toBe(2)
    expect(metrics.cleanRun).toBe(false)
  })

  it('throws when the session is incomplete', () => {
    expect(() =>
      calculateSessionMetrics(
        createCompletedSession({
          completedAt: null,
          isComplete: false,
        }),
      ),
    ).toThrow('Session must be complete before calculating metrics.')
  })
})
