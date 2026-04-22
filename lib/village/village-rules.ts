import type { BuildingId } from '@/lib/village/building-definitions'
import { getBuildingDefinition, getBuildingTier } from '@/lib/village/building-definitions'
import type { BuildingLevels } from '@/lib/map/map-rules'

export type ResourceState = {
  gold: number
  rareMaterials: Record<string, number>
}

export type UpgradeCost = {
  gold: number
  rareMaterialCost: number
  rareMaterialType: string | null
}

export function computeUpgradeCost(buildingId: BuildingId, currentLevel: number): UpgradeCost {
  const nextTier = getBuildingTier(buildingId, currentLevel + 1)
  if (!nextTier) throw new Error(`No tier ${currentLevel + 1} for ${buildingId}`)
  return {
    gold: nextTier.goldCost,
    rareMaterialCost: nextTier.rareMaterialCost,
    rareMaterialType: nextTier.rareMaterialType,
  }
}

export function canUpgradeBuilding(
  buildingId: BuildingId,
  buildingLevels: BuildingLevels,
  resources: ResourceState,
): boolean {
  const currentLevel = buildingLevels[buildingId]
  const def = getBuildingDefinition(buildingId)
  if (currentLevel >= def.tiers.length) return false

  const cost = computeUpgradeCost(buildingId, currentLevel)
  if (resources.gold < cost.gold) return false
  if (cost.rareMaterialType && (resources.rareMaterials[cost.rareMaterialType] ?? 0) < cost.rareMaterialCost) {
    return false
  }
  return true
}

export function applyBuildingUpgrade(
  buildingLevels: BuildingLevels,
  buildingId: BuildingId,
): BuildingLevels {
  return {
    ...buildingLevels,
    [buildingId]: (buildingLevels[buildingId] ?? 0) + 1,
  }
}

export function applyUpgradeCostToResources(
  resources: ResourceState,
  cost: UpgradeCost,
): ResourceState {
  const updatedRare = { ...resources.rareMaterials }
  if (cost.rareMaterialType) {
    updatedRare[cost.rareMaterialType] = (updatedRare[cost.rareMaterialType] ?? 0) - cost.rareMaterialCost
  }
  return {
    gold: resources.gold - cost.gold,
    rareMaterials: updatedRare,
  }
}
