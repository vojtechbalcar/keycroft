import { describe, expect, it } from 'vitest'

import {
  assessPlacement,
  type PlacementSelfRating,
} from '@/lib/placement/assess'
import type { SessionMetrics } from '@/lib/typing/session-metrics'

function createMetrics(overrides: Partial<SessionMetrics>): SessionMetrics {
  return {
    elapsedMs: 20000,
    correctCharacters: 32,
    characterInputCount: 32,
    correctedErrors: 0,
    accuracy: 100,
    wpm: 19.2,
    cleanRun: true,
    ...overrides,
  }
}

describe('assessPlacement', () => {
  it('places slower but clean typists into Lantern Room', () => {
    const result = assessPlacement({
      metrics: createMetrics({ accuracy: 96.4, wpm: 18.8 }),
      selfRating: null,
    })
    expect(result.phaseId).toBe('lantern')
    expect(result.phaseName).toBe('Lantern Room')
  })

  it('places steady mid-range typists into Workshop Lane', () => {
    const result = assessPlacement({
      metrics: createMetrics({ accuracy: 95.1, wpm: 31.6 }),
      selfRating: 'steady-practice',
    })
    expect(result.phaseId).toBe('workshop')
    expect(result.phaseName).toBe('Workshop Lane')
  })

  it('places advanced typists into Lookout Point', () => {
    const result = assessPlacement({
      metrics: createMetrics({ accuracy: 98.2, wpm: 55.4 }),
      selfRating: 'already-fast',
    })
    expect(result.phaseId).toBe('lookout')
    expect(result.phaseName).toBe('Lookout Point')
  })

  it('uses self-rating only as a gentle tiebreaker near a threshold', () => {
    const metrics = createMetrics({ accuracy: 95, wpm: 39.5 })
    const withoutSelfRating = assessPlacement({ metrics, selfRating: null })
    const withFastSelfRating = assessPlacement({
      metrics,
      selfRating: 'already-fast' satisfies PlacementSelfRating,
    })
    expect(withoutSelfRating.phaseId).toBe('workshop')
    expect(withFastSelfRating.phaseId).toBe('lookout')
  })
})
