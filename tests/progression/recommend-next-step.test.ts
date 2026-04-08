import { describe, expect, it } from 'vitest'

import { recommendNextStep } from '@/lib/progression/recommend-next-step'

describe('recommendNextStep', () => {
  it('starts new lantern-phase guests on the arrival chapter', () => {
    const recommendation = recommendNextStep({
      currentPhaseId: 'lantern',
      completedChapterIds: [],
    })

    expect(recommendation.chapterId).toBe('ch01-arrival')
    expect(recommendation.kind).toBe('chapter')
  })

  it('moves to the next incomplete chapter that is unlocked for the current phase', () => {
    const recommendation = recommendNextStep({
      currentPhaseId: 'workshop',
      completedChapterIds: ['ch01-arrival', 'ch02-home-row'],
    })

    expect(recommendation.chapterId).toBe('ch03-reach-control')
    expect(recommendation.kind).toBe('chapter')
  })

  it('falls back to free practice when all unlocked chapters are complete', () => {
    const recommendation = recommendNextStep({
      currentPhaseId: 'lookout',
      completedChapterIds: ['ch01-arrival', 'ch02-home-row', 'ch03-reach-control'],
    })

    expect(recommendation.kind).toBe('practice')
    expect(recommendation.chapterId).toBe(null)
  })
})
