import { describe, it, expect } from 'vitest'
import { projectVillage } from '@/lib/world/project-village'
import type { GuestProgress } from '@/lib/storage/guest-progress'
import type { ProgressEvent } from '@/lib/progression/progress-events'

function makeProgress(overrides: Partial<GuestProgress> = {}): GuestProgress {
  return {
    currentPhaseId: null,
    placement: null,
    events: [],
    recentSessions: [],
    ...overrides,
  }
}

function makePlacement(wpm: number = 30, accuracy: number = 80) {
  return { wpm, accuracy, phaseId: 'lantern' as const }
}

function makePracticeEvent(accuracy: number, phaseId: 'lantern' | 'workshop' | 'lookout'): ProgressEvent {
  return {
    type: 'practice-session-completed',
    phaseId,
    session: {
      wpm: 40,
      accuracy,
      correctedErrors: 0,
      completedAt: new Date().toISOString(),
    },
    createdAt: new Date().toISOString(),
  }
}

describe('projectVillage', () => {
  it('null placement: lantern-quarter active, others locked, canProgress false', () => {
    const progress = makeProgress({ placement: null, currentPhaseId: null })
    const state = projectVillage(progress)

    const lantern = state.regions.find((r) => r.definition.id === 'lantern-quarter')!
    const market = state.regions.find((r) => r.definition.id === 'market-row')!
    const tower = state.regions.find((r) => r.definition.id === 'tower-district')!

    expect(lantern.state).toBe('active')
    expect(market.state).toBe('locked')
    expect(tower.state).toBe('locked')
    expect(state.canProgress).toBe(false)
  })

  it('lantern phase, no sessions: lantern-quarter active, others locked, canProgress true', () => {
    const progress = makeProgress({
      placement: makePlacement(),
      currentPhaseId: 'lantern',
      events: [],
      recentSessions: [],
    })
    const state = projectVillage(progress)

    const lantern = state.regions.find((r) => r.definition.id === 'lantern-quarter')!
    const market = state.regions.find((r) => r.definition.id === 'market-row')!
    const tower = state.regions.find((r) => r.definition.id === 'tower-district')!

    expect(lantern.state).toBe('active')
    expect(market.state).toBe('locked')
    expect(tower.state).toBe('locked')
    expect(state.canProgress).toBe(true)
  })

  it('workshop phase: lantern-quarter active, market-row active, tower-district locked', () => {
    const progress = makeProgress({
      placement: makePlacement(),
      currentPhaseId: 'workshop',
      events: [],
      recentSessions: [],
    })
    const state = projectVillage(progress)

    const lantern = state.regions.find((r) => r.definition.id === 'lantern-quarter')!
    const market = state.regions.find((r) => r.definition.id === 'market-row')!
    const tower = state.regions.find((r) => r.definition.id === 'tower-district')!

    expect(lantern.state).not.toBe('locked')
    expect(market.state).toBe('active')
    expect(tower.state).toBe('locked')
  })

  it('lookout phase: all regions unlocked (not locked)', () => {
    const progress = makeProgress({
      placement: makePlacement(),
      currentPhaseId: 'lookout',
      events: [],
      recentSessions: [],
    })
    const state = projectVillage(progress)

    for (const region of state.regions) {
      expect(region.state).not.toBe('locked')
    }
  })

  it('3+ lantern sessions with high accuracy: lantern-quarter becomes flourishing', () => {
    const events: ProgressEvent[] = [
      makePracticeEvent(95, 'lantern'),
      makePracticeEvent(92, 'lantern'),
      makePracticeEvent(91, 'lantern'),
    ]
    const progress = makeProgress({
      placement: makePlacement(),
      currentPhaseId: 'lantern',
      events,
      recentSessions: [],
    })
    const state = projectVillage(progress)

    const lantern = state.regions.find((r) => r.definition.id === 'lantern-quarter')!
    expect(lantern.state).toBe('flourishing')
  })

  it('activeRegionId matches currentPhaseId region', () => {
    const lanternProgress = makeProgress({
      placement: makePlacement(),
      currentPhaseId: 'lantern',
    })
    expect(projectVillage(lanternProgress).activeRegionId).toBe('lantern-quarter')

    const workshopProgress = makeProgress({
      placement: makePlacement(),
      currentPhaseId: 'workshop',
    })
    expect(projectVillage(workshopProgress).activeRegionId).toBe('market-row')

    const lookoutProgress = makeProgress({
      placement: makePlacement(),
      currentPhaseId: 'lookout',
    })
    expect(projectVillage(lookoutProgress).activeRegionId).toBe('tower-district')
  })
})
