import type { PhaseId } from '@/lib/placement/phase-definitions'
import type { GuestProgress } from '@/lib/storage/guest-progress'
import type { RegionId, RegionState } from './world-regions'
import { getRegionDefinition } from './world-regions'

export function phaseOrder(phaseId: PhaseId): number {
  switch (phaseId) {
    case 'lantern':
      return 0
    case 'workshop':
      return 1
    case 'lookout':
      return 2
  }
}

export function computeRegionState(regionId: RegionId, progress: GuestProgress): RegionState {
  const region = getRegionDefinition(regionId)

  // If placement is null, lantern-quarter is active, all others are locked
  if (progress.placement === null) {
    return regionId === 'lantern-quarter' ? 'active' : 'locked'
  }

  const currentPhaseId = progress.currentPhaseId

  // If current phase is null after placement (shouldn't happen, but guard it)
  if (currentPhaseId === null) {
    return regionId === 'lantern-quarter' ? 'active' : 'locked'
  }

  // If region's unlock phase is beyond the current phase, it is locked
  if (phaseOrder(region.phaseUnlockId) > phaseOrder(currentPhaseId)) {
    return 'locked'
  }

  // Check flourishing: ≥3 recent sessions averaging ≥90% accuracy in the region's phase
  const sessionsForPhase = progress.events
    .filter(
      (event) =>
        event.type === 'practice-session-completed' && event.phaseId === region.phaseUnlockId,
    )
    .map((event) => {
      if (event.type === 'practice-session-completed') {
        return event.session.accuracy
      }
      return 0
    })

  // Use the most recent sessions (up to what's stored in recentSessions, max 5)
  // We check recent sessions filtered by phase via events
  const recentPhaseAccuracies = sessionsForPhase.slice(-5)

  if (recentPhaseAccuracies.length >= 3) {
    const averageAccuracy =
      recentPhaseAccuracies.reduce((sum, acc) => sum + acc, 0) / recentPhaseAccuracies.length
    if (averageAccuracy >= 90) {
      return 'flourishing'
    }
  }

  return 'active'
}
