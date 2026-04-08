import type { GuestProgress } from '@/lib/storage/guest-progress'
import { regionDefinitions } from './world-regions'
import type { RegionId, RegionDefinition, RegionState } from './world-regions'
import { computeRegionState } from './world-rules'

export type RegionProjection = {
  definition: RegionDefinition
  state: RegionState
}

export type VillageState = {
  regions: RegionProjection[]
  activeRegionId: RegionId
  sessionCount: number
  canProgress: boolean
}

export function projectVillage(progress: GuestProgress): VillageState {
  const regions: RegionProjection[] = regionDefinitions.map((definition) => ({
    definition,
    state: computeRegionState(definition.id, progress),
  }))

  // activeRegionId = region whose phaseUnlockId matches currentPhaseId, or lantern-quarter if null
  let activeRegionId: RegionId = 'lantern-quarter'
  if (progress.currentPhaseId !== null) {
    const matchingRegion = regionDefinitions.find(
      (region) => region.phaseUnlockId === progress.currentPhaseId,
    )
    if (matchingRegion !== undefined) {
      activeRegionId = matchingRegion.id
    }
  }

  return {
    regions,
    activeRegionId,
    sessionCount: progress.recentSessions.length,
    canProgress: progress.placement !== null,
  }
}
