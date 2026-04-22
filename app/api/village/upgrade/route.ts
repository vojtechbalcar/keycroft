import { auth } from '@/auth'
import type { BuildingId } from '@/lib/village/building-definitions'
import { canUpgradeBuilding, computeUpgradeCost } from '@/lib/village/village-rules'
import { upgradeBuildingInDb, readRpgProgress } from '@/lib/storage/rpg-progress'

export const POST = auth(async (request) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userId = (request as any).auth?.user?.id
  if (!userId) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json() as { buildingId: BuildingId }
  const { buildingId } = body
  if (!buildingId) return Response.json({ error: 'Missing buildingId' }, { status: 400 })

  const progress = await readRpgProgress(userId)
  const resources = { gold: progress.gold, rareMaterials: progress.rareMaterials }

  if (!canUpgradeBuilding(buildingId, progress.buildingLevels, resources)) {
    return Response.json(
      { error: 'Cannot upgrade: insufficient resources or max tier reached' },
      { status: 400 },
    )
  }

  const currentLevel = progress.buildingLevels[buildingId]
  const cost = computeUpgradeCost(buildingId, currentLevel)
  const newLevel = currentLevel + 1

  await upgradeBuildingInDb(userId, buildingId, cost.gold, cost.rareMaterialType, cost.rareMaterialCost, newLevel)

  return Response.json({ newLevel, buildingId })
})
