export type BuildingLevels = {
  townHall: number
  workshop: number
  tavern: number
}

type NodeLike = { id: string; type: 'lesson' | 'boss' }
type ChapterLike = { nodes: NodeLike[] }

export function getLessonNodeIds(chapter: ChapterLike): string[] {
  return chapter.nodes.filter((n) => n.type === 'lesson').map((n) => n.id)
}

export function isNodeCleared(nodeId: string, clearedNodeIds: Set<string>): boolean {
  return clearedNodeIds.has(nodeId)
}

export function isBossUnlocked(chapter: ChapterLike, clearedNodeIds: Set<string>): boolean {
  return getLessonNodeIds(chapter).every((id) => clearedNodeIds.has(id))
}

export function isChapterUnlocked(buildingUnlockKey: string, buildingLevels: BuildingLevels): boolean {
  const [building, levelStr] = buildingUnlockKey.split(':')
  const requiredLevel = parseInt(levelStr, 10)
  if (requiredLevel === 0) return true
  const currentLevel = buildingLevels[building as keyof BuildingLevels] ?? 0
  return currentLevel >= requiredLevel
}
