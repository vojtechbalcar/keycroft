# RPG Remodel Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the 6-village world model with a single upgradeable village + adventure map where lessons are map nodes, chapters end with a boss fight, and resources from runs upgrade the village and unlock a skill tree.

**Architecture:** Pure business logic lives in `lib/map/`, `lib/village/`, `lib/skills/`, `lib/resources/`. API routes are thin handlers that call those functions and write to Prisma. UI is server components that fetch state and pass it to focused client components. Existing typing engine is untouched.

**Tech Stack:** Next.js App Router, Prisma, TypeScript, Tailwind CSS, Vitest, React Testing Library

---

## File Map

### Created
- `lib/map/chapter-definitions.ts` — static chapter + node data
- `lib/map/map-rules.ts` — node/chapter unlock logic
- `lib/map/boss-rules.ts` — boss score thresholds, loot
- `lib/resources/resource-rules.ts` — gold + rare material earning
- `lib/village/building-definitions.ts` — buildings, tiers, costs
- `lib/village/village-rules.ts` — upgrade logic, unlock gates
- `lib/skills/skill-definitions.ts` — skill tree nodes
- `lib/skills/skill-effects.ts` — effect calculators
- `lib/storage/rpg-progress.ts` — Prisma read/write for RPG state
- `app/api/lesson/complete/route.ts` — award gold on lesson clear
- `app/api/boss/attempt/route.ts` — record boss, award loot
- `app/api/village/upgrade/route.ts` — spend resources, upgrade building
- `app/api/skills/unlock/route.ts` — spend skill point
- `app/(hub)/map/page.tsx` — adventure map screen
- `app/(hub)/map/[chapterId]/page.tsx` — chapter node list
- `app/(hub)/map/[chapterId]/boss/page.tsx` — boss fight shell
- `app/(hub)/village/page.tsx` — village upgrade screen
- `app/(hub)/skills/page.tsx` — skill tree screen
- `components/map/MapNode.tsx`
- `components/map/ChapterCard.tsx`
- `components/boss/BossSession.tsx` — `'use client'`, timer + typing
- `components/boss/BossResult.tsx`
- `components/village/BuildingCard.tsx`
- `components/skills/SkillTree.tsx`
- `tests/resources/resource-rules.test.ts`
- `tests/map/map-rules.test.ts`
- `tests/map/boss-rules.test.ts`
- `tests/village/village-rules.test.ts`
- `tests/skills/skill-effects.test.ts`

### Modified
- `prisma/schema.prisma` — add gold/resources/skills to User, add NodeCompletion, extend TypingRun
- `components/layout/app-shell.tsx` — add Map / Village / Skills nav links

---

## Task 1: DB Schema

**Files:**
- Modify: `prisma/schema.prisma`

- [ ] **Step 1: Add RPG columns to User and extend TypingRun**

Open `prisma/schema.prisma`. In the `User` model, add after `updatedAt`:

```prisma
  gold            Int      @default(0)
  rareMaterials   Json     @default("{}")
  skillPoints     Int      @default(0)
  unlockedSkills  String[]
  buildingLevels  Json     @default("{}")
  nodeCompletions NodeCompletion[]
```

In the `TypingRun` model, add after `correctedErrors`:

```prisma
  isBossAttempt Boolean  @default(false)
  rareDrop      String?
  goldEarned    Int?
```

- [ ] **Step 2: Add NodeCompletion table**

After the `TypingRun` model, add:

```prisma
model NodeCompletion {
  id        String   @id @default(cuid())
  userId    String
  chapterId String
  nodeId    String
  bestScore Int?
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([userId, chapterId, nodeId])
}
```

- [ ] **Step 3: Push the schema**

```bash
cd /Users/vojtechbalcar/Documents/claudeProjects/typingWithAllTen
npx prisma generate && npx prisma db push
```

Expected: `Your database is now in sync with your Prisma schema.`

- [ ] **Step 4: Commit**

```bash
git add prisma/schema.prisma
git commit -m "feat: add RPG progress columns and NodeCompletion table"
```

---

## Task 2: Chapter Definitions

**Files:**
- Create: `lib/map/chapter-definitions.ts`

- [ ] **Step 1: Create the file**

```typescript
// lib/map/chapter-definitions.ts

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
  bossThreshold: number         // score = wpm * accuracy/100, must meet this to win
  buildingUnlockKey: string     // e.g. 'townHall:1' — building:minLevel needed to unlock
  nodes: NodeDefinition[]
}

export const chapterDefinitions: ChapterDefinition[] = [
  {
    id: 'home-row',
    order: 1,
    name: 'The Home Row',
    tagline: 'Where every journey begins.',
    bossThreshold: 18,
    buildingUnlockKey: 'townHall:0',   // always unlocked
    nodes: [
      {
        id: 'home-row-1',
        type: 'lesson',
        title: 'First Fingers',
        keyFocus: 'a s d f j k l ;',
        wordBank: ['flask', 'salad', 'falls', 'lads', 'alfalfa', 'flask', 'asks', 'alls', 'dads', 'lass'],
      },
      {
        id: 'home-row-2',
        type: 'lesson',
        title: 'Steady Hands',
        keyFocus: 'a s d f j k l ;',
        wordBank: ['slaks', 'flak', 'flask', 'dalk', 'falls', 'jads', 'lask', 'skald', 'fads', 'kladd'],
      },
      {
        id: 'home-row-3',
        type: 'lesson',
        title: 'Finding Flow',
        keyFocus: 'a s d f j k l ;',
        wordBank: ['flag', 'flask', 'glass', 'lass', 'flash', 'klad', 'alfs', 'shall', 'falls', 'flak'],
      },
      {
        id: 'home-row-boss',
        type: 'boss',
        title: 'The Warden',
        keyFocus: 'a s d f j k l ;',
        wordBank: ['flask', 'salad', 'falls', 'lads', 'alfalfa', 'flag', 'glass', 'lass', 'flash', 'skal', 'alfs', 'shall', 'flak', 'dads', 'asks'],
      },
    ],
  },
  {
    id: 'reach-keys',
    order: 2,
    name: 'The Reach',
    tagline: 'Fingers stretch, words flow.',
    bossThreshold: 24,
    buildingUnlockKey: 'townHall:1',   // requires Town Hall tier 1
    nodes: [
      {
        id: 'reach-keys-1',
        type: 'lesson',
        title: 'Up and Over',
        keyFocus: 'g h t y',
        wordBank: ['the', 'that', 'this', 'they', 'thing', 'ghost', 'hyena', 'graph', 'athy', 'gather'],
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
        wordBank: ['lagths', 'thankful', 'healthy', 'faithful', 'ghastly', 'stylish', 'slightly', 'thankfully', 'flighty', 'lastly'],
      },
      {
        id: 'reach-keys-boss',
        type: 'boss',
        title: 'The Reach Master',
        keyFocus: 'g h t y + home row',
        wordBack: ['the', 'that', 'tight', 'night', 'ghost', 'healthy', 'thankful', 'faithful', 'lastly', 'flighty', 'stylish', 'slightly', 'thigh', 'eighth', 'length'],
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
```

- [ ] **Step 2: Commit**

```bash
git add lib/map/chapter-definitions.ts
git commit -m "feat: add chapter and node definitions for home-row and reach-keys"
```

---

## Task 3: Resource Rules (TDD)

**Files:**
- Create: `tests/resources/resource-rules.test.ts`
- Create: `lib/resources/resource-rules.ts`

- [ ] **Step 1: Write the failing tests**

```typescript
// tests/resources/resource-rules.test.ts
import { describe, expect, it } from 'vitest'
import {
  computeLessonGold,
  computeBossGold,
  computeRareDrop,
  REPLAY_MULTIPLIER,
} from '@/lib/resources/resource-rules'

describe('computeLessonGold', () => {
  it('returns 120 for first clear with accuracy >= 95', () => {
    expect(computeLessonGold(60, 97, true)).toBe(120)
  })

  it('returns 80 for first clear with accuracy 85-94', () => {
    expect(computeLessonGold(60, 90, true)).toBe(80)
  })

  it('returns 40 for first clear with accuracy < 85', () => {
    expect(computeLessonGold(60, 70, true)).toBe(40)
  })

  it('applies replay multiplier on subsequent clears', () => {
    expect(computeLessonGold(60, 97, false)).toBe(Math.floor(120 * REPLAY_MULTIPLIER))
  })
})

describe('computeBossGold', () => {
  it('returns 200 on win', () => {
    expect(computeBossGold(true)).toBe(200)
  })

  it('returns 50 on loss', () => {
    expect(computeBossGold(false)).toBe(50)
  })
})

describe('computeRareDrop', () => {
  it('returns stone on win for home-row chapter', () => {
    expect(computeRareDrop(true, 'home-row')).toBe('stone')
  })

  it('returns timber on win for reach-keys chapter', () => {
    expect(computeRareDrop(true, 'reach-keys')).toBe('timber')
  })

  it('returns null on loss', () => {
    expect(computeRareDrop(false, 'home-row')).toBeNull()
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
cd /Users/vojtechbalcar/Documents/claudeProjects/typingWithAllTen
npx vitest run tests/resources/resource-rules.test.ts
```

Expected: FAIL — module not found

- [ ] **Step 3: Implement resource rules**

```typescript
// lib/resources/resource-rules.ts
import type { ChapterId } from '@/lib/map/chapter-definitions'

export const REPLAY_MULTIPLIER = 0.25

const CHAPTER_RARE_MATERIAL: Record<ChapterId, string> = {
  'home-row': 'stone',
  'reach-keys': 'timber',
}

export function computeLessonGold(
  wpm: number,
  accuracy: number,
  isFirstClear: boolean,
): number {
  let base: number
  if (accuracy >= 95) base = 120
  else if (accuracy >= 85) base = 80
  else base = 40

  return isFirstClear ? base : Math.floor(base * REPLAY_MULTIPLIER)
}

export function computeBossGold(won: boolean): number {
  return won ? 200 : 50
}

export function computeRareDrop(won: boolean, chapterId: ChapterId): string | null {
  if (!won) return null
  return CHAPTER_RARE_MATERIAL[chapterId] ?? null
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npx vitest run tests/resources/resource-rules.test.ts
```

Expected: PASS (3 suites, 7 tests)

- [ ] **Step 5: Commit**

```bash
git add lib/resources/resource-rules.ts tests/resources/resource-rules.test.ts
git commit -m "feat: add resource rules with gold and rare material earning logic"
```

---

## Task 4: Map Rules (TDD)

**Files:**
- Create: `tests/map/map-rules.test.ts`
- Create: `lib/map/map-rules.ts`

- [ ] **Step 1: Write the failing tests**

```typescript
// tests/map/map-rules.test.ts
import { describe, expect, it } from 'vitest'
import {
  isNodeCleared,
  isBossUnlocked,
  isChapterUnlocked,
  getLessonNodeIds,
} from '@/lib/map/map-rules'
import { chapterDefinitions } from '@/lib/map/chapter-definitions'

const homeRow = chapterDefinitions[0]

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
    expect(isBossUnlocked(homeRow, cleared)).toBe(true)
  })

  it('returns false when a lesson node is not cleared', () => {
    const cleared = new Set(['home-row-1', 'home-row-2'])
    expect(isBossUnlocked(homeRow, cleared)).toBe(false)
  })
})

describe('isChapterUnlocked', () => {
  it('returns true for chapter with townHall:0 unlock key regardless of levels', () => {
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
    const ids = getLessonNodeIds(homeRow)
    expect(ids).toContain('home-row-1')
    expect(ids).toContain('home-row-2')
    expect(ids).toContain('home-row-3')
    expect(ids).not.toContain('home-row-boss')
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npx vitest run tests/map/map-rules.test.ts
```

Expected: FAIL — module not found

- [ ] **Step 3: Implement map rules**

```typescript
// lib/map/map-rules.ts
import type { ChapterDefinition } from '@/lib/map/chapter-definitions'

export type BuildingLevels = {
  townHall: number
  workshop: number
  tavern: number
}

export function getLessonNodeIds(chapter: ChapterDefinition): string[] {
  return chapter.nodes.filter((n) => n.type === 'lesson').map((n) => n.id)
}

export function isNodeCleared(nodeId: string, clearedNodeIds: Set<string>): boolean {
  return clearedNodeIds.has(nodeId)
}

export function isBossUnlocked(chapter: ChapterDefinition, clearedNodeIds: Set<string>): boolean {
  return getLessonNodeIds(chapter).every((id) => clearedNodeIds.has(id))
}

export function isChapterUnlocked(buildingUnlockKey: string, buildingLevels: BuildingLevels): boolean {
  const [building, levelStr] = buildingUnlockKey.split(':')
  const requiredLevel = parseInt(levelStr, 10)
  if (requiredLevel === 0) return true
  const currentLevel = buildingLevels[building as keyof BuildingLevels] ?? 0
  return currentLevel >= requiredLevel
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npx vitest run tests/map/map-rules.test.ts
```

Expected: PASS (4 suites, 7 tests)

- [ ] **Step 5: Commit**

```bash
git add lib/map/map-rules.ts tests/map/map-rules.test.ts
git commit -m "feat: add map rules for node clearing and chapter unlock logic"
```

---

## Task 5: Boss Rules (TDD)

**Files:**
- Create: `tests/map/boss-rules.test.ts`
- Create: `lib/map/boss-rules.ts`

- [ ] **Step 1: Write the failing tests**

```typescript
// tests/map/boss-rules.test.ts
import { describe, expect, it } from 'vitest'
import { computeBossScore, isBossWon, BOSS_THRESHOLDS } from '@/lib/map/boss-rules'

describe('computeBossScore', () => {
  it('multiplies wpm by accuracy fraction', () => {
    expect(computeBossScore(30, 100)).toBe(30)
  })

  it('reduces score when accuracy is below 100', () => {
    expect(computeBossScore(30, 80)).toBe(24)
  })

  it('rounds to nearest integer', () => {
    expect(computeBossScore(30, 90)).toBe(27)
  })
})

describe('isBossWon', () => {
  it('returns true when score meets threshold for home-row', () => {
    expect(isBossWon(18, 'home-row')).toBe(true)
  })

  it('returns true when score exceeds threshold', () => {
    expect(isBossWon(25, 'home-row')).toBe(true)
  })

  it('returns false when score is below threshold', () => {
    expect(isBossWon(17, 'home-row')).toBe(false)
  })

  it('applies correct threshold for reach-keys', () => {
    expect(isBossWon(24, 'reach-keys')).toBe(true)
    expect(isBossWon(23, 'reach-keys')).toBe(false)
  })
})

describe('BOSS_THRESHOLDS', () => {
  it('has a threshold for every chapter', () => {
    expect(BOSS_THRESHOLDS['home-row']).toBe(18)
    expect(BOSS_THRESHOLDS['reach-keys']).toBe(24)
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npx vitest run tests/map/boss-rules.test.ts
```

Expected: FAIL — module not found

- [ ] **Step 3: Implement boss rules**

```typescript
// lib/map/boss-rules.ts
import type { ChapterId } from '@/lib/map/chapter-definitions'

export const BOSS_THRESHOLDS: Record<ChapterId, number> = {
  'home-row': 18,
  'reach-keys': 24,
}

export function computeBossScore(wpm: number, accuracy: number): number {
  return Math.round(wpm * (accuracy / 100))
}

export function isBossWon(score: number, chapterId: ChapterId): boolean {
  return score >= BOSS_THRESHOLDS[chapterId]
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npx vitest run tests/map/boss-rules.test.ts
```

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add lib/map/boss-rules.ts tests/map/boss-rules.test.ts
git commit -m "feat: add boss score and win threshold logic"
```

---

## Task 6: Village Definitions + Rules (TDD)

**Files:**
- Create: `lib/village/building-definitions.ts`
- Create: `lib/village/village-rules.ts`
- Create: `tests/village/village-rules.test.ts`

- [ ] **Step 1: Create building definitions**

```typescript
// lib/village/building-definitions.ts

export type BuildingId = 'townHall' | 'workshop' | 'tavern'

export type BuildingTier = {
  level: number              // 1-indexed (0 = not built)
  label: string
  goldCost: number
  rareMaterialCost: number   // 0 = no rare material needed
  rareMaterialType: string | null
  unlocks: string            // human-readable description of what this unlocks
}

export type BuildingDefinition = {
  id: BuildingId
  name: string
  description: string
  tiers: BuildingTier[]     // index 0 = tier 1
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
```

- [ ] **Step 2: Write failing village rules tests**

```typescript
// tests/village/village-rules.test.ts
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
```

- [ ] **Step 3: Run tests to verify they fail**

```bash
npx vitest run tests/village/village-rules.test.ts
```

Expected: FAIL — module not found

- [ ] **Step 4: Implement village rules**

```typescript
// lib/village/village-rules.ts
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
```

- [ ] **Step 5: Run tests to verify they pass**

```bash
npx vitest run tests/village/village-rules.test.ts
```

Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add lib/village/building-definitions.ts lib/village/village-rules.ts tests/village/village-rules.test.ts
git commit -m "feat: add village building definitions and upgrade rules"
```

---

## Task 7: Skill Definitions + Effects (TDD)

**Files:**
- Create: `lib/skills/skill-definitions.ts`
- Create: `lib/skills/skill-effects.ts`
- Create: `tests/skills/skill-effects.test.ts`

- [ ] **Step 1: Create skill definitions**

```typescript
// lib/skills/skill-definitions.ts

export type SkillId =
  | 'sharp-eye'
  | 'quick-hands'
  | 'clutch'
  | 'resource-magnet'
  | 'lucky-strike'
  | 'second-chance'

export type SkillBranch = 'performance' | 'economy'

export type SkillDefinition = {
  id: SkillId
  branch: SkillBranch
  name: string
  description: string
  pointCost: number
  requires: SkillId | null
}

export const skillDefinitions: SkillDefinition[] = [
  // Performance branch
  {
    id: 'sharp-eye',
    branch: 'performance',
    name: 'Sharp Eye',
    description: 'Accuracy counts 20% more toward your boss score.',
    pointCost: 1,
    requires: null,
  },
  {
    id: 'quick-hands',
    branch: 'performance',
    name: 'Quick Hands',
    description: '+5 WPM added to your boss score calculation.',
    pointCost: 1,
    requires: 'sharp-eye',
  },
  {
    id: 'clutch',
    branch: 'performance',
    name: 'Clutch',
    description: '+20% score bonus applied to your final boss score.',
    pointCost: 2,
    requires: 'quick-hands',
  },
  // Economy branch
  {
    id: 'resource-magnet',
    branch: 'economy',
    name: 'Resource Magnet',
    description: '+15% gold from all lessons.',
    pointCost: 1,
    requires: null,
  },
  {
    id: 'lucky-strike',
    branch: 'economy',
    name: 'Lucky Strike',
    description: '20% chance to double your rare material on boss win.',
    pointCost: 1,
    requires: 'resource-magnet',
  },
  {
    id: 'second-chance',
    branch: 'economy',
    name: 'Second Chance',
    description: 'One free retry on a boss fight per chapter. Still wins full loot.',
    pointCost: 2,
    requires: 'lucky-strike',
  },
]

export function getSkillDefinition(id: SkillId): SkillDefinition {
  const def = skillDefinitions.find((s) => s.id === id)
  if (!def) throw new Error(`Unknown skill: ${id}`)
  return def
}

export function canUnlockSkill(
  skillId: SkillId,
  unlockedSkills: SkillId[],
  availablePoints: number,
): boolean {
  const def = getSkillDefinition(skillId)
  if (unlockedSkills.includes(skillId)) return false
  if (availablePoints < def.pointCost) return false
  if (def.requires && !unlockedSkills.includes(def.requires)) return false
  return true
}
```

- [ ] **Step 2: Write failing skill effects tests**

```typescript
// tests/skills/skill-effects.test.ts
import { describe, expect, it } from 'vitest'
import {
  applySkillsToBossScore,
  applySkillsToLessonGold,
  hasSecondChance,
} from '@/lib/skills/skill-effects'

describe('applySkillsToBossScore', () => {
  it('returns base score with no skills', () => {
    expect(applySkillsToBossScore(20, 80, [])).toBe(Math.round(20 * (80 / 100)))
  })

  it('sharp-eye boosts accuracy weight', () => {
    const withSharpEye = applySkillsToBossScore(20, 80, ['sharp-eye'])
    const withoutSharpEye = applySkillsToBossScore(20, 80, [])
    expect(withSharpEye).toBeGreaterThan(withoutSharpEye)
  })

  it('quick-hands adds 5 to wpm before scoring', () => {
    const with_ = applySkillsToBossScore(20, 100, ['quick-hands'])
    expect(with_).toBe(25) // (20+5) * 1.0
  })

  it('clutch adds 20% bonus to final score', () => {
    const base = Math.round(20 * (100 / 100))
    const withClutch = applySkillsToBossScore(20, 100, ['clutch'])
    expect(withClutch).toBe(Math.round(base * 1.2))
  })

  it('stacks all performance skills', () => {
    const score = applySkillsToBossScore(20, 80, ['sharp-eye', 'quick-hands', 'clutch'])
    expect(score).toBeGreaterThan(20)
  })
})

describe('applySkillsToLessonGold', () => {
  it('returns base gold with no skills', () => {
    expect(applySkillsToLessonGold(100, [])).toBe(100)
  })

  it('resource-magnet adds 15%', () => {
    expect(applySkillsToLessonGold(100, ['resource-magnet'])).toBe(115)
  })
})

describe('hasSecondChance', () => {
  it('returns true when second-chance is unlocked', () => {
    expect(hasSecondChance(['resource-magnet', 'lucky-strike', 'second-chance'])).toBe(true)
  })

  it('returns false when second-chance is not unlocked', () => {
    expect(hasSecondChance(['resource-magnet'])).toBe(false)
  })
})
```

- [ ] **Step 3: Run tests to verify they fail**

```bash
npx vitest run tests/skills/skill-effects.test.ts
```

Expected: FAIL — module not found

- [ ] **Step 4: Implement skill effects**

```typescript
// lib/skills/skill-effects.ts
import type { SkillId } from '@/lib/skills/skill-definitions'

export function applySkillsToBossScore(
  wpm: number,
  accuracy: number,
  unlockedSkills: SkillId[],
): number {
  let effectiveWpm = wpm
  let effectiveAccuracy = accuracy

  if (unlockedSkills.includes('quick-hands')) {
    effectiveWpm += 5
  }

  if (unlockedSkills.includes('sharp-eye')) {
    effectiveAccuracy = Math.min(100, effectiveAccuracy * 1.2)
  }

  let score = Math.round(effectiveWpm * (effectiveAccuracy / 100))

  if (unlockedSkills.includes('clutch')) {
    score = Math.round(score * 1.2)
  }

  return score
}

export function applySkillsToLessonGold(
  baseGold: number,
  unlockedSkills: SkillId[],
): number {
  if (unlockedSkills.includes('resource-magnet')) {
    return Math.floor(baseGold * 1.15)
  }
  return baseGold
}

export function hasSecondChance(unlockedSkills: SkillId[]): boolean {
  return unlockedSkills.includes('second-chance')
}
```

- [ ] **Step 5: Run tests to verify they pass**

```bash
npx vitest run tests/skills/skill-effects.test.ts
```

Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add lib/skills/skill-definitions.ts lib/skills/skill-effects.ts tests/skills/skill-effects.test.ts
git commit -m "feat: add skill tree definitions and effect calculators"
```

---

## Task 8: RPG Progress Storage

**Files:**
- Create: `lib/storage/rpg-progress.ts`

- [ ] **Step 1: Create the server-side RPG progress reader/writer**

```typescript
// lib/storage/rpg-progress.ts
import { db } from '@/lib/db'
import type { BuildingLevels } from '@/lib/map/map-rules'
import type { SkillId } from '@/lib/skills/skill-definitions'

export type RpgProgress = {
  gold: number
  rareMaterials: Record<string, number>
  skillPoints: number
  unlockedSkills: SkillId[]
  buildingLevels: BuildingLevels
  clearedNodeIds: Set<string>
  clearedChapterIds: Set<string>
}

export async function readRpgProgress(userId: string): Promise<RpgProgress> {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: {
      gold: true,
      rareMaterials: true,
      skillPoints: true,
      unlockedSkills: true,
      buildingLevels: true,
      nodeCompletions: { select: { nodeId: true } },
      chapterProgresses: { select: { chapterId: true } },
    },
  })

  if (!user) {
    return {
      gold: 0,
      rareMaterials: {},
      skillPoints: 0,
      unlockedSkills: [],
      buildingLevels: { townHall: 0, workshop: 0, tavern: 0 },
      clearedNodeIds: new Set(),
      clearedChapterIds: new Set(),
    }
  }

  return {
    gold: user.gold,
    rareMaterials: (user.rareMaterials as Record<string, number>) ?? {},
    skillPoints: user.skillPoints,
    unlockedSkills: user.unlockedSkills as SkillId[],
    buildingLevels: (user.buildingLevels as BuildingLevels) ?? { townHall: 0, workshop: 0, tavern: 0 },
    clearedNodeIds: new Set(user.nodeCompletions.map((n) => n.nodeId)),
    clearedChapterIds: new Set(user.chapterProgresses.map((c) => c.chapterId)),
  }
}

export async function awardLessonGold(
  userId: string,
  nodeId: string,
  chapterId: string,
  goldEarned: number,
): Promise<void> {
  await db.$transaction([
    db.user.update({
      where: { id: userId },
      data: { gold: { increment: goldEarned } },
    }),
    db.nodeCompletion.upsert({
      where: { userId_chapterId_nodeId: { userId, chapterId, nodeId } },
      create: { userId, chapterId, nodeId },
      update: {},
    }),
  ])
}

export async function recordBossAttempt(
  userId: string,
  chapterId: string,
  nodeId: string,
  won: boolean,
  goldEarned: number,
  rareDrop: string | null,
  score: number,
  skillPointsEarned: number,
): Promise<void> {
  await db.$transaction(async (tx) => {
    const updates: Record<string, unknown> = {
      gold: { increment: goldEarned },
    }

    if (rareDrop) {
      const user = await tx.user.findUnique({ where: { id: userId }, select: { rareMaterials: true } })
      const current = (user?.rareMaterials as Record<string, number>) ?? {}
      updates.rareMaterials = { ...current, [rareDrop]: (current[rareDrop] ?? 0) + 1 }
    }

    if (skillPointsEarned > 0) {
      updates.skillPoints = { increment: skillPointsEarned }
    }

    await tx.user.update({ where: { id: userId }, data: updates })

    if (won) {
      await tx.nodeCompletion.upsert({
        where: { userId_chapterId_nodeId: { userId, chapterId, nodeId } },
        create: { userId, chapterId, nodeId, bestScore: score },
        update: { bestScore: score },
      })
      await tx.chapterProgress.upsert({
        where: { userId_chapterId: { userId, chapterId } },
        create: { userId, chapterId, completedAt: new Date() },
        update: {},
      })
    }
  })
}

export async function upgradeBuilding(
  userId: string,
  buildingId: string,
  goldCost: number,
  rareMaterialType: string | null,
  rareMaterialCost: number,
  newLevel: number,
): Promise<void> {
  await db.$transaction(async (tx) => {
    const user = await tx.user.findUnique({
      where: { id: userId },
      select: { buildingLevels: true, rareMaterials: true },
    })

    const currentLevels = (user?.buildingLevels as Record<string, number>) ?? {}
    const currentRare = (user?.rareMaterials as Record<string, number>) ?? {}

    const updatedLevels = { ...currentLevels, [buildingId]: newLevel }
    const updatedRare = rareMaterialType
      ? { ...currentRare, [rareMaterialType]: (currentRare[rareMaterialType] ?? 0) - rareMaterialCost }
      : currentRare

    await tx.user.update({
      where: { id: userId },
      data: {
        buildingLevels: updatedLevels,
        rareMaterials: updatedRare,
        gold: { decrement: goldCost },
      },
    })
  })
}

export async function unlockSkill(
  userId: string,
  skillId: SkillId,
  pointCost: number,
): Promise<void> {
  await db.$transaction(async (tx) => {
    const user = await tx.user.findUnique({ where: { id: userId }, select: { unlockedSkills: true } })
    const current = (user?.unlockedSkills ?? []) as SkillId[]

    await tx.user.update({
      where: { id: userId },
      data: {
        unlockedSkills: [...current, skillId],
        skillPoints: { decrement: pointCost },
      },
    })
  })
}
```

- [ ] **Step 2: Commit**

```bash
git add lib/storage/rpg-progress.ts
git commit -m "feat: add RPG progress read/write functions backed by Prisma"
```

---

## Task 9: API Routes

**Files:**
- Create: `app/api/lesson/complete/route.ts`
- Create: `app/api/boss/attempt/route.ts`
- Create: `app/api/village/upgrade/route.ts`
- Create: `app/api/skills/unlock/route.ts`

- [ ] **Step 1: Create lesson complete route**

```typescript
// app/api/lesson/complete/route.ts
import { auth } from '@/auth'
import { getChapterDefinition, type ChapterId } from '@/lib/map/chapter-definitions'
import { computeLessonGold } from '@/lib/resources/resource-rules'
import { applySkillsToLessonGold } from '@/lib/skills/skill-effects'
import { awardLessonGold, readRpgProgress } from '@/lib/storage/rpg-progress'

export const POST = auth(async (request) => {
  const userId = (request as any).auth?.user?.id
  if (!userId) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json() as {
    chapterId: ChapterId
    nodeId: string
    wpm: number
    accuracy: number
  }

  const { chapterId, nodeId, wpm, accuracy } = body
  if (!chapterId || !nodeId || wpm == null || accuracy == null) {
    return Response.json({ error: 'Missing fields' }, { status: 400 })
  }

  // Validate node exists
  getChapterDefinition(chapterId) // throws if invalid

  const progress = await readRpgProgress(userId)
  const isFirstClear = !progress.clearedNodeIds.has(nodeId)

  const baseGold = computeLessonGold(wpm, accuracy, isFirstClear)
  const goldEarned = applySkillsToLessonGold(baseGold, progress.unlockedSkills)

  await awardLessonGold(userId, nodeId, chapterId, goldEarned)

  return Response.json({ goldEarned, isFirstClear })
})
```

- [ ] **Step 2: Create boss attempt route**

```typescript
// app/api/boss/attempt/route.ts
import { auth } from '@/auth'
import type { ChapterId } from '@/lib/map/chapter-definitions'
import { computeBossScore, isBossWon } from '@/lib/map/boss-rules'
import { computeBossGold, computeRareDrop } from '@/lib/resources/resource-rules'
import { applySkillsToBossScore } from '@/lib/skills/skill-effects'
import { recordBossAttempt, readRpgProgress } from '@/lib/storage/rpg-progress'

export const POST = auth(async (request) => {
  const userId = (request as any).auth?.user?.id
  if (!userId) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json() as {
    chapterId: ChapterId
    nodeId: string
    wpm: number
    accuracy: number
  }

  const { chapterId, nodeId, wpm, accuracy } = body
  if (!chapterId || !nodeId || wpm == null || accuracy == null) {
    return Response.json({ error: 'Missing fields' }, { status: 400 })
  }

  const progress = await readRpgProgress(userId)

  const score = applySkillsToBossScore(wpm, accuracy, progress.unlockedSkills)
  const won = isBossWon(score, chapterId)

  const goldEarned = computeBossGold(won)
  const rareDrop = computeRareDrop(won, chapterId)

  const isFirstChapterClear = won && !progress.clearedChapterIds.has(chapterId)
  const skillPointsEarned = isFirstChapterClear ? 1 : 0

  await recordBossAttempt(userId, chapterId, nodeId, won, goldEarned, rareDrop, score, skillPointsEarned)

  return Response.json({ won, score, goldEarned, rareDrop, skillPointsEarned })
})
```

- [ ] **Step 3: Create village upgrade route**

```typescript
// app/api/village/upgrade/route.ts
import { auth } from '@/auth'
import type { BuildingId } from '@/lib/village/building-definitions'
import { canUpgradeBuilding, computeUpgradeCost } from '@/lib/village/village-rules'
import { upgradeBuilding, readRpgProgress } from '@/lib/storage/rpg-progress'

export const POST = auth(async (request) => {
  const userId = (request as any).auth?.user?.id
  if (!userId) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json() as { buildingId: BuildingId }
  const { buildingId } = body
  if (!buildingId) return Response.json({ error: 'Missing buildingId' }, { status: 400 })

  const progress = await readRpgProgress(userId)
  const resources = { gold: progress.gold, rareMaterials: progress.rareMaterials }

  if (!canUpgradeBuilding(buildingId, progress.buildingLevels, resources)) {
    return Response.json({ error: 'Cannot upgrade: insufficient resources or max tier reached' }, { status: 400 })
  }

  const currentLevel = progress.buildingLevels[buildingId]
  const cost = computeUpgradeCost(buildingId, currentLevel)
  const newLevel = currentLevel + 1

  await upgradeBuilding(userId, buildingId, cost.gold, cost.rareMaterialType, cost.rareMaterialCost, newLevel)

  return Response.json({ newLevel, buildingId })
})
```

- [ ] **Step 4: Create skill unlock route**

```typescript
// app/api/skills/unlock/route.ts
import { auth } from '@/auth'
import { canUnlockSkill, getSkillDefinition, type SkillId } from '@/lib/skills/skill-definitions'
import { unlockSkill, readRpgProgress } from '@/lib/storage/rpg-progress'

export const POST = auth(async (request) => {
  const userId = (request as any).auth?.user?.id
  if (!userId) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json() as { skillId: SkillId }
  const { skillId } = body
  if (!skillId) return Response.json({ error: 'Missing skillId' }, { status: 400 })

  const progress = await readRpgProgress(userId)

  if (!canUnlockSkill(skillId, progress.unlockedSkills, progress.skillPoints)) {
    return Response.json({ error: 'Cannot unlock: missing requirements or insufficient points' }, { status: 400 })
  }

  const def = getSkillDefinition(skillId)
  await unlockSkill(userId, skillId, def.pointCost)

  return Response.json({ skillId, remainingPoints: progress.skillPoints - def.pointCost })
})
```

- [ ] **Step 5: Commit**

```bash
git add app/api/lesson/complete/route.ts app/api/boss/attempt/route.ts app/api/village/upgrade/route.ts app/api/skills/unlock/route.ts
git commit -m "feat: add lesson, boss, village, and skill API routes"
```

---

## Task 10: Map UI

**Files:**
- Create: `components/map/MapNode.tsx`
- Create: `components/map/ChapterCard.tsx`
- Create: `app/(hub)/map/page.tsx`
- Create: `app/(hub)/map/[chapterId]/page.tsx`

- [ ] **Step 1: Create MapNode component**

```tsx
// components/map/MapNode.tsx
import Link from 'next/link'
import type { NodeDefinition } from '@/lib/map/chapter-definitions'

type Props = {
  node: NodeDefinition
  chapterId: string
  cleared: boolean
  locked: boolean
}

export function MapNode({ node, chapterId, cleared, locked }: Props) {
  const href = node.type === 'boss'
    ? `/map/${chapterId}/boss`
    : `/map/${chapterId}#${node.id}`

  const base = 'flex flex-col items-center gap-1 p-3 rounded-lg border text-sm font-medium transition-colors'
  const style = locked
    ? `${base} border-neutral-700 bg-neutral-900 text-neutral-500 cursor-not-allowed`
    : cleared
    ? `${base} border-emerald-700 bg-emerald-950 text-emerald-300`
    : `${base} border-neutral-600 bg-neutral-800 text-neutral-100 hover:bg-neutral-700`

  if (locked) {
    return (
      <div className={style}>
        <span>{node.type === 'boss' ? '💀' : '📜'}</span>
        <span>{node.title}</span>
        <span className="text-xs text-neutral-600">Locked</span>
      </div>
    )
  }

  return (
    <Link href={href} className={style}>
      <span>{node.type === 'boss' ? '💀' : cleared ? '✓' : '📜'}</span>
      <span>{node.title}</span>
      {cleared && <span className="text-xs">Cleared</span>}
    </Link>
  )
}
```

- [ ] **Step 2: Create ChapterCard component**

```tsx
// components/map/ChapterCard.tsx
import Link from 'next/link'
import type { ChapterDefinition } from '@/lib/map/chapter-definitions'
import type { BuildingLevels } from '@/lib/map/map-rules'
import { isChapterUnlocked, isBossUnlocked } from '@/lib/map/map-rules'
import { MapNode } from '@/components/map/MapNode'

type Props = {
  chapter: ChapterDefinition
  buildingLevels: BuildingLevels
  clearedNodeIds: Set<string>
}

export function ChapterCard({ chapter, buildingLevels, clearedNodeIds }: Props) {
  const unlocked = isChapterUnlocked(chapter.buildingUnlockKey, buildingLevels)
  const bossUnlocked = unlocked && isBossUnlocked(chapter, clearedNodeIds)

  return (
    <div className={`rounded-xl border p-5 space-y-4 ${unlocked ? 'border-neutral-600 bg-neutral-900' : 'border-neutral-800 bg-neutral-950 opacity-60'}`}>
      <div>
        <h2 className="text-lg font-semibold text-neutral-100">{chapter.name}</h2>
        <p className="text-sm text-neutral-400">{chapter.tagline}</p>
      </div>

      {!unlocked && (
        <p className="text-xs text-amber-400">Upgrade your Town Hall to unlock this chapter.</p>
      )}

      <div className="grid grid-cols-2 gap-2">
        {chapter.nodes.map((node) => {
          const isLocked = !unlocked || (node.type === 'boss' && !bossUnlocked)
          return (
            <MapNode
              key={node.id}
              node={node}
              chapterId={chapter.id}
              cleared={clearedNodeIds.has(node.id)}
              locked={isLocked}
            />
          )
        })}
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Create the map page**

```tsx
// app/(hub)/map/page.tsx
import { redirect } from 'next/navigation'
import { getSessionUser } from '@/lib/auth/get-session-user'
import { readRpgProgress } from '@/lib/storage/rpg-progress'
import { chapterDefinitions } from '@/lib/map/chapter-definitions'
import { ChapterCard } from '@/components/map/ChapterCard'

export default async function MapPage() {
  const sessionUser = await getSessionUser()
  if (!sessionUser) redirect('/login')

  const progress = await readRpgProgress(sessionUser.id)

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-100">Adventure Map</h1>
          <p className="text-sm text-neutral-400">Complete lessons to unlock the boss. Defeat the boss to earn loot.</p>
        </div>
        <div className="text-right text-sm text-neutral-300">
          <div>🪙 {progress.gold} gold</div>
        </div>
      </div>

      <div className="space-y-4">
        {chapterDefinitions.map((chapter) => (
          <ChapterCard
            key={chapter.id}
            chapter={chapter}
            buildingLevels={progress.buildingLevels}
            clearedNodeIds={progress.clearedNodeIds}
          />
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Create the chapter lesson page**

```tsx
// app/(hub)/map/[chapterId]/page.tsx
import { redirect, notFound } from 'next/navigation'
import { getSessionUser } from '@/lib/auth/get-session-user'
import { readRpgProgress } from '@/lib/storage/rpg-progress'
import { chapterDefinitions, getChapterDefinition, type ChapterId } from '@/lib/map/chapter-definitions'
import { isChapterUnlocked } from '@/lib/map/map-rules'
import Link from 'next/link'

type Props = { params: Promise<{ chapterId: string }> }

export default async function ChapterPage({ params }: Props) {
  const { chapterId } = await params
  const sessionUser = await getSessionUser()
  if (!sessionUser) redirect('/login')

  let chapter
  try {
    chapter = getChapterDefinition(chapterId as ChapterId)
  } catch {
    notFound()
  }

  const progress = await readRpgProgress(sessionUser.id)

  if (!isChapterUnlocked(chapter.buildingUnlockKey, progress.buildingLevels)) {
    redirect('/map')
  }

  const lessonNodes = chapter.nodes.filter((n) => n.type === 'lesson')

  return (
    <div className="max-w-xl mx-auto px-4 py-10 space-y-6">
      <div>
        <Link href="/map" className="text-sm text-neutral-400 hover:text-neutral-200">← Map</Link>
        <h1 className="mt-2 text-2xl font-bold text-neutral-100">{chapter.name}</h1>
        <p className="text-sm text-neutral-400">{chapter.tagline}</p>
      </div>

      <div className="space-y-3">
        {lessonNodes.map((node) => {
          const cleared = progress.clearedNodeIds.has(node.id)
          return (
            <div key={node.id} id={node.id} className={`rounded-lg border p-4 ${cleared ? 'border-emerald-700 bg-emerald-950' : 'border-neutral-600 bg-neutral-900'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-neutral-100">{node.title}</p>
                  <p className="text-xs text-neutral-400 mt-0.5">Keys: {node.keyFocus}</p>
                </div>
                <LessonButton cleared={cleared} chapterId={chapter.id} nodeId={node.id} wordBank={node.wordBank} />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function LessonButton({ cleared, chapterId, nodeId, wordBank }: { cleared: boolean; chapterId: string; nodeId: string; wordBank: string[] }) {
  // This will be a client component in Task 10 step 5 — for now render a placeholder
  return (
    <span className={`text-xs px-3 py-1.5 rounded font-medium ${cleared ? 'bg-emerald-800 text-emerald-200' : 'bg-neutral-700 text-neutral-200'}`}>
      {cleared ? 'Replay' : 'Start'}
    </span>
  )
}
```

- [ ] **Step 5: Commit**

```bash
git add components/map/MapNode.tsx components/map/ChapterCard.tsx "app/(hub)/map/page.tsx" "app/(hub)/map/[chapterId]/page.tsx"
git commit -m "feat: add adventure map page and chapter detail page"
```

---

## Task 11: Boss Fight UI

**Files:**
- Create: `components/boss/BossSession.tsx`
- Create: `components/boss/BossResult.tsx`
- Create: `app/(hub)/map/[chapterId]/boss/page.tsx`

- [ ] **Step 1: Create BossSession client component**

```tsx
// components/boss/BossSession.tsx
'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import type { ChapterId } from '@/lib/map/chapter-definitions'

type Props = {
  chapterId: ChapterId
  nodeId: string
  wordBank: string[]
  onComplete: (result: { won: boolean; score: number; goldEarned: number; rareDrop: string | null; skillPointsEarned: number }) => void
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function BossSession({ chapterId, nodeId, wordBank, onComplete }: Props) {
  const DURATION = 60
  const [timeLeft, setTimeLeft] = useState(DURATION)
  const [words, setWords] = useState<string[]>(() => shuffle([...wordBank, ...wordBank, ...wordBank]))
  const [currentIndex, setCurrentIndex] = useState(0)
  const [input, setInput] = useState('')
  const [correctCount, setCorrectCount] = useState(0)
  const [totalChars, setTotalChars] = useState(0)
  const [errorCount, setErrorCount] = useState(0)
  const [started, setStarted] = useState(false)
  const [finished, setFinished] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const startTimeRef = useRef<number>(0)

  const finish = useCallback(async (correct: number, total: number) => {
    if (finished) return
    setFinished(true)
    const elapsed = (Date.now() - startTimeRef.current) / 1000 / 60
    const wpm = Math.round(correct / elapsed)
    const accuracy = total > 0 ? Math.round(((total - errorCount) / total) * 100) : 0

    const res = await fetch('/api/boss/attempt', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chapterId, nodeId, wpm, accuracy }),
    })
    const data = await res.json()
    onComplete(data)
  }, [chapterId, nodeId, errorCount, finished, onComplete])

  useEffect(() => {
    if (!started || finished) return
    if (timeLeft <= 0) {
      finish(correctCount, totalChars)
      return
    }
    const id = setTimeout(() => setTimeLeft((t) => t - 1), 1000)
    return () => clearTimeout(id)
  }, [started, timeLeft, finished, correctCount, totalChars, finish])

  function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
    if (!started) {
      setStarted(true)
      startTimeRef.current = Date.now()
    }
    const val = e.target.value
    const currentWord = words[currentIndex]

    if (val.endsWith(' ')) {
      const typed = val.trim()
      const isCorrect = typed === currentWord
      setTotalChars((t) => t + currentWord.length)
      if (isCorrect) setCorrectCount((c) => c + 1)
      else setErrorCount((e) => e + 1)
      setCurrentIndex((i) => i + 1)
      setInput('')
    } else {
      setInput(val)
    }
  }

  const currentWord = words[currentIndex] ?? ''
  const isWrong = input.length > 0 && !currentWord.startsWith(input)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <span className="text-3xl font-bold tabular-nums text-neutral-100">{timeLeft}s</span>
        <span className="text-sm text-neutral-400">{correctCount} words typed</span>
      </div>

      <div className="rounded-lg border border-neutral-700 bg-neutral-900 p-4 text-lg font-mono min-h-[3rem] flex flex-wrap gap-2">
        {words.slice(currentIndex, currentIndex + 8).map((word, i) => (
          <span key={currentIndex + i} className={i === 0 ? 'text-amber-300 underline' : 'text-neutral-400'}>
            {word}
          </span>
        ))}
      </div>

      <input
        ref={inputRef}
        autoFocus
        className={`w-full rounded-lg border px-4 py-3 bg-neutral-800 font-mono text-neutral-100 outline-none ${isWrong ? 'border-red-500' : 'border-neutral-600 focus:border-neutral-400'}`}
        value={input}
        onChange={handleInput}
        disabled={!started ? false : finished}
        placeholder={started ? '' : 'Start typing to begin…'}
      />
    </div>
  )
}
```

- [ ] **Step 2: Create BossResult component**

```tsx
// components/boss/BossResult.tsx
import Link from 'next/link'

type Props = {
  won: boolean
  score: number
  goldEarned: number
  rareDrop: string | null
  skillPointsEarned: number
  chapterId: string
  onRetry: () => void
}

export function BossResult({ won, score, goldEarned, rareDrop, skillPointsEarned, chapterId, onRetry }: Props) {
  return (
    <div className="text-center space-y-6">
      <div>
        <p className="text-5xl">{won ? '🏆' : '💀'}</p>
        <h2 className="mt-3 text-2xl font-bold text-neutral-100">{won ? 'Victory!' : 'Defeated'}</h2>
        <p className="text-neutral-400 mt-1">Score: {score}</p>
      </div>

      <div className="rounded-lg border border-neutral-700 bg-neutral-900 p-4 space-y-2 text-sm">
        <div className="flex justify-between text-neutral-300">
          <span>Gold earned</span>
          <span className="text-amber-400 font-medium">+{goldEarned} 🪙</span>
        </div>
        {rareDrop && (
          <div className="flex justify-between text-neutral-300">
            <span>Rare drop</span>
            <span className="text-purple-400 font-medium">+1 {rareDrop} ✨</span>
          </div>
        )}
        {skillPointsEarned > 0 && (
          <div className="flex justify-between text-neutral-300">
            <span>Skill point</span>
            <span className="text-blue-400 font-medium">+{skillPointsEarned} ⚡</span>
          </div>
        )}
      </div>

      <div className="flex gap-3 justify-center">
        {!won && (
          <button onClick={onRetry} className="px-5 py-2 rounded-lg bg-neutral-700 text-neutral-100 hover:bg-neutral-600 font-medium">
            Try Again
          </button>
        )}
        <Link href={`/map/${chapterId}`} className="px-5 py-2 rounded-lg bg-neutral-800 text-neutral-100 hover:bg-neutral-700 font-medium">
          Back to Chapter
        </Link>
        <Link href="/village" className="px-5 py-2 rounded-lg bg-amber-700 text-white hover:bg-amber-600 font-medium">
          Go to Village
        </Link>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Create boss page shell**

```tsx
// app/(hub)/map/[chapterId]/boss/page.tsx
'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { getChapterDefinition, type ChapterId } from '@/lib/map/chapter-definitions'
import { BossSession } from '@/components/boss/BossSession'
import { BossResult } from '@/components/boss/BossResult'
import Link from 'next/link'

type BossResult = {
  won: boolean
  score: number
  goldEarned: number
  rareDrop: string | null
  skillPointsEarned: number
}

export default function BossPage() {
  const { chapterId } = useParams<{ chapterId: ChapterId }>()
  const [result, setResult] = useState<BossResult | null>(null)
  const [key, setKey] = useState(0)

  let chapter
  try {
    chapter = getChapterDefinition(chapterId)
  } catch {
    return <p className="p-8 text-neutral-400">Chapter not found.</p>
  }

  const bossNode = chapter.nodes.find((n) => n.type === 'boss')
  if (!bossNode) return <p className="p-8 text-neutral-400">No boss in this chapter.</p>

  function handleRetry() {
    setResult(null)
    setKey((k) => k + 1)
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-10 space-y-6">
      <div>
        <Link href={`/map/${chapterId}`} className="text-sm text-neutral-400 hover:text-neutral-200">← Chapter</Link>
        <h1 className="mt-2 text-xl font-bold text-neutral-100">{bossNode.title}</h1>
        <p className="text-sm text-neutral-400">Type as many words as you can in 60 seconds.</p>
      </div>

      {result ? (
        <BossResult
          {...result}
          chapterId={chapterId}
          onRetry={handleRetry}
        />
      ) : (
        <BossSession
          key={key}
          chapterId={chapterId}
          nodeId={bossNode.id}
          wordBank={bossNode.wordBank}
          onComplete={setResult}
        />
      )}
    </div>
  )
}
```

- [ ] **Step 4: Commit**

```bash
git add components/boss/BossSession.tsx components/boss/BossResult.tsx "app/(hub)/map/[chapterId]/boss/page.tsx"
git commit -m "feat: add boss fight session and result UI"
```

---

## Task 12: Village UI

**Files:**
- Create: `components/village/BuildingCard.tsx`
- Create: `app/(hub)/village/page.tsx`

- [ ] **Step 1: Create BuildingCard client component**

```tsx
// components/village/BuildingCard.tsx
'use client'

import { useState } from 'react'
import type { BuildingDefinition } from '@/lib/village/building-definitions'
import type { BuildingId } from '@/lib/village/building-definitions'

type Props = {
  building: BuildingDefinition
  currentLevel: number
  canUpgrade: boolean
  onUpgrade: (buildingId: BuildingId) => Promise<void>
}

const LEVEL_LABELS = ['Empty', 'Foundation', 'Established', 'Thriving', 'Flourishing']

export function BuildingCard({ building, currentLevel, canUpgrade, onUpgrade }: Props) {
  const [loading, setLoading] = useState(false)
  const nextTier = building.tiers[currentLevel]

  async function handleUpgrade() {
    setLoading(true)
    await onUpgrade(building.id)
    setLoading(false)
  }

  return (
    <div className="rounded-xl border border-neutral-700 bg-neutral-900 p-5 space-y-3">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-neutral-100">{building.name}</h3>
          <p className="text-xs text-neutral-400 mt-0.5">{building.description}</p>
        </div>
        <span className="text-xs text-neutral-500 shrink-0 ml-3">{LEVEL_LABELS[currentLevel] ?? 'Max'}</span>
      </div>

      {nextTier ? (
        <div className="rounded-lg border border-neutral-700 bg-neutral-800 p-3 text-sm space-y-1">
          <p className="text-neutral-300 font-medium">Next: {nextTier.label}</p>
          <p className="text-neutral-400 text-xs">{nextTier.unlocks}</p>
          <div className="flex gap-3 text-xs text-neutral-400 mt-1">
            <span>🪙 {nextTier.goldCost} gold</span>
            {nextTier.rareMaterialCost > 0 && (
              <span>✨ {nextTier.rareMaterialCost} {nextTier.rareMaterialType}</span>
            )}
          </div>
        </div>
      ) : (
        <p className="text-xs text-emerald-400">Fully upgraded</p>
      )}

      {nextTier && (
        <button
          onClick={handleUpgrade}
          disabled={!canUpgrade || loading}
          className={`w-full py-2 rounded-lg text-sm font-medium transition-colors ${
            canUpgrade && !loading
              ? 'bg-amber-700 hover:bg-amber-600 text-white'
              : 'bg-neutral-700 text-neutral-500 cursor-not-allowed'
          }`}
        >
          {loading ? 'Upgrading…' : canUpgrade ? 'Upgrade' : 'Not enough resources'}
        </button>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Create village page**

```tsx
// app/(hub)/village/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { buildingDefinitions } from '@/lib/village/building-definitions'
import type { BuildingId } from '@/lib/village/building-definitions'
import { BuildingCard } from '@/components/village/BuildingCard'
import { canUpgradeBuilding } from '@/lib/village/village-rules'

type VillageState = {
  gold: number
  rareMaterials: Record<string, number>
  buildingLevels: Record<string, number>
}

export default function VillagePage() {
  const [state, setState] = useState<VillageState | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/progress')
      .then((r) => r.json())
      .then((data) => {
        const p = data.progress
        setState({
          gold: p?.gold ?? 0,
          rareMaterials: p?.rareMaterials ?? {},
          buildingLevels: p?.buildingLevels ?? { townHall: 0, workshop: 0, tavern: 0 },
        })
        setLoading(false)
      })
  }, [])

  async function handleUpgrade(buildingId: BuildingId) {
    const res = await fetch('/api/village/upgrade', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ buildingId }),
    })
    if (res.ok) {
      const data = await res.json()
      setState((prev) => prev ? {
        ...prev,
        buildingLevels: { ...prev.buildingLevels, [buildingId]: data.newLevel },
      } : prev)
      // Refresh gold/resources
      const refresh = await fetch('/api/progress').then((r) => r.json())
      setState((prev) => prev ? {
        ...prev,
        gold: refresh.progress?.gold ?? prev.gold,
        rareMaterials: refresh.progress?.rareMaterials ?? prev.rareMaterials,
      } : prev)
    }
  }

  if (loading) return <div className="p-8 text-neutral-400">Loading village…</div>
  if (!state) return <div className="p-8 text-neutral-400">Could not load village.</div>

  const resources = { gold: state.gold, rareMaterials: state.rareMaterials }
  const buildingLevels = {
    townHall: state.buildingLevels.townHall ?? 0,
    workshop: state.buildingLevels.workshop ?? 0,
    tavern: state.buildingLevels.tavern ?? 0,
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-neutral-100">Your Village</h1>
        <div className="text-sm text-neutral-300 space-y-0.5 text-right">
          <div>🪙 {state.gold} gold</div>
          {Object.entries(state.rareMaterials).filter(([, v]) => v > 0).map(([k, v]) => (
            <div key={k}>✨ {v} {k}</div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {buildingDefinitions.map((building) => (
          <BuildingCard
            key={building.id}
            building={building}
            currentLevel={buildingLevels[building.id]}
            canUpgrade={canUpgradeBuilding(building.id, buildingLevels, resources)}
            onUpgrade={handleUpgrade}
          />
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add components/village/BuildingCard.tsx "app/(hub)/village/page.tsx"
git commit -m "feat: add village upgrade page and building cards"
```

---

## Task 13: Skill Tree UI

**Files:**
- Create: `components/skills/SkillTree.tsx`
- Create: `app/(hub)/skills/page.tsx`

- [ ] **Step 1: Create SkillTree client component**

```tsx
// components/skills/SkillTree.tsx
'use client'

import { useState } from 'react'
import { skillDefinitions, canUnlockSkill, type SkillId } from '@/lib/skills/skill-definitions'

type Props = {
  unlockedSkills: SkillId[]
  skillPoints: number
  onUnlock: (skillId: SkillId) => Promise<void>
}

export function SkillTree({ unlockedSkills: initial, skillPoints: initialPoints, onUnlock }: Props) {
  const [unlocked, setUnlocked] = useState<SkillId[]>(initial)
  const [points, setPoints] = useState(initialPoints)
  const [loading, setLoading] = useState<SkillId | null>(null)

  async function handleUnlock(skillId: SkillId) {
    setLoading(skillId)
    await onUnlock(skillId)
    const def = skillDefinitions.find((s) => s.id === skillId)!
    setUnlocked((prev) => [...prev, skillId])
    setPoints((p) => p - def.pointCost)
    setLoading(null)
  }

  const performance = skillDefinitions.filter((s) => s.branch === 'performance')
  const economy = skillDefinitions.filter((s) => s.branch === 'economy')

  function renderNode(skill: typeof skillDefinitions[0]) {
    const isUnlocked = unlocked.includes(skill.id)
    const canBuy = canUnlockSkill(skill.id, unlocked, points)
    const isLoading = loading === skill.id

    return (
      <div key={skill.id} className={`rounded-lg border p-3 space-y-1 ${isUnlocked ? 'border-blue-700 bg-blue-950' : canBuy ? 'border-neutral-600 bg-neutral-800' : 'border-neutral-700 bg-neutral-900 opacity-60'}`}>
        <p className="font-medium text-sm text-neutral-100">{skill.name}</p>
        <p className="text-xs text-neutral-400">{skill.description}</p>
        <p className="text-xs text-neutral-500">{skill.pointCost} pt{skill.pointCost > 1 ? 's' : ''}</p>
        {!isUnlocked && (
          <button
            disabled={!canBuy || !!loading}
            onClick={() => handleUnlock(skill.id)}
            className={`mt-1 w-full py-1 rounded text-xs font-medium ${canBuy && !loading ? 'bg-blue-700 hover:bg-blue-600 text-white' : 'bg-neutral-700 text-neutral-500 cursor-not-allowed'}`}
          >
            {isLoading ? '…' : isUnlocked ? 'Unlocked' : 'Unlock'}
          </button>
        )}
        {isUnlocked && <p className="text-xs text-blue-400 pt-1">✓ Active</p>}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-sm text-neutral-300">⚡ {points} skill point{points !== 1 ? 's' : ''} available</div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wide">Performance</p>
          {performance.map(renderNode)}
        </div>
        <div className="space-y-2">
          <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wide">Economy</p>
          {economy.map(renderNode)}
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Create skills page**

```tsx
// app/(hub)/skills/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { SkillTree } from '@/components/skills/SkillTree'
import type { SkillId } from '@/lib/skills/skill-definitions'

export default function SkillsPage() {
  const [data, setData] = useState<{ unlockedSkills: SkillId[]; skillPoints: number } | null>(null)

  useEffect(() => {
    fetch('/api/progress')
      .then((r) => r.json())
      .then((d) => setData({
        unlockedSkills: (d.progress?.unlockedSkills ?? []) as SkillId[],
        skillPoints: d.progress?.skillPoints ?? 0,
      }))
  }, [])

  async function handleUnlock(skillId: SkillId) {
    await fetch('/api/skills/unlock', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ skillId }),
    })
  }

  if (!data) return <div className="p-8 text-neutral-400">Loading skills…</div>

  return (
    <div className="max-w-xl mx-auto px-4 py-10 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-100">Skill Tree</h1>
        <p className="text-sm text-neutral-400 mt-1">Earn skill points by defeating bosses. Spend them to strengthen your runs.</p>
      </div>
      <SkillTree
        unlockedSkills={data.unlockedSkills}
        skillPoints={data.skillPoints}
        onUnlock={handleUnlock}
      />
    </div>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add components/skills/SkillTree.tsx "app/(hub)/skills/page.tsx"
git commit -m "feat: add skill tree page and interactive skill node UI"
```

---

## Task 14: Navigation + Redirects

**Files:**
- Modify: `components/layout/app-shell.tsx`
- Create: `app/(hub)/map/layout.tsx` (redirect for /home)

- [ ] **Step 1: Read the current app-shell nav links**

Open `components/layout/app-shell.tsx` and find the nav link list. Add Map, Village, and Skills:

```tsx
// In the nav links array, add:
{ href: '/map', label: 'Map' },
{ href: '/village', label: 'Village' },
{ href: '/skills', label: 'Skills' },
```

The exact position and JSX depends on the current structure — add them after any existing navigation items.

- [ ] **Step 2: Add redirect from /home to /map**

Open `app/(hub)/home/page.tsx`. Add at the top of the component:

```tsx
import { redirect } from 'next/navigation'
// Inside the component, before any render:
redirect('/map')
```

Or if it's a server component, simply:

```tsx
// app/(hub)/home/page.tsx
import { redirect } from 'next/navigation'
export default function HomePage() {
  redirect('/map')
}
```

- [ ] **Step 3: Verify navigation works**

```bash
npm run dev
```

Visit `http://localhost:3000/map` — should show the adventure map.
Visit `http://localhost:3000/village` — should show the village.
Visit `http://localhost:3000/skills` — should show the skill tree.
Visit `http://localhost:3000/home` — should redirect to `/map`.

- [ ] **Step 4: Run the full test suite**

```bash
npx vitest run
```

Expected: all existing tests pass, plus new resource/map/boss/village/skill tests pass.

- [ ] **Step 5: Commit**

```bash
git add components/layout/app-shell.tsx "app/(hub)/home/page.tsx"
git commit -m "feat: add Map/Village/Skills nav links and redirect /home to /map"
```

---

## Self-Review

**Spec coverage check:**
- ✅ Adventure map with 2 chapters (6 lesson nodes + 2 boss nodes) — Task 2, 10
- ✅ Boss fight 60s gauntlet with win/lose logic and loot — Task 5, 11
- ✅ Village with 3 buildings, tiers 1–2 — Task 6, 12
- ✅ 2 resource types (gold + stone/timber) — Task 3, 8
- ✅ Skill tree both branches, all 6 nodes — Task 7, 13
- ✅ Persistent state via Prisma — Task 1, 8, 9
- ✅ Skill effects applied in API routes — Task 9 (boss route applies `applySkillsToBossScore`)
- ✅ Replay gold penalty — Task 3 (`computeLessonGold` with `isFirstClear`)
- ✅ Chapter unlock via building level — Task 4, 6
- ✅ Skill point per chapter cleared — Task 9 (`recordBossAttempt`)
- ✅ `/api/progress` reused by village and skills pages to read state — Tasks 12, 13

**Type consistency check:**
- `ChapterId` defined in `chapter-definitions.ts`, imported in `boss-rules.ts`, `resource-rules.ts`, `rpg-progress.ts`, API routes — consistent
- `BuildingLevels` defined in `map-rules.ts`, imported in `village-rules.ts`, `rpg-progress.ts` — consistent
- `SkillId` defined in `skill-definitions.ts`, imported in `skill-effects.ts`, `rpg-progress.ts` — consistent
- `canUpgradeBuilding` signature matches usage in village page — consistent

**Placeholder scan:** None found. All steps include real code.
