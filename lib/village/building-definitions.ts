export type BuildingId = 'townHall' | 'workshop' | 'tavern'

export type BuildingTier = {
  level: number
  label: string
  goldCost: number
  rareMaterialCost: number
  rareMaterialType: string | null
  unlocks: string
}

export type BuildingDefinition = {
  id: BuildingId
  name: string
  description: string
  tiers: BuildingTier[]
}

export const buildingDefinitions: BuildingDefinition[] = [
  {
    id: 'townHall',
    name: 'Town Hall',
    description: 'The heart of your village. Upgrading it opens new chapters on the map.',
    tiers: [
      { level: 1, label: 'Foundation', goldCost: 80, rareMaterialCost: 0, rareMaterialType: null, unlocks: 'Unlocks The Reach chapter' },
      { level: 2, label: 'Established', goldCost: 300, rareMaterialCost: 1, rareMaterialType: 'stone', unlocks: 'Unlocks future chapters' },
    ],
  },
  {
    id: 'workshop',
    name: 'Workshop',
    description: 'Craft new ways to type. Unlocks cosmetic typing themes.',
    tiers: [
      { level: 1, label: 'Open Doors', goldCost: 100, rareMaterialCost: 0, rareMaterialType: null, unlocks: 'Unlocks Forest theme' },
      { level: 2, label: 'Fully Equipped', goldCost: 250, rareMaterialCost: 1, rareMaterialType: 'stone', unlocks: 'Unlocks Night theme' },
    ],
  },
  {
    id: 'tavern',
    name: 'Tavern',
    description: 'A place for harder challenges with bigger rewards.',
    tiers: [
      { level: 1, label: 'First Barrels', goldCost: 120, rareMaterialCost: 0, rareMaterialType: null, unlocks: 'Unlocks Modifier challenges (coming soon)' },
      { level: 2, label: 'Full House', goldCost: 280, rareMaterialCost: 2, rareMaterialType: 'stone', unlocks: 'Unlocks harder modifiers' },
    ],
  },
]

export function getBuildingDefinition(id: BuildingId): BuildingDefinition {
  const def = buildingDefinitions.find((b) => b.id === id)
  if (!def) throw new Error(`Unknown building: ${id}`)
  return def
}

export function getBuildingTier(id: BuildingId, level: number): BuildingTier | null {
  const def = getBuildingDefinition(id)
  return def.tiers.find((t) => t.level === level) ?? null
}
