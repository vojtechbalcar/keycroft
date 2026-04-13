import type { VillageId } from '@/lib/world/village-definitions'

export type VillageStageArt = {
  imagePath: string
  label: string
  level: number
  labelPosition: {
    x: number
    y: number
  }
}

const STAGE_THRESHOLDS = [0, 17, 34, 51, 68, 85]

export function getVillageStageLevel(mastery: number): number {
  let level = 1

  for (let index = 0; index < STAGE_THRESHOLDS.length; index += 1) {
    if (mastery >= STAGE_THRESHOLDS[index]) {
      level = index + 1
    }
  }

  return Math.min(6, level)
}

export function getVillageStageArt(
  villageId: VillageId,
  mastery: number,
): VillageStageArt | null {
  if (villageId !== 'meadow-farm') {
    return null
  }

  const level = getVillageStageLevel(mastery)

  return {
    imagePath: `/images/village_1/village_1_stage_${level}.png`,
    label: `Market Pavilion Lv. ${level}`,
    level,
    labelPosition: {
      x: 19,
      y: 67,
    },
  }
}
