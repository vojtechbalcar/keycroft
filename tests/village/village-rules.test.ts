import { describe, expect, it } from 'vitest'
import {
  canUpgradeBuilding,
  computeUpgradeCost,
  applyBuildingUpgrade,
} from '@/lib/village/village-rules'

const baseResources = { gold: 500, rareMaterials: { stone: 2, timber: 0 } }
const baseLevels = { townHall: 0, workshop: 0, tavern: 0 }

describe('canUpgradeBuilding', () => {
  it('returns true when player has enough gold and no rare material needed', () => {
    expect(canUpgradeBuilding('townHall', baseLevels, baseResources)).toBe(true)
  })

  it('returns false when gold is insufficient', () => {
    expect(canUpgradeBuilding('townHall', baseLevels, { gold: 10, rareMaterials: {} })).toBe(false)
  })

  it('returns false when already at max tier', () => {
    expect(canUpgradeBuilding('townHall', { ...baseLevels, townHall: 2 }, baseResources)).toBe(false)
  })

  it('returns false when rare material is required but missing', () => {
    const lvl1 = { ...baseLevels, townHall: 1 }
    const noStone = { gold: 500, rareMaterials: { stone: 0, timber: 0 } }
    expect(canUpgradeBuilding('townHall', lvl1, noStone)).toBe(false)
  })
})

describe('computeUpgradeCost', () => {
  it('returns gold cost for tier 1 of townHall', () => {
    const cost = computeUpgradeCost('townHall', 0)
    expect(cost).toEqual({ gold: 80, rareMaterialCost: 0, rareMaterialType: null })
  })

  it('returns gold and rare material cost for tier 2', () => {
    const cost = computeUpgradeCost('townHall', 1)
    expect(cost).toEqual({ gold: 300, rareMaterialCost: 1, rareMaterialType: 'stone' })
  })
})

describe('applyBuildingUpgrade', () => {
  it('increments building level', () => {
    const result = applyBuildingUpgrade(baseLevels, 'townHall')
    expect(result.townHall).toBe(1)
  })

  it('does not change other building levels', () => {
    const result = applyBuildingUpgrade(baseLevels, 'workshop')
    expect(result.townHall).toBe(0)
    expect(result.tavern).toBe(0)
  })
})
