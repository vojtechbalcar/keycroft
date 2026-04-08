import { describe, expect, it } from 'vitest'

import { assessPlacement } from '@/lib/placement/assess'
import {
  createPlacementCompletedEvent,
  createPracticeSessionCompletedEvent,
} from '@/lib/progression/progress-events'
import { evaluateCurrentPhase } from '@/lib/progression/phase-evaluator'

const placement = assessPlacement({
  metrics: {
    elapsedMs: 22000,
    correctCharacters: 32,
    characterInputCount: 33,
    correctedErrors: 1,
    accuracy: 97,
    wpm: 18,
    cleanRun: false,
  },
  selfRating: 'finding-keys',
})

describe('evaluateCurrentPhase', () => {
  it('defaults to Lantern Room before any progress exists', () => {
    expect(evaluateCurrentPhase([])).toBe('lantern')
  })

  it('uses the most recent placement as the current phase baseline', () => {
    const events = [
      createPlacementCompletedEvent(placement, '2026-04-01T08:00:00.000Z'),
    ]
    expect(evaluateCurrentPhase(events)).toBe('lantern')
  })

  it('promotes Lantern Room guests into Workshop Lane after three strong sessions', () => {
    const events = [
      createPlacementCompletedEvent(placement, '2026-04-01T08:00:00.000Z'),
      createPracticeSessionCompletedEvent(
        { completedAt: '2026-04-02T08:00:00.000Z', wpm: 28, accuracy: 95.4, correctedErrors: 1 },
        'lantern',
      ),
      createPracticeSessionCompletedEvent(
        { completedAt: '2026-04-03T08:00:00.000Z', wpm: 30, accuracy: 96.1, correctedErrors: 0 },
        'lantern',
      ),
      createPracticeSessionCompletedEvent(
        { completedAt: '2026-04-04T08:00:00.000Z', wpm: 31, accuracy: 95.8, correctedErrors: 0 },
        'lantern',
      ),
    ]
    expect(evaluateCurrentPhase(events)).toBe('workshop')
  })

  it('does not skip directly from Lantern Room to Lookout Point on one fast run', () => {
    const events = [
      createPlacementCompletedEvent(placement, '2026-04-01T08:00:00.000Z'),
      createPracticeSessionCompletedEvent(
        { completedAt: '2026-04-02T08:00:00.000Z', wpm: 55, accuracy: 98.4, correctedErrors: 0 },
        'lantern',
      ),
    ]
    expect(evaluateCurrentPhase(events)).toBe('lantern')
  })
})
