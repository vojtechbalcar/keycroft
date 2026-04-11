import type { GuestProgress } from '@/lib/storage/guest-progress'
import {
  villageDefinitions,
  type VillageId,
  type VillageDefinition,
} from '@/lib/world/village-definitions'
import { MASTERY_UNLOCK_THRESHOLD, MASTERY_MAX } from '@/lib/world/mastery-rules'

export type VillageState = 'locked' | 'active' | 'flourishing' | 'complete'

export type VillageProjection = {
  definition: VillageDefinition
  mastery: number
  state: VillageState
  isCurrentVillage: boolean
}

export type WorldState = {
  villages: VillageProjection[]
  currentVillageId: VillageId
  totalMastery: number
}

function computeVillageState(
  def: VillageDefinition,
  mastery: number,
  villageMastery: Partial<Record<VillageId, number>>,
): VillageState {
  if (def.prevVillageId !== null) {
    const prevMastery = villageMastery[def.prevVillageId] ?? 0
    if (prevMastery < def.unlockThreshold) return 'locked'
  }
  if (mastery >= MASTERY_MAX) return 'complete'
  if (mastery >= MASTERY_UNLOCK_THRESHOLD) return 'flourishing'
  return 'active'
}

export function projectWorld(progress: GuestProgress): WorldState {
  const villageMastery = (progress as any).villageMastery ?? {}

  const projections: VillageProjection[] = villageDefinitions.map((def) => {
    const mastery = villageMastery[def.id] ?? 0
    const state = computeVillageState(def, mastery, villageMastery)
    return { definition: def, mastery, state, isCurrentVillage: false }
  })

  // Current village = first active or flourishing (not complete)
  const currentProjection =
    projections.find((p) => p.state === 'active' || p.state === 'flourishing') ??
    projections[0]
  currentProjection.isCurrentVillage = true

  const totalMastery = Math.round(
    projections.reduce((sum, p) => sum + p.mastery, 0) / projections.length,
  )

  return {
    villages: projections,
    currentVillageId: currentProjection.definition.id,
    totalMastery,
  }
}
