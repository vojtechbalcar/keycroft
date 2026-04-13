import type { VillageId } from './village-definitions'

export type BuildingLevel = {
  label: string        // "Basic", "Improved", "Skilled"…
  bonusLabel: string   // shown in popup
  masteryRequired: number  // 0–100
  xpLabel: string      // "0 XP", "200 XP"… (for display)
}

export type BuildingDefinition = {
  id: string
  name: string
  emoji: string
  description: string
  /** Position as % of the village image (left, top) */
  hotspot: { x: number; y: number }
  levels: BuildingLevel[]
}

const LEVEL_LABELS = ['Basic', 'Improved', 'Skilled', 'Advanced', 'Expert', 'Master']
const MASTERY_THRESHOLDS = [0, 15, 30, 50, 70, 90]

function buildLevels(bonuses: string[]): BuildingLevel[] {
  return bonuses.map((bonusLabel, i) => ({
    label: LEVEL_LABELS[i],
    bonusLabel,
    masteryRequired: MASTERY_THRESHOLDS[i],
    xpLabel: `${MASTERY_THRESHOLDS[i]}%`,
  }))
}

export function getBuildingLevel(mastery: number, building: BuildingDefinition): number {
  let level = 0
  for (let i = 0; i < building.levels.length; i++) {
    if (mastery >= building.levels[i].masteryRequired) level = i
    else break
  }
  return level  // 0-indexed
}

export function getNextLevelProgress(mastery: number, building: BuildingDefinition): {
  currentLevel: number  // 0-indexed
  nextThreshold: number | null
  prevThreshold: number
  progressPct: number
} {
  const currentLevel = getBuildingLevel(mastery, building)
  const nextLevel = currentLevel + 1
  const prevThreshold = building.levels[currentLevel].masteryRequired
  const nextThreshold = building.levels[nextLevel]?.masteryRequired ?? null

  let progressPct = 100
  if (nextThreshold !== null) {
    const range = nextThreshold - prevThreshold
    const done  = mastery - prevThreshold
    progressPct = Math.min(100, Math.round((done / range) * 100))
  }

  return { currentLevel, nextThreshold, prevThreshold, progressPct }
}

/* ── Building sets per village ──────────────────────────────── */

const MEADOW_BUILDINGS: BuildingDefinition[] = [
  {
    id: 'cottage',
    name: 'Cottage',
    emoji: '🏠',
    description: 'Your home base in the village. Increases XP earned per session.',
    hotspot: { x: 15, y: 33 },
    levels: buildLevels([
      'No bonus yet',
      '+5% XP gain',
      '+10% XP gain',
      '+15% XP gain',
      '+20% XP gain',
      '+25% XP gain',
    ]),
  },
  {
    id: 'market-pavilion',
    name: 'Market Pavilion',
    emoji: '🏚️',
    description: 'Trades your progress for rewards. Reduces the XP penalty for errors.',
    hotspot: { x: 55, y: 25 },
    levels: buildLevels([
      'No bonus yet',
      '−3% error penalty',
      '−5% error penalty',
      '−8% error penalty',
      '−10% error penalty',
      '−12% error penalty',
    ]),
  },
  {
    id: 'village-well',
    name: 'Village Well',
    emoji: '🪣',
    description: 'Keeps the village thriving. Boosts your accuracy recovery.',
    hotspot: { x: 78, y: 55 },
    levels: buildLevels([
      'No bonus yet',
      '+2% accuracy floor',
      '+4% accuracy floor',
      '+6% accuracy floor',
      '+8% accuracy floor',
      '+10% accuracy floor',
    ]),
  },
  {
    id: 'forge',
    name: 'Forge',
    emoji: '⚙️',
    description: 'Where tools are made. Unlocks bonus practice rounds per session.',
    hotspot: { x: 25, y: 67 },
    levels: buildLevels([
      'No bonus yet',
      '+1 bonus drill/session',
      '+2 bonus drills/session',
      '+3 bonus drills/session',
      '+4 bonus drills/session',
      '+5 bonus drills/session',
    ]),
  },
]

const FISHING_BUILDINGS: BuildingDefinition[] = [
  {
    id: 'dock',
    name: 'Dock',
    emoji: '⚓',
    description: 'Your landing point. Earns more XP per completed lesson.',
    hotspot: { x: 40, y: 55 },
    levels: buildLevels(['No bonus yet', '+5% XP', '+10% XP', '+15% XP', '+20% XP', '+25% XP']),
  },
  {
    id: 'smokehouse',
    name: 'Smokehouse',
    emoji: '🔥',
    description: 'Cures the catch. Reduces error penalty on new key introductions.',
    hotspot: { x: 65, y: 48 },
    levels: buildLevels(['No bonus yet', '−3% error', '−5% error', '−8% error', '−10% error', '−12% error']),
  },
  {
    id: 'lighthouse',
    name: 'Lighthouse',
    emoji: '🗼',
    description: 'Guides the ships. Highlights the next expected key longer.',
    hotspot: { x: 20, y: 38 },
    levels: buildLevels(['No bonus yet', '+0.1s hint', '+0.2s hint', '+0.3s hint', '+0.5s hint', '+0.8s hint']),
  },
  {
    id: 'net-house',
    name: 'Net House',
    emoji: '🎣',
    description: 'Mends the nets. Adds an extra attempt before lesson fails.',
    hotspot: { x: 75, y: 60 },
    levels: buildLevels(['No bonus yet', '+1 attempt', '+2 attempts', '+3 attempts', '+4 attempts', '+5 attempts']),
  },
]

// Reuse a generic set for remaining villages
function genericBuildings(names: [string, string, string, string]): BuildingDefinition[] {
  const emojis = ['🏛️', '⚒️', '🪔', '📦']
  const descs  = [
    'The central structure. Earns bonus XP per session.',
    'Forges your progress. Cuts error penalties.',
    'Guides the way. Improves accuracy recovery.',
    'Stores supplies. Adds bonus practice rounds.',
  ]
  const positions = [
    { x: 38, y: 44 }, { x: 63, y: 50 }, { x: 22, y: 60 }, { x: 76, y: 40 },
  ]
  return names.map((name, i) => ({
    id: name.toLowerCase().replace(/\s/g, '-'),
    name,
    emoji: emojis[i],
    description: descs[i],
    hotspot: positions[i],
    levels: i === 0
      ? buildLevels(['No bonus yet', '+5% XP', '+10% XP', '+15% XP', '+20% XP', '+25% XP'])
      : i === 1
        ? buildLevels(['No bonus yet', '−3% error', '−5% error', '−8% error', '−10% error', '−12% error'])
        : i === 2
          ? buildLevels(['No bonus yet', '+2% acc floor', '+4% acc floor', '+6% acc floor', '+8% acc floor', '+10% acc floor'])
          : buildLevels(['No bonus yet', '+1 drill', '+2 drills', '+3 drills', '+4 drills', '+5 drills']),
  }))
}

export const VILLAGE_BUILDINGS: Record<VillageId, BuildingDefinition[]> = {
  'meadow-farm':   MEADOW_BUILDINGS,
  'fishing-docks': FISHING_BUILDINGS,
  'mountain-mine': genericBuildings(['Mineshaft', 'Forge', 'Lantern Post', 'Ore Store']),
  'forest-watch':  genericBuildings(['Watch Tower', 'Armory', 'Signal Fire', 'Supply Depot']),
  'desert-market': genericBuildings(['Bazaar', 'Smithy', 'Oil Lamp', 'Caravan Hold']),
  'volcano-forge': genericBuildings(['Forge Core', 'Anvil Hall', 'Ember Shrine', 'Ingot Vault']),
}
