import { describe, expect, it } from 'vitest'
import {
  isNodeCleared,
  isBossUnlocked,
  isChapterUnlocked,
  getLessonNodeIds,
} from '@/lib/map/map-rules'

const homeRowChapter = {
  id: 'home-row' as const,
  order: 1,
  name: 'The Home Row',
  tagline: 'Where every journey begins.',
  bossThreshold: 18,
  buildingUnlockKey: 'townHall:0',
  nodes: [
    { id: 'home-row-1', type: 'lesson' as const, title: 'First Fingers', keyFocus: 'a s d f', wordBank: ['flask'] },
    { id: 'home-row-2', type: 'lesson' as const, title: 'Steady Hands', keyFocus: 'a s d f', wordBank: ['flak'] },
    { id: 'home-row-3', type: 'lesson' as const, title: 'Finding Flow', keyFocus: 'a s d f', wordBank: ['flag'] },
    { id: 'home-row-boss', type: 'boss' as const, title: 'The Warden', keyFocus: 'a s d f', wordBank: ['flask'] },
  ],
}

describe('isNodeCleared', () => {
  it('returns true when nodeId appears in cleared set', () => {
    expect(isNodeCleared('home-row-1', new Set(['home-row-1', 'home-row-2']))).toBe(true)
  })

  it('returns false when nodeId not in cleared set', () => {
    expect(isNodeCleared('home-row-3', new Set(['home-row-1']))).toBe(false)
  })
})

describe('isBossUnlocked', () => {
  it('returns true when all lesson nodes are cleared', () => {
    const cleared = new Set(['home-row-1', 'home-row-2', 'home-row-3'])
    expect(isBossUnlocked(homeRowChapter, cleared)).toBe(true)
  })

  it('returns false when a lesson node is not cleared', () => {
    const cleared = new Set(['home-row-1', 'home-row-2'])
    expect(isBossUnlocked(homeRowChapter, cleared)).toBe(false)
  })
})

describe('isChapterUnlocked', () => {
  it('returns true for buildingUnlockKey townHall:0 regardless of levels', () => {
    expect(isChapterUnlocked('townHall:0', { townHall: 0, workshop: 0, tavern: 0 })).toBe(true)
  })

  it('returns true when building meets required level', () => {
    expect(isChapterUnlocked('townHall:1', { townHall: 1, workshop: 0, tavern: 0 })).toBe(true)
  })

  it('returns false when building level is below required', () => {
    expect(isChapterUnlocked('townHall:1', { townHall: 0, workshop: 0, tavern: 0 })).toBe(false)
  })
})

describe('getLessonNodeIds', () => {
  it('returns only lesson node ids, not boss', () => {
    const ids = getLessonNodeIds(homeRowChapter)
    expect(ids).toContain('home-row-1')
    expect(ids).toContain('home-row-2')
    expect(ids).toContain('home-row-3')
    expect(ids).not.toContain('home-row-boss')
  })
})
