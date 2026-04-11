import { describe, it, expect } from 'vitest'
import { projectWorld } from '@/lib/world/project-world'
import { createEmptyGuestProgress } from '@/lib/storage/guest-progress'
import type { GuestProgress } from '@/lib/storage/guest-progress'

function makeProgress(overrides: Partial<GuestProgress> = {}): GuestProgress {
  return {
    ...createEmptyGuestProgress(),
    placement: { phaseId: 'lantern' as const, phaseName: 'Lantern Room', summary: '', recommendedFocus: '', reason: '', selfRating: null, metrics: { wpm: 20, accuracy: 90, correctedErrors: 0 } },
    ...overrides,
  }
}

describe('projectWorld', () => {
  it('meadow-farm is always active even with no progress', () => {
    const state = projectWorld(makeProgress())
    const meadow = state.villages.find((v) => v.definition.id === 'meadow-farm')!
    expect(meadow.state).toBe('active')
  })

  it('fishing-docks is locked until meadow-farm reaches 80 mastery', () => {
    const state = projectWorld(makeProgress({ villageMastery: { 'meadow-farm': 50 } }))
    const docks = state.villages.find((v) => v.definition.id === 'fishing-docks')!
    expect(docks.state).toBe('locked')
  })

  it('fishing-docks is active when meadow-farm mastery >= 80', () => {
    const state = projectWorld(makeProgress({ villageMastery: { 'meadow-farm': 80 } }))
    const docks = state.villages.find((v) => v.definition.id === 'fishing-docks')!
    expect(docks.state).toBe('active')
  })

  it('a village at mastery 80 is flourishing', () => {
    const state = projectWorld(makeProgress({ villageMastery: { 'meadow-farm': 80 } }))
    const meadow = state.villages.find((v) => v.definition.id === 'meadow-farm')!
    expect(meadow.state).toBe('flourishing')
  })

  it('a village at mastery 100 is complete', () => {
    const state = projectWorld(makeProgress({ villageMastery: { 'meadow-farm': 100 } }))
    const meadow = state.villages.find((v) => v.definition.id === 'meadow-farm')!
    expect(meadow.state).toBe('complete')
  })

  it('currentVillageId is the first non-complete active village', () => {
    const state = projectWorld(makeProgress({ villageMastery: { 'meadow-farm': 100, 'fishing-docks': 20 } }))
    expect(state.currentVillageId).toBe('fishing-docks')
  })

  it('totalMastery is the average across all 6 villages', () => {
    const state = projectWorld(makeProgress({ villageMastery: { 'meadow-farm': 60 } }))
    expect(state.totalMastery).toBe(10) // 60 / 6 = 10
  })

  it('returns all 6 villages in order', () => {
    const state = projectWorld(makeProgress())
    expect(state.villages).toHaveLength(6)
    expect(state.villages[0].definition.id).toBe('meadow-farm')
    expect(state.villages[5].definition.id).toBe('volcano-forge')
  })
})
