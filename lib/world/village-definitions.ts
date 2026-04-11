export type VillageId =
  | 'meadow-farm'
  | 'fishing-docks'
  | 'mountain-mine'
  | 'forest-watch'
  | 'desert-market'
  | 'volcano-forge'

export type VillagePalette = {
  bg: string      // dark backdrop colour for scene
  accent: string  // primary accent (mastery bar, highlights)
  surface: string // mid-tone surface
  text: string    // readable text on dark bg
}

export type VillageDefinition = {
  id: VillageId
  order: number               // 1–6, determines unlock chain
  name: string
  tagline: string             // one-line flavour shown in scene header
  emoji: string               // icon used on map marker
  palette: VillagePalette
  keyFocus: string[]          // keys this village introduces
  unlockThreshold: number     // mastery needed in prevVillageId (0 = always open)
  prevVillageId: VillageId | null
}

export const villageDefinitions: VillageDefinition[] = [
  {
    id: 'meadow-farm',
    order: 1,
    name: 'Meadow Farm',
    tagline: 'Where the harvest begins',
    emoji: '🌾',
    palette: {
      bg: '#0f1f08',
      accent: '#4a8c3a',
      surface: '#1e3a14',
      text: '#c8e6b0',
    },
    keyFocus: ['a', 's', 'd', 'f', 'j', 'k', 'l', ';'],
    unlockThreshold: 0,
    prevVillageId: null,
  },
  {
    id: 'fishing-docks',
    order: 2,
    name: 'Fishing Docks',
    tagline: 'The tide brings new letters',
    emoji: '⚓',
    palette: {
      bg: '#081520',
      accent: '#2e7a9c',
      surface: '#102030',
      text: '#a8d4e8',
    },
    keyFocus: ['g', 'h', 't', 'y'],
    unlockThreshold: 80,
    prevVillageId: 'meadow-farm',
  },
  {
    id: 'mountain-mine',
    order: 3,
    name: 'Mountain Mine',
    tagline: 'Deeper reach, stronger hands',
    emoji: '⛏️',
    palette: {
      bg: '#181008',
      accent: '#9c6a2e',
      surface: '#2c1e10',
      text: '#e8d4a0',
    },
    keyFocus: ['b', 'n', 'q', 'w', 'e', 'r', 'p'],
    unlockThreshold: 80,
    prevVillageId: 'fishing-docks',
  },
  {
    id: 'forest-watch',
    order: 4,
    name: 'Forest Watch',
    tagline: 'The numbers never lie',
    emoji: '🌲',
    palette: {
      bg: '#081810',
      accent: '#2e7a4a',
      surface: '#102818',
      text: '#a8e8c0',
    },
    keyFocus: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
    unlockThreshold: 80,
    prevVillageId: 'mountain-mine',
  },
  {
    id: 'desert-market',
    order: 5,
    name: 'Desert Market',
    tagline: 'Every symbol has a price',
    emoji: '🏺',
    palette: {
      bg: '#200e04',
      accent: '#c08020',
      surface: '#381808',
      text: '#f0d090',
    },
    keyFocus: ['@', '#', '!', ',', '.', ':', '"', "'", '(', ')'],
    unlockThreshold: 80,
    prevVillageId: 'forest-watch',
  },
  {
    id: 'volcano-forge',
    order: 6,
    name: 'Volcano Forge',
    tagline: 'The whole keyboard, forged together',
    emoji: '🌋',
    palette: {
      bg: '#200808',
      accent: '#c04020',
      surface: '#381010',
      text: '#f0c0a0',
    },
    keyFocus: ['all'],
    unlockThreshold: 80,
    prevVillageId: 'desert-market',
  },
]

export function getVillageDefinition(id: VillageId): VillageDefinition {
  const def = villageDefinitions.find((v) => v.id === id)
  if (!def) throw new Error(`Unknown village: ${id}`)
  return def
}

export function getNextVillageId(id: VillageId): VillageId | null {
  const next = villageDefinitions.find((v) => v.prevVillageId === id)
  return next?.id ?? null
}
