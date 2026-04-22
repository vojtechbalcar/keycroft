export type NodeType = 'lesson' | 'boss'

export type NodeDefinition = {
  id: string
  type: NodeType
  title: string
  keyFocus: string
  wordBank: string[]
}

export type ChapterId = 'home-row' | 'reach-keys'

export type ChapterDefinition = {
  id: ChapterId
  order: number
  name: string
  tagline: string
  bossThreshold: number
  buildingUnlockKey: string
  nodes: NodeDefinition[]
}

export const chapterDefinitions: ChapterDefinition[] = [
  {
    id: 'home-row',
    order: 1,
    name: 'The Home Row',
    tagline: 'Where every journey begins.',
    bossThreshold: 18,
    buildingUnlockKey: 'townHall:0',
    nodes: [
      {
        id: 'home-row-1',
        type: 'lesson',
        title: 'First Fingers',
        keyFocus: 'a s d f j k l ;',
        wordBank: ['flask', 'salad', 'falls', 'lads', 'alfalfa', 'asks', 'alls', 'dads', 'lass', 'fads'],
      },
      {
        id: 'home-row-2',
        type: 'lesson',
        title: 'Steady Hands',
        keyFocus: 'a s d f j k l ;',
        wordBank: ['flak', 'dalk', 'falls', 'jads', 'lask', 'skald', 'fads', 'kladd', 'alfs', 'slab'],
      },
      {
        id: 'home-row-3',
        type: 'lesson',
        title: 'Finding Flow',
        keyFocus: 'a s d f j k l ;',
        wordBank: ['flag', 'flask', 'glass', 'lass', 'flash', 'alfs', 'shall', 'falls', 'flak', 'slab'],
      },
      {
        id: 'home-row-boss',
        type: 'boss',
        title: 'The Warden',
        keyFocus: 'a s d f j k l ;',
        wordBank: ['flask', 'salad', 'falls', 'lads', 'flag', 'glass', 'lass', 'flash', 'alfs', 'shall', 'flak', 'dads', 'asks', 'fads', 'slab'],
      },
    ],
  },
  {
    id: 'reach-keys',
    order: 2,
    name: 'The Reach',
    tagline: 'Fingers stretch, words flow.',
    bossThreshold: 24,
    buildingUnlockKey: 'townHall:1',
    nodes: [
      {
        id: 'reach-keys-1',
        type: 'lesson',
        title: 'Up and Over',
        keyFocus: 'g h t y',
        wordBank: ['the', 'that', 'this', 'they', 'thing', 'ghost', 'hyena', 'graph', 'gather', 'athy'],
      },
      {
        id: 'reach-keys-2',
        type: 'lesson',
        title: 'Bridging the Gap',
        keyFocus: 'g h t y',
        wordBank: ['tight', 'night', 'light', 'fight', 'height', 'length', 'thigh', 'eighth', 'tying', 'ghastly'],
      },
      {
        id: 'reach-keys-3',
        type: 'lesson',
        title: 'Full Reach',
        keyFocus: 'g h t y + home row',
        wordBank: ['thankful', 'healthy', 'faithful', 'ghastly', 'stylish', 'slightly', 'thankfully', 'flighty', 'lastly', 'flagths'],
      },
      {
        id: 'reach-keys-boss',
        type: 'boss',
        title: 'The Reach Master',
        keyFocus: 'g h t y + home row',
        wordBank: ['the', 'that', 'tight', 'night', 'ghost', 'healthy', 'thankful', 'faithful', 'lastly', 'flighty', 'stylish', 'slightly', 'thigh', 'eighth', 'length'],
      },
    ],
  },
]

export function getChapterDefinition(chapterId: ChapterId): ChapterDefinition {
  const chapter = chapterDefinitions.find((c) => c.id === chapterId)
  if (!chapter) throw new Error(`Unknown chapter: ${chapterId}`)
  return chapter
}

export function getNodeDefinition(chapterId: ChapterId, nodeId: string): NodeDefinition {
  const chapter = getChapterDefinition(chapterId)
  const node = chapter.nodes.find((n) => n.id === nodeId)
  if (!node) throw new Error(`Unknown node: ${nodeId} in chapter ${chapterId}`)
  return node
}
