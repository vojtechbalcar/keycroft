# Village World Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild Keycroft's hub around a pixel-art RPG world map where each village teaches a specific set of keyboard keys and unlocks progressively through a mastery system.

**Architecture:** Pure-TypeScript lib layer (village definitions, mastery rules, world projection) feeds deterministic state into React components. All mastery stored in `GuestProgress.villageMastery` in localStorage — no server changes required. Two new routes: `/world` (world map hub) and `/world/[villageId]` (village lesson screen).

**Tech Stack:** Next.js 16 App Router, React, TypeScript, Tailwind CSS v4, Vitest. No new npm dependencies — CSS pixel art, emoji icons, Google Fonts via `next/font`.

---

## File Map

**Create:**
- `lib/world/village-definitions.ts` — VillageId type, VillageDefinition type, villageDefinitions array, helper functions
- `lib/world/mastery-rules.ts` — computeMasteryGain, applyMasteryGain, MASTERY_UNLOCK_THRESHOLD
- `lib/world/project-world.ts` — VillageState type, VillageProjection type, WorldState type, projectWorld()
- `content/villages/meadow-farm.ts` — lessons + word bank for village 1
- `content/villages/fishing-docks.ts` — lessons + word bank for village 2
- `content/villages/mountain-mine.ts` — lessons + word bank for village 3
- `content/villages/forest-watch.ts` — lessons + word bank for village 4
- `content/villages/desert-market.ts` — lessons + word bank for village 5
- `content/villages/volcano-forge.ts` — lessons + word bank for village 6
- `components/world/mastery-bar.tsx` — horizontal mastery progress bar
- `components/world/village-marker.tsx` — map pin: emoji + label + mastery bar
- `components/world/world-map.tsx` — RPG overhead map with SVG paths + markers
- `components/world/village-scene.tsx` — CSS pixel-art backdrop for village screen
- `components/world/session-reward.tsx` — post-session overlay with stats + unlock banner
- `app/(hub)/world/page.tsx` — world map hub page
- `app/(hub)/world/[villageId]/page.tsx` — village lesson + typing page
- `tests/world/mastery-rules.test.ts`
- `tests/world/project-world.test.ts`

**Modify:**
- `lib/storage/guest-progress.ts` — add `villageMastery` field + `recordVillageMasteryGain()`
- `app/(hub)/home/page.tsx` — replace content with redirect to `/world`
- `app/globals.css` — add `@import url(Press Start 2P font)` via next/font in layout instead

---

## Task 1: Village definitions lib layer

**Files:**
- Create: `lib/world/village-definitions.ts`

- [ ] Create `lib/world/village-definitions.ts` with the following complete content:

```typescript
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
  const current = getVillageDefinition(id)
  const next = villageDefinitions.find((v) => v.prevVillageId === id)
  return next?.id ?? null
}
```

- [ ] Verify it type-checks:
```bash
cd /Users/vojtechbalcar/Documents/claudeProjects/typingWithAllTen
npx tsc --noEmit 2>&1 | grep "village-definitions"
```
Expected: no output (no errors).

- [ ] Commit:
```bash
git add lib/world/village-definitions.ts
git commit -m "feat: add village definitions (6 villages, types, helpers)"
```

---

## Task 2: Mastery rules (TDD)

**Files:**
- Create: `lib/world/mastery-rules.ts`
- Create: `tests/world/mastery-rules.test.ts`

- [ ] Write the failing tests first in `tests/world/mastery-rules.test.ts`:

```typescript
import { describe, it, expect } from 'vitest'
import {
  computeMasteryGain,
  applyMasteryGain,
  MASTERY_UNLOCK_THRESHOLD,
  MASTERY_MAX,
} from '@/lib/world/mastery-rules'

describe('mastery rules', () => {
  it('awards 8 points for a clean session (accuracy >= 95)', () => {
    expect(computeMasteryGain({ accuracy: 97 })).toBe(8)
    expect(computeMasteryGain({ accuracy: 95 })).toBe(8)
  })

  it('awards 5 points for a solid session (accuracy 85–94)', () => {
    expect(computeMasteryGain({ accuracy: 90 })).toBe(5)
    expect(computeMasteryGain({ accuracy: 85 })).toBe(5)
  })

  it('awards 2 points for any completed session below 85', () => {
    expect(computeMasteryGain({ accuracy: 70 })).toBe(2)
    expect(computeMasteryGain({ accuracy: 50 })).toBe(2)
  })

  it('caps mastery at MASTERY_MAX', () => {
    expect(applyMasteryGain(96, 8)).toBe(MASTERY_MAX)
    expect(applyMasteryGain(100, 8)).toBe(MASTERY_MAX)
  })

  it('never decreases mastery', () => {
    expect(applyMasteryGain(50, 0)).toBe(50)
  })

  it('exports MASTERY_UNLOCK_THRESHOLD as 80', () => {
    expect(MASTERY_UNLOCK_THRESHOLD).toBe(80)
  })
})
```

- [ ] Run to confirm it fails:
```bash
node_modules/.bin/vitest run tests/world/mastery-rules.test.ts 2>&1 | tail -8
```
Expected: FAIL — `Cannot find module '@/lib/world/mastery-rules'`

- [ ] Create `lib/world/mastery-rules.ts`:

```typescript
export const MASTERY_UNLOCK_THRESHOLD = 80
export const MASTERY_MAX = 100

export function computeMasteryGain(metrics: { accuracy: number }): number {
  if (metrics.accuracy >= 95) return 8
  if (metrics.accuracy >= 85) return 5
  return 2
}

export function applyMasteryGain(current: number, gain: number): number {
  return Math.min(MASTERY_MAX, current + gain)
}
```

- [ ] Run tests to confirm they pass:
```bash
node_modules/.bin/vitest run tests/world/mastery-rules.test.ts 2>&1 | tail -5
```
Expected: `Tests  6 passed`

- [ ] Commit:
```bash
git add lib/world/mastery-rules.ts tests/world/mastery-rules.test.ts
git commit -m "feat: add mastery rules with TDD"
```

---

## Task 3: World projection (TDD)

**Files:**
- Create: `lib/world/project-world.ts`
- Create: `tests/world/project-world.test.ts`

- [ ] Write the failing tests in `tests/world/project-world.test.ts`:

```typescript
import { describe, it, expect } from 'vitest'
import { projectWorld } from '@/lib/world/project-world'
import { createEmptyGuestProgress } from '@/lib/storage/guest-progress'

function makeProgress(overrides: Record<string, unknown> = {}) {
  return {
    ...createEmptyGuestProgress(),
    placement: { phaseId: 'lantern', phaseName: 'Lantern Room', summary: '', recommendedFocus: '', reason: '', selfRating: null, metrics: { wpm: 20, accuracy: 90, correctedErrors: 0 } },
    ...overrides,
  }
}

describe('projectWorld', () => {
  it('meadow-farm is always active even with no progress', () => {
    const state = projectWorld(makeProgress())
    const meadow = state.villages.find((v) => v.definition.id === 'meadow-farm')!
    expect(meadow.state).toBe('active')
  })

  it('fishing-docks is locked until meadow-farm reaches 80 mastery', () => {
    const state = projectWorld(makeProgress({ villageMastery: { 'meadow-farm': 50 } }))
    const docks = state.villages.find((v) => v.definition.id === 'fishing-docks')!
    expect(docks.state).toBe('locked')
  })

  it('fishing-docks is active when meadow-farm mastery >= 80', () => {
    const state = projectWorld(makeProgress({ villageMastery: { 'meadow-farm': 80 } }))
    const docks = state.villages.find((v) => v.definition.id === 'fishing-docks')!
    expect(docks.state).toBe('active')
  })

  it('a village at mastery 80 is flourishing', () => {
    const state = projectWorld(makeProgress({ villageMastery: { 'meadow-farm': 80 } }))
    const meadow = state.villages.find((v) => v.definition.id === 'meadow-farm')!
    expect(meadow.state).toBe('flourishing')
  })

  it('a village at mastery 100 is complete', () => {
    const state = projectWorld(makeProgress({ villageMastery: { 'meadow-farm': 100 } }))
    const meadow = state.villages.find((v) => v.definition.id === 'meadow-farm')!
    expect(meadow.state).toBe('complete')
  })

  it('currentVillageId is the first non-complete active village', () => {
    const state = projectWorld(makeProgress({ villageMastery: { 'meadow-farm': 100, 'fishing-docks': 20 } }))
    expect(state.currentVillageId).toBe('fishing-docks')
  })

  it('totalMastery is the average across all 6 villages', () => {
    const state = projectWorld(makeProgress({ villageMastery: { 'meadow-farm': 60 } }))
    expect(state.totalMastery).toBe(10) // 60 / 6 = 10
  })

  it('returns all 6 villages in order', () => {
    const state = projectWorld(makeProgress())
    expect(state.villages).toHaveLength(6)
    expect(state.villages[0].definition.id).toBe('meadow-farm')
    expect(state.villages[5].definition.id).toBe('volcano-forge')
  })
})
```

- [ ] Run to confirm it fails:
```bash
node_modules/.bin/vitest run tests/world/project-world.test.ts 2>&1 | tail -5
```
Expected: FAIL — `Cannot find module '@/lib/world/project-world'`

- [ ] Create `lib/world/project-world.ts`:

```typescript
import type { GuestProgress } from '@/lib/storage/guest-progress'
import {
  villageDefinitions,
  type VillageId,
  type VillageDefinition,
} from '@/lib/world/village-definitions'
import { MASTERY_UNLOCK_THRESHOLD, MASTERY_MAX } from '@/lib/world/mastery-rules'

export type VillageState = 'locked' | 'active' | 'flourishing' | 'complete'

export type VillageProjection = {
  definition: VillageDefinition
  mastery: number
  state: VillageState
  isCurrentVillage: boolean
}

export type WorldState = {
  villages: VillageProjection[]
  currentVillageId: VillageId
  totalMastery: number
}

function computeVillageState(
  def: VillageDefinition,
  mastery: number,
  villageMastery: Partial<Record<VillageId, number>>,
): VillageState {
  if (def.prevVillageId !== null) {
    const prevMastery = villageMastery[def.prevVillageId] ?? 0
    if (prevMastery < def.unlockThreshold) return 'locked'
  }
  if (mastery >= MASTERY_MAX) return 'complete'
  if (mastery >= MASTERY_UNLOCK_THRESHOLD) return 'flourishing'
  return 'active'
}

export function projectWorld(progress: GuestProgress): WorldState {
  const villageMastery = progress.villageMastery ?? {}

  const projections: VillageProjection[] = villageDefinitions.map((def) => {
    const mastery = villageMastery[def.id] ?? 0
    const state = computeVillageState(def, mastery, villageMastery)
    return { definition: def, mastery, state, isCurrentVillage: false }
  })

  // Current village = first active or flourishing (not complete)
  const currentProjection =
    projections.find((p) => p.state === 'active' || p.state === 'flourishing') ??
    projections[0]
  currentProjection.isCurrentVillage = true

  const totalMastery = Math.round(
    projections.reduce((sum, p) => sum + p.mastery, 0) / projections.length,
  )

  return {
    villages: projections,
    currentVillageId: currentProjection.definition.id,
    totalMastery,
  }
}
```

- [ ] Run tests to confirm they pass:
```bash
node_modules/.bin/vitest run tests/world/mastery-rules.test.ts tests/world/project-world.test.ts 2>&1 | tail -5
```
Expected: `Tests  14 passed`

- [ ] Commit:
```bash
git add lib/world/project-world.ts tests/world/project-world.test.ts
git commit -m "feat: add world projection with unlock logic (TDD)"
```

---

## Task 4: Migrate GuestProgress to include villageMastery

**Files:**
- Modify: `lib/storage/guest-progress.ts`

- [ ] Add the `VillageId` import and `villageMastery` field to `guest-progress.ts`. Open the file and make these exact changes:

Add this import at the top (after existing imports):
```typescript
import type { VillageId } from '@/lib/world/village-definitions'
```

Add `villageMastery` to the `GuestProgress` type:
```typescript
export type GuestProgress = {
  currentPhaseId: PhaseId | null
  placement: PlacementResult | null
  events: ProgressEvent[]
  recentSessions: StoredSessionSummary[]
  completedChapterIds: string[]
  villageMastery: Partial<Record<VillageId, number>>
}
```

Update `createEmptyGuestProgress`:
```typescript
export function createEmptyGuestProgress(): GuestProgress {
  return {
    currentPhaseId: null,
    placement: null,
    events: [],
    recentSessions: [],
    completedChapterIds: [],
    villageMastery: {},
  }
}
```

Update `readGuestProgress` — the spread already handles defaults, but add `villageMastery` explicitly after `completedChapterIds`:
```typescript
export function readGuestProgress(storage: StorageLike): GuestProgress {
  const raw = storage.getItem(guestProgressStorageKey)
  if (!raw) return createEmptyGuestProgress()
  const parsed = JSON.parse(raw) as Partial<GuestProgress>
  return {
    ...createEmptyGuestProgress(),
    ...parsed,
    completedChapterIds: parsed.completedChapterIds ?? [],
    villageMastery: parsed.villageMastery ?? {},
  }
}
```

Add a new function at the bottom of the file:
```typescript
export function recordVillageMasteryGain(
  progress: GuestProgress,
  villageId: VillageId,
  gain: number,
): GuestProgress {
  const current = progress.villageMastery[villageId] ?? 0
  const next = Math.min(100, current + gain)
  return {
    ...progress,
    villageMastery: {
      ...progress.villageMastery,
      [villageId]: next,
    },
  }
}
```

- [ ] Verify the existing storage tests still pass (they create GuestProgress objects):
```bash
node_modules/.bin/vitest run tests/storage/ 2>&1 | tail -5
```
Expected: all tests pass.

- [ ] Typecheck:
```bash
npx tsc --noEmit 2>&1 | grep -v node_modules | head -20
```
Expected: no errors in project files.

- [ ] Commit:
```bash
git add lib/storage/guest-progress.ts
git commit -m "feat: add villageMastery to GuestProgress + recordVillageMasteryGain"
```

---

## Task 5: Village content — all 6 word banks and lessons

**Files:**
- Create: `content/villages/meadow-farm.ts`
- Create: `content/villages/fishing-docks.ts`
- Create: `content/villages/mountain-mine.ts`
- Create: `content/villages/forest-watch.ts`
- Create: `content/villages/desert-market.ts`
- Create: `content/villages/volcano-forge.ts`

First, create the shared type (add a single type at the top of the first file, then import it in the others — or inline it since TypeScript structural typing means it doesn't need to be a shared import):

- [ ] Create `content/villages/meadow-farm.ts`:

```typescript
export type VillageLesson = {
  id: string
  label: string
  focus: string
  goal: string
  text: string
}

export type VillageContent = {
  lessons: VillageLesson[]
  capstone: VillageLesson
  wordBank: string[]
}

export const meadowFarm: VillageContent = {
  lessons: [
    {
      id: 'meadow-farm-l01',
      label: 'First Furrow',
      focus: 'home row — left hand (asdf)',
      goal: 'Find the home keys without looking.',
      text: 'a sad dad asks fall glass flask lass dads fads',
    },
    {
      id: 'meadow-farm-l02',
      label: 'Even Ground',
      focus: 'home row — right hand (jkl;)',
      goal: 'Let the right hand settle into its keys.',
      text: 'jkl; hall lash fall skull all jak kill lull; lads',
    },
    {
      id: 'meadow-farm-l03',
      label: 'Full Row',
      focus: 'home row — both hands together',
      goal: 'Keep both hands calm and unhurried.',
      text: 'ask a lad; fall all jaks; a sad flask shall last',
    },
  ],
  capstone: {
    id: 'meadow-farm-capstone',
    label: 'Harvest Check',
    focus: 'home row rhythm',
    goal: 'Prove the home row feels natural at a gentle pace.',
    text: 'a glad lad shall ask a lass; all fall tasks shall last a full season',
  },
  wordBank: [
    'calm hands build quiet speed',
    'soft steps keep the field alive',
    'a slow harvest fills the barn',
    'the lark asks for a still lake',
    'all hands fall still at dusk',
    'a flask of dark ale; a glad fire',
    'fall grass; dusk; a last flask',
    'ask the lads; all shall fall still',
    'glad hands shall keep a full shelf',
    'a sad fall shall ask a dark flask',
  ],
}
```

- [ ] Create `content/villages/fishing-docks.ts`:

```typescript
import type { VillageContent } from './meadow-farm'

export const fishingDocks: VillageContent = {
  lessons: [
    {
      id: 'fishing-docks-l01',
      label: 'Cast Off',
      focus: 'g and h — the central bridge keys',
      goal: 'Find g and h without drifting off the home row.',
      text: 'glad high gash half glad hash hag; hall had glad high',
    },
    {
      id: 'fishing-docks-l02',
      label: 'High Tide',
      focus: 't and y — the upper reach',
      goal: 'Stretch to t and y and return cleanly each time.',
      text: 'tall lath that halt thy light they lift; take thy tall lath',
    },
    {
      id: 'fishing-docks-l03',
      label: 'Haul the Net',
      focus: 'g h t y together',
      goal: 'Move between all four reach keys without hesitation.',
      text: 'the high light that thy glad gust; halt thy haste; light the gale',
    },
  ],
  capstone: {
    id: 'fishing-docks-capstone',
    label: 'Harbour Call',
    focus: 'full reach row mixed with home row',
    goal: 'Hold clean rhythm through the trickiest reach combinations.',
    text: 'the tall grey tide shall lift thy glad heart; half the light that falls shall last',
  },
  wordBank: [
    'the grey tide lifts the hull',
    'haul the net at half light',
    'the harbour light stays all night',
    'a glad gull at the high jetty',
    'thy salt hands yet hold the line',
    'the high swell lifts the trawl',
    'light that falls flat; a grey gust',
    'halt thy haste; take thy time',
    'the flag that flies high at the hull',
    'a grey day; a glad tide; a high haul',
  ],
}
```

- [ ] Create `content/villages/mountain-mine.ts`:

```typescript
import type { VillageContent } from './meadow-farm'

export const mountainMine: VillageContent = {
  lessons: [
    {
      id: 'mountain-mine-l01',
      label: 'Break Ground',
      focus: 'b and n — lower reach keys',
      goal: 'Find b and n cleanly, return to home row each time.',
      text: 'ban bind burn blank noble bane brand blank burn; ban bin',
    },
    {
      id: 'mountain-mine-l02',
      label: 'Upper Seam',
      focus: 'q w e r p — upper row',
      goal: 'Reach up without lifting your wrists off the desk.',
      text: 'wear reap wrap pew quart prawn; weep pour wrap quart',
    },
    {
      id: 'mountain-mine-l03',
      label: 'Full Vein',
      focus: 'b n q w e r p all together',
      goal: 'Navigate the outer reaches without losing home row.',
      text: 'break the wall; burn bright; wrap the rope; pour water near',
    },
  ],
  capstone: {
    id: 'mountain-mine-capstone',
    label: 'Iron Bloom',
    focus: 'outer reaches under sustained pressure',
    goal: 'Hold accuracy through a longer sentence of outer-reach keys.',
    text: 'beneath the bare peak the burned rope; break the wall and pour the water near the iron bloom',
  },
  wordBank: [
    'break the rock beneath the peak',
    'burn bright in the narrow vein',
    'the rope runs deep below the wall',
    'pour the water; break the burn',
    'near the peak; wrap the bare beam',
    'the iron bloom burns at the wall',
    'beneath the burn; a blank peak',
    'wrap the brand; pour the brew',
    'wear the rope; burn the ruin near',
    'a proud peak; a burnt wall; an open vein',
  ],
}
```

- [ ] Create `content/villages/forest-watch.ts`:

```typescript
import type { VillageContent } from './meadow-farm'

export const forestWatch: VillageContent = {
  lessons: [
    {
      id: 'forest-watch-l01',
      label: 'First Count',
      focus: 'number row 1–5',
      goal: 'Find the left side of the number row without looking.',
      text: '1 2 3 4 5 12 34 123 45 13 24 51 342 12345 1 2 3 4 5',
    },
    {
      id: 'forest-watch-l02',
      label: 'High Tally',
      focus: 'number row 6–0',
      goal: 'Find the right side of the number row without looking.',
      text: '6 7 8 9 0 67 89 90 78 60 789 890 6789 0 67 80 9 60 70',
    },
    {
      id: 'forest-watch-l03',
      label: 'Full Record',
      focus: 'full number row mixed',
      goal: 'Move across the entire number row without pausing.',
      text: '1234567890 10 25 36 47 89 100 305 1990 2048 0 999 12 80 456',
    },
  ],
  capstone: {
    id: 'forest-watch-capstone',
    label: 'Ancient Ledger',
    focus: 'numbers in meaningful context',
    goal: 'Type a log entry mixing numbers and words at a steady pace.',
    text: 'the watch recorded 34 pines on day 17 of month 8; 102 birds at the ridge by 9am; total: 1 clear day',
  },
  wordBank: [
    'the watch recorded 7 clear days',
    '34 pines fell in the first storm',
    'the count reached 100 by noon',
    '9 birds at the ridge; 0 at the lake',
    'day 15: still 3 unknown paths',
    'the ledger: 2048 marks; 1 page left',
    'total 57 trees; 12 paths; 1 bridge',
    '100 years; 365 days; 1 watch',
    'the 9th hour; the 3rd gate; the 1st path',
    '0 errors; 5 sessions; 80 points earned',
  ],
}
```

- [ ] Create `content/villages/desert-market.ts`:

```typescript
import type { VillageContent } from './meadow-farm'

export const desertMarket: VillageContent = {
  lessons: [
    {
      id: 'desert-market-l01',
      label: 'First Stall',
      focus: 'comma, period, colon, semicolon',
      goal: 'Hit punctuation marks cleanly without slowing.',
      text: 'salt, oil, grain: three staples. ask; take; pay. fair, fast, clean.',
    },
    {
      id: 'desert-market-l02',
      label: 'Market Sign',
      focus: '! @ # and other symbols',
      goal: 'Reach symbol keys without losing your place on the home row.',
      text: 'price: 3! ask @market. #fresh goods; buy now! salt@rate. #deal!',
    },
    {
      id: 'desert-market-l03',
      label: 'Trade Shorthand',
      focus: 'parentheses, quotes, and mixed symbols',
      goal: 'Open and close brackets and quotes without hesitation.',
      text: '"fair price" (ask first); "salt" costs (3 gold). take it, or leave.',
    },
  ],
  capstone: {
    id: 'desert-market-capstone',
    label: 'The Full Invoice',
    focus: 'all punctuation and symbols in context',
    goal: 'Type a short market record with clean symbol accuracy.',
    text: 'item: "salt" (3 bags) @ 2 gold each; total: 6! note: buy more grain. #laststock',
  },
  wordBank: [
    '"fair price" — ask before you buy',
    'salt, oil, grain: three staples',
    'price: 3 gold (negotiable)',
    '#fresh goods; first come, first served!',
    'ask @market before 9am; no refunds.',
    '"the deal" (short): pay now, carry later',
    'note: 5 bags left! buy: salt, grain.',
    'total cost: (3 + 2) = 5 gold pieces',
    '"all trades final" — no exceptions!',
    'item #7: rare spice @ 10 gold. ask.',
  ],
}
```

- [ ] Create `content/villages/volcano-forge.ts`:

```typescript
import type { VillageContent } from './meadow-farm'

export const volcanoForge: VillageContent = {
  lessons: [
    {
      id: 'volcano-forge-l01',
      label: 'Stoke the Flame',
      focus: 'full keyboard — prose at speed',
      goal: 'Type a varied sentence cleanly without slowing on any key.',
      text: 'the forge burns brightest when the hands work without thought; rhythm is the master key.',
    },
    {
      id: 'volcano-forge-l02',
      label: 'The Crucible',
      focus: 'full keyboard — mixed case, symbols, numbers',
      goal: 'Hold accuracy through capital letters, numbers, and symbols.',
      text: 'On day 7, the forge reached 1200°C. "Now!" she said — pour the iron; shape it fast.',
    },
    {
      id: 'volcano-forge-l03',
      label: 'Full Heat',
      focus: 'full keyboard — accuracy under speed pressure',
      goal: 'Push your speed while keeping accuracy above 90%.',
      text: 'the quickest hands belong to those who never rush: calm, clean, deliberate — every stroke a choice.',
    },
  ],
  capstone: {
    id: 'volcano-forge-capstone',
    label: 'Master Strike',
    focus: 'full keyboard mastery',
    goal: 'Type the forge oath cleanly — the final test.',
    text: 'I have walked every path: farm, dock, mine, forest, and market. the forge asks only this — type without fear.',
  },
  wordBank: [
    'the forge burns at the mountain root',
    'rhythm is the master key to speed',
    'calm hands shape the hardest iron',
    'pour the metal; wait; then strike',
    'the anvil does not care for haste',
    'every stroke costs; every clean run earns',
    'the quickest route is never the rushed one',
    '"steady," she said. "the iron remembers."',
    'the whole keyboard: one instrument',
    'mastery is just calm repeated enough times',
  ],
}
```

- [ ] Verify no TypeScript errors in the content files:
```bash
npx tsc --noEmit 2>&1 | grep "content/villages" | head -10
```
Expected: no output.

- [ ] Commit:
```bash
git add content/villages/
git commit -m "feat: add village content (word banks + lessons for all 6 villages)"
```

---

## Task 6: MasteryBar and VillageMarker components

**Files:**
- Create: `components/world/mastery-bar.tsx`
- Create: `components/world/village-marker.tsx`

- [ ] Create `components/world/mastery-bar.tsx`:

```tsx
type MasteryBarProps = {
  mastery: number   // 0–100
  accent: string    // CSS colour for the fill
  showLabel?: boolean
}

export function MasteryBar({ mastery, accent, showLabel = false }: MasteryBarProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, width: '100%' }}>
      {showLabel && (
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'rgba(255,255,255,0.6)' }}>
          <span>Mastery</span>
          <span>{mastery}/100</span>
        </div>
      )}
      <div
        style={{
          width: '100%',
          height: 6,
          background: 'rgba(255,255,255,0.12)',
          borderRadius: 3,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${mastery}%`,
            height: '100%',
            background: accent,
            borderRadius: 3,
            transition: 'width 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        />
      </div>
    </div>
  )
}
```

- [ ] Create `components/world/village-marker.tsx`:

```tsx
import Link from 'next/link'
import type { VillageProjection } from '@/lib/world/project-world'
import { MasteryBar } from './mastery-bar'

const STATE_ICONS: Record<string, string> = {
  locked: '🔒',
  active: '⚡',
  flourishing: '🌿',
  complete: '⭐',
}

type VillageMarkerProps = {
  projection: VillageProjection
}

export function VillageMarker({ projection }: VillageMarkerProps) {
  const { definition, mastery, state, isCurrentVillage } = projection
  const isClickable = state !== 'locked'

  const markerContent = (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 6,
        width: 90,
        opacity: state === 'locked' ? 0.35 : 1,
        filter: state === 'locked' ? 'grayscale(0.9)' : 'none',
        cursor: isClickable ? 'pointer' : 'default',
        transition: 'opacity 0.3s',
      }}
    >
      {/* Village icon */}
      <div
        style={{
          fontSize: '2.2rem',
          lineHeight: 1,
          padding: '6px 8px',
          borderRadius: 8,
          border: isCurrentVillage
            ? '2px solid #f5c842'
            : '2px solid rgba(255,255,255,0.15)',
          background: isCurrentVillage
            ? 'rgba(245,200,66,0.15)'
            : 'rgba(0,0,0,0.3)',
          imageRendering: 'pixelated',
          boxShadow: isCurrentVillage ? '0 0 16px rgba(245,200,66,0.4)' : 'none',
          transition: 'all 0.3s',
        }}
      >
        {state === 'locked' ? '🔒' : definition.emoji}
      </div>

      {/* State badge + name */}
      <div style={{ textAlign: 'center' }}>
        <div
          style={{
            fontSize: '0.6rem',
            color: 'rgba(255,255,255,0.5)',
            marginBottom: 2,
            letterSpacing: '0.05em',
          }}
        >
          {STATE_ICONS[state]} {state.toUpperCase()}
        </div>
        <div
          style={{
            fontSize: '0.65rem',
            fontWeight: 700,
            color: isCurrentVillage ? '#f5c842' : '#f4efe4',
            lineHeight: 1.3,
          }}
        >
          {definition.name}
        </div>
      </div>

      {/* Mastery bar — only for unlocked villages */}
      {state !== 'locked' && (
        <MasteryBar mastery={mastery} accent={definition.palette.accent} />
      )}
    </div>
  )

  if (!isClickable) return markerContent

  return (
    <Link href={`/world/${definition.id}`} style={{ textDecoration: 'none' }}>
      {markerContent}
    </Link>
  )
}
```

- [ ] Typecheck:
```bash
npx tsc --noEmit 2>&1 | grep -E "mastery-bar|village-marker" | head -10
```
Expected: no output.

- [ ] Commit:
```bash
git add components/world/mastery-bar.tsx components/world/village-marker.tsx
git commit -m "feat: add MasteryBar and VillageMarker components"
```

---

## Task 7: WorldMap component

**Files:**
- Create: `components/world/world-map.tsx`

The map uses absolute positioning inside a relative container. Village positions are expressed as percentages. SVG `<line>` elements draw the paths between connected villages.

- [ ] Create `components/world/world-map.tsx`:

```tsx
import type { WorldState } from '@/lib/world/project-world'
import type { VillageId } from '@/lib/world/village-definitions'
import { VillageMarker } from './village-marker'

// Position of each village marker on the map (left%, top% of container)
const VILLAGE_POSITIONS: Record<VillageId, { left: string; top: string }> = {
  'meadow-farm':    { left: '8%',  top: '48%' },
  'fishing-docks':  { left: '32%', top: '35%' },
  'mountain-mine':  { left: '58%', top: '35%' },
  'forest-watch':   { left: '58%', top: '10%' },
  'desert-market':  { left: '32%', top: '62%' },
  'volcano-forge':  { left: '8%',  top: '62%' },
}

// Paths: [from, to] — only drawn if the "to" village is unlocked
const PATHS: [VillageId, VillageId][] = [
  ['meadow-farm',   'fishing-docks'],
  ['fishing-docks', 'mountain-mine'],
  ['mountain-mine', 'forest-watch'],
  ['mountain-mine', 'desert-market'],
  ['desert-market', 'volcano-forge'],
]

type WorldMapProps = {
  worldState: WorldState
}

export function WorldMap({ worldState }: WorldMapProps) {
  // Build a lookup for quick access
  const projectionByIdMap = new Map(
    worldState.villages.map((p) => [p.definition.id, p]),
  )

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        background: 'radial-gradient(ellipse at 40% 40%, #1a3020 0%, #0d1a10 100%)',
        borderRadius: 16,
        overflow: 'hidden',
      }}
    >
      {/* Parchment texture overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `
            repeating-linear-gradient(
              0deg,
              transparent,
              transparent 40px,
              rgba(255,255,255,0.02) 40px,
              rgba(255,255,255,0.02) 41px
            ),
            repeating-linear-gradient(
              90deg,
              transparent,
              transparent 40px,
              rgba(255,255,255,0.02) 40px,
              rgba(255,255,255,0.02) 41px
            )
          `,
          pointerEvents: 'none',
        }}
      />

      {/* SVG layer for paths */}
      <svg
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
        preserveAspectRatio="none"
      >
        {PATHS.map(([fromId, toId]) => {
          const toProjection = projectionByIdMap.get(toId)
          if (!toProjection || toProjection.state === 'locked') return null

          const from = VILLAGE_POSITIONS[fromId]
          const to = VILLAGE_POSITIONS[toId]

          // Convert percentage strings to numbers for SVG
          const x1 = parseFloat(from.left) + 5  // offset to center of marker
          const y1 = parseFloat(from.top) + 6
          const x2 = parseFloat(to.left) + 5
          const y2 = parseFloat(to.top) + 6

          return (
            <line
              key={`${fromId}-${toId}`}
              x1={`${x1}%`}
              y1={`${y1}%`}
              x2={`${x2}%`}
              y2={`${y2}%`}
              stroke="rgba(245,200,66,0.4)"
              strokeWidth="2"
              strokeDasharray="6 4"
            />
          )
        })}
      </svg>

      {/* Village markers */}
      {worldState.villages.map((projection) => {
        const pos = VILLAGE_POSITIONS[projection.definition.id]
        return (
          <div
            key={projection.definition.id}
            style={{
              position: 'absolute',
              left: pos.left,
              top: pos.top,
              transform: 'translate(-50%, -50%)',
            }}
          >
            <VillageMarker projection={projection} />
          </div>
        )
      })}

      {/* Map title */}
      <div
        style={{
          position: 'absolute',
          top: 12,
          left: '50%',
          transform: 'translateX(-50%)',
          color: 'rgba(245,200,66,0.7)',
          fontSize: '0.6rem',
          letterSpacing: '0.3em',
          fontWeight: 700,
          textTransform: 'uppercase',
          whiteSpace: 'nowrap',
        }}
      >
        ✦ The Keycroft World ✦
      </div>
    </div>
  )
}
```

- [ ] Commit:
```bash
git add components/world/world-map.tsx
git commit -m "feat: add WorldMap component with SVG paths and village markers"
```

---

## Task 8: World map page (`/world`)

**Files:**
- Create: `app/(hub)/world/page.tsx`

- [ ] Create `app/(hub)/world/page.tsx`:

```tsx
'use client'

import Link from 'next/link'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AppShell } from '@/components/layout/app-shell'
import { WorldMap } from '@/components/world/world-map'
import { useResolvedProgress } from '@/lib/storage/use-resolved-progress'
import { projectWorld } from '@/lib/world/project-world'
import { getVillageDefinition } from '@/lib/world/village-definitions'

export default function WorldPage() {
  const router = useRouter()
  const { progress } = useResolvedProgress()

  useEffect(() => {
    if (progress === null) return
    if (progress.placement === null) {
      router.replace('/onboarding')
    }
  }, [progress, router])

  if (!progress) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p style={{ color: 'var(--kc-muted)' }}>Loading your world…</p>
      </div>
    )
  }

  const worldState = projectWorld(progress)
  const currentDef = getVillageDefinition(worldState.currentVillageId)

  return (
    <AppShell>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          background: 'var(--kc-background)',
        }}
      >
        {/* Header */}
        <header
          style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid var(--kc-line)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexShrink: 0,
          }}
        >
          <div>
            <p
              style={{
                fontSize: '0.65rem',
                textTransform: 'uppercase',
                letterSpacing: '0.2em',
                color: 'var(--kc-muted)',
                marginBottom: 4,
              }}
            >
              World Map
            </p>
            <h1 style={{ color: '#f4efe4', fontWeight: 700, fontSize: '1.25rem', margin: 0 }}>
              The Keycroft World
            </h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                background: 'rgba(245,200,66,0.1)',
                border: '1px solid rgba(245,200,66,0.3)',
                borderRadius: 8,
                padding: '6px 12px',
                fontSize: '0.75rem',
                color: '#f5c842',
              }}
            >
              {worldState.totalMastery}% world mastery
            </div>
          </div>
        </header>

        {/* Map */}
        <div style={{ flex: 1, padding: '1.5rem', minHeight: 0 }}>
          <WorldMap worldState={worldState} />
        </div>

        {/* Bottom bar — current village CTA */}
        <div
          style={{
            padding: '1rem 1.5rem',
            borderTop: '1px solid var(--kc-line)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgba(0,0,0,0.2)',
            flexShrink: 0,
          }}
        >
          <div>
            <p style={{ color: 'var(--kc-muted)', fontSize: '0.7rem', margin: 0, marginBottom: 2 }}>
              Current destination
            </p>
            <p style={{ color: '#f4efe4', fontWeight: 700, margin: 0 }}>
              {currentDef.emoji} {currentDef.name}
            </p>
            <p style={{ color: 'var(--kc-muted)', fontSize: '0.75rem', margin: 0, marginTop: 2 }}>
              {currentDef.tagline}
            </p>
          </div>
          <Link
            href={`/world/${worldState.currentVillageId}`}
            style={{
              background: 'var(--kc-accent)',
              color: '#fff',
              fontWeight: 700,
              padding: '0.6rem 1.5rem',
              borderRadius: 8,
              textDecoration: 'none',
              fontSize: '0.9rem',
            }}
          >
            Enter village →
          </Link>
        </div>
      </div>
    </AppShell>
  )
}
```

- [ ] Update `app/(hub)/home/page.tsx` to redirect to `/world`. Replace the entire file content with:

```tsx
import { redirect } from 'next/navigation'

export default function HubHomePage() {
  redirect('/world')
}
```

- [ ] Start the dev server and verify `/world` renders the map:
```bash
# In a separate terminal
npm run dev
# Then open http://localhost:3000/world
```
Expected: World map with Meadow Farm active (amber border), other villages locked/dimmed, amber "Enter village →" button.

- [ ] Commit:
```bash
git add "app/(hub)/world/page.tsx" "app/(hub)/home/page.tsx"
git commit -m "feat: add /world map page, redirect /home → /world"
```

---

## Task 9: VillageScene component

**Files:**
- Create: `components/world/village-scene.tsx`

The scene uses CSS gradients and emoji "buildings" to create a pixel-art-style backdrop. Buildings reveal progressively as mastery crosses milestones (0, 25, 50, 75).

- [ ] Create `components/world/village-scene.tsx`:

```tsx
import type { VillageDefinition } from '@/lib/world/village-definitions'
import { MasteryBar } from './mastery-bar'

// Per-village building sets — each inner array is one milestone tier
const VILLAGE_BUILDINGS: Record<string, string[][]> = {
  'meadow-farm':   [['🌾', '🌾'], ['🏚️', '🌾', '🌾'], ['🌾', '🏠', '🌾', '🌽'], ['🌾', '🏡', '🌾', '🌽', '🐄']],
  'fishing-docks': [['🌊', '🌊'], ['⛵', '🌊', '🌊'], ['⛵', '🏠', '🐟', '🌊'], ['⚓', '🏠', '⛵', '🐟', '🦭']],
  'mountain-mine': [['⛰️', '⛰️'], ['⛏️', '⛰️', '⛰️'], ['⛏️', '🏚️', '⛰️', '🪨'], ['⛏️', '🏠', '🔥', '⛰️', '🪨']],
  'forest-watch':  [['🌲', '🌲'], ['🌲', '🦉', '🌲'], ['🌲', '🏚️', '🌲', '🌲'], ['🌲', '🏠', '🦉', '🌲', '🌿']],
  'desert-market': [['🏜️', '🏜️'], ['🏺', '🏜️', '🏜️'], ['🏺', '🏚️', '☀️', '🏜️'], ['🏺', '🏠', '🐪', '☀️', '🏜️']],
  'volcano-forge': [['🌋', '🌋'], ['🔥', '🌋', '🌋'], ['🌋', '🏚️', '⚒️', '🔥'], ['🌋', '🏠', '⚒️', '🔥', '🌋']],
}

function getBuildingTier(mastery: number): number {
  if (mastery >= 75) return 3
  if (mastery >= 50) return 2
  if (mastery >= 25) return 1
  return 0
}

type VillageSceneProps = {
  definition: VillageDefinition
  mastery: number
}

export function VillageScene({ definition, mastery }: VillageSceneProps) {
  const tier = getBuildingTier(mastery)
  const buildings = VILLAGE_BUILDINGS[definition.id]?.[tier] ?? ['🏚️']

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        borderRadius: 12,
        overflow: 'hidden',
        background: `linear-gradient(180deg, ${definition.palette.bg} 0%, ${definition.palette.surface} 60%, ${definition.palette.accent}33 100%)`,
      }}
    >
      {/* Sky gradient */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '45%',
          background: `linear-gradient(180deg, ${definition.palette.bg} 0%, transparent 100%)`,
        }}
      />

      {/* Ground strip */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '40%',
          background: `linear-gradient(180deg, transparent 0%, ${definition.palette.accent}44 100%)`,
        }}
      />

      {/* Village name + tagline */}
      <div
        style={{
          position: 'absolute',
          top: 16,
          left: 20,
          right: 20,
        }}
      >
        <div
          style={{
            fontSize: '0.6rem',
            textTransform: 'uppercase',
            letterSpacing: '0.2em',
            color: definition.palette.text,
            opacity: 0.7,
            marginBottom: 4,
          }}
        >
          {definition.emoji} {definition.name}
        </div>
        <div
          style={{
            fontSize: '0.85rem',
            color: definition.palette.text,
            fontWeight: 600,
            lineHeight: 1.3,
          }}
        >
          {definition.tagline}
        </div>
      </div>

      {/* Buildings */}
      <div
        style={{
          position: 'absolute',
          bottom: 48,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-end',
          gap: 12,
          padding: '0 20px',
        }}
      >
        {buildings.map((emoji, i) => (
          <div
            key={i}
            style={{
              fontSize: i % 2 === 0 ? '2.4rem' : '3rem',
              lineHeight: 1,
              filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.5))',
              animation: 'fadeInUp 0.5s ease both',
              animationDelay: `${i * 80}ms`,
              imageRendering: 'pixelated',
            }}
          >
            {emoji}
          </div>
        ))}
      </div>

      {/* Key focus label */}
      <div
        style={{
          position: 'absolute',
          top: 16,
          right: 16,
          background: 'rgba(0,0,0,0.4)',
          borderRadius: 6,
          padding: '4px 8px',
          fontSize: '0.65rem',
          color: definition.palette.text,
          fontFamily: 'monospace',
          letterSpacing: '0.1em',
        }}
      >
        {definition.keyFocus.slice(0, 6).join(' ')}
        {definition.keyFocus.length > 6 && '…'}
      </div>

      {/* Mastery bar at bottom */}
      <div
        style={{
          position: 'absolute',
          bottom: 12,
          left: 16,
          right: 16,
        }}
      >
        <MasteryBar mastery={mastery} accent={definition.palette.accent} showLabel />
      </div>

      {/* CSS animation keyframe — injected inline */}
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
```

- [ ] Commit:
```bash
git add components/world/village-scene.tsx
git commit -m "feat: add VillageScene component (CSS pixel-art backdrop, tiered buildings)"
```

---

## Task 10: SessionReward component

**Files:**
- Create: `components/world/session-reward.tsx`

Shown as an overlay after a typing session completes inside a village. Slides in from the bottom.

- [ ] Create `components/world/session-reward.tsx`:

```tsx
import Link from 'next/link'
import type { VillageDefinition } from '@/lib/world/village-definitions'
import type { SessionMetrics } from '@/lib/typing/session-metrics'
import { getNextVillageId, getVillageDefinition } from '@/lib/world/village-definitions'
import { MasteryBar } from './mastery-bar'

type SessionRewardProps = {
  definition: VillageDefinition
  metrics: SessionMetrics
  masteryGained: number
  newMastery: number       // mastery AFTER this session
  prevMastery: number      // mastery BEFORE this session
  onNextLesson: () => void
}

export function SessionReward({
  definition,
  metrics,
  masteryGained,
  newMastery,
  prevMastery,
  onNextLesson,
}: SessionRewardProps) {
  const nextVillageId = getNextVillageId(definition.id)
  const pathUnlocked = prevMastery < 80 && newMastery >= 80 && nextVillageId !== null
  const nextVillageDef = nextVillageId ? getVillageDefinition(nextVillageId) : null

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: 'rgba(0,0,0,0.65)',
        display: 'flex',
        alignItems: 'flex-end',
        borderRadius: 12,
        overflow: 'hidden',
        animation: 'fadeIn 0.3s ease',
      }}
    >
      <div
        style={{
          width: '100%',
          background: definition.palette.surface,
          borderTop: `3px solid ${definition.palette.accent}`,
          padding: '1.25rem 1.5rem',
          animation: 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Path unlocked banner */}
        {pathUnlocked && nextVillageDef && (
          <div
            style={{
              background: 'rgba(245,200,66,0.15)',
              border: '1px solid rgba(245,200,66,0.4)',
              borderRadius: 8,
              padding: '8px 12px',
              marginBottom: 12,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontSize: '0.8rem',
              color: '#f5c842',
              fontWeight: 700,
            }}
          >
            ✨ Path to {nextVillageDef.name} {nextVillageDef.emoji} now open →
          </div>
        )}

        {/* Stats row */}
        <div style={{ display: 'flex', gap: 16, marginBottom: 12 }}>
          {[
            { label: 'WPM', value: Math.round(metrics.wpm) },
            { label: 'Accuracy', value: `${metrics.accuracy}%` },
            { label: 'Mastery +', value: `+${masteryGained}` },
          ].map(({ label, value }) => (
            <div
              key={label}
              style={{
                flex: 1,
                background: 'rgba(0,0,0,0.3)',
                borderRadius: 8,
                padding: '8px 12px',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '1.2rem', fontWeight: 700, color: definition.palette.text }}>
                {value}
              </div>
              <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>
                {label}
              </div>
            </div>
          ))}
        </div>

        {/* Mastery bar */}
        <div style={{ marginBottom: 16 }}>
          <MasteryBar mastery={newMastery} accent={definition.palette.accent} showLabel />
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={onNextLesson}
            style={{
              flex: 1,
              background: definition.palette.accent,
              color: '#fff',
              fontWeight: 700,
              padding: '0.6rem 1rem',
              borderRadius: 8,
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.875rem',
            }}
          >
            Next lesson →
          </button>
          <Link
            href="/world"
            style={{
              flex: 1,
              background: 'rgba(255,255,255,0.08)',
              color: definition.palette.text,
              fontWeight: 600,
              padding: '0.6rem 1rem',
              borderRadius: 8,
              textDecoration: 'none',
              fontSize: '0.875rem',
              textAlign: 'center',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            World map
          </Link>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn  { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
      `}</style>
    </div>
  )
}
```

- [ ] Commit:
```bash
git add components/world/session-reward.tsx
git commit -m "feat: add SessionReward overlay (stats, mastery gain, path-unlock banner)"
```

---

## Task 11: Village page (`/world/[villageId]`)

**Files:**
- Create: `app/(hub)/world/[villageId]/page.tsx`

This is the main game screen. Left panel: village scene. Right panel: lesson list + active typing surface.

- [ ] Create `app/(hub)/world/[villageId]/page.tsx`:

```tsx
'use client'

import Link from 'next/link'
import { use, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AppShell } from '@/components/layout/app-shell'
import { TypingSurface } from '@/components/typing/typing-surface'
import { VillageScene } from '@/components/world/village-scene'
import { SessionReward } from '@/components/world/session-reward'
import { villageDefinitions, type VillageId } from '@/lib/world/village-definitions'
import { meadowFarm } from '@/content/villages/meadow-farm'
import { fishingDocks } from '@/content/villages/fishing-docks'
import { mountainMine } from '@/content/villages/mountain-mine'
import { forestWatch } from '@/content/villages/forest-watch'
import { desertMarket } from '@/content/villages/desert-market'
import { volcanoForge } from '@/content/villages/volcano-forge'
import type { VillageContent } from '@/content/villages/meadow-farm'
import { useResolvedProgress } from '@/lib/storage/use-resolved-progress'
import {
  readGuestProgress,
  recordVillageMasteryGain,
  saveGuestProgress,
} from '@/lib/storage/guest-progress'
import { computeMasteryGain, applyMasteryGain } from '@/lib/world/mastery-rules'
import { calculateSessionMetrics } from '@/lib/typing/session-metrics'
import type { TypingSessionState } from '@/lib/typing/text-runner'
import type { SessionMetrics } from '@/lib/typing/session-metrics'

const VILLAGE_CONTENT: Record<VillageId, VillageContent> = {
  'meadow-farm':   meadowFarm,
  'fishing-docks': fishingDocks,
  'mountain-mine': mountainMine,
  'forest-watch':  forestWatch,
  'desert-market': desertMarket,
  'volcano-forge': volcanoForge,
}

type Props = {
  params: Promise<{ villageId: string }>
}

export default function VillagePage({ params }: Props) {
  const { villageId } = use(params)
  const router = useRouter()
  const { progress, setProgress } = useResolvedProgress()

  const [activeLessonIndex, setActiveLessonIndex] = useState(0)
  const [completedLessonIds, setCompletedLessonIds] = useState<Set<string>>(new Set())
  const [reward, setReward] = useState<{
    metrics: SessionMetrics
    masteryGained: number
    newMastery: number
    prevMastery: number
  } | null>(null)

  const definition = useMemo(
    () => villageDefinitions.find((v) => v.id === villageId),
    [villageId],
  )

  useEffect(() => {
    if (progress === null) return
    if (progress.placement === null) {
      router.replace('/onboarding')
    }
  }, [progress, router])

  if (!definition) {
    return (
      <AppShell>
        <div className="flex h-screen items-center justify-center">
          <p style={{ color: 'var(--kc-muted)' }}>Village not found.</p>
        </div>
      </AppShell>
    )
  }

  if (!progress) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p style={{ color: 'var(--kc-muted)' }}>Loading…</p>
      </div>
    )
  }

  const villageMastery = progress.villageMastery[villageId as VillageId] ?? 0
  const content = VILLAGE_CONTENT[villageId as VillageId]
  const allLessons = [...content.lessons, content.capstone]
  const activeLesson = allLessons[activeLessonIndex]

  function handleSessionComplete(session: TypingSessionState) {
    const metrics = calculateSessionMetrics(session)
    const gained = computeMasteryGain({ accuracy: metrics.accuracy })
    const prevMastery = villageMastery
    const newMastery = applyMasteryGain(prevMastery, gained)

    // Persist to localStorage
    const storage = window.localStorage
    const current = readGuestProgress(storage)
    const updated = recordVillageMasteryGain(current, villageId as VillageId, gained)
    saveGuestProgress(storage, updated)
    setProgress(updated)

    setCompletedLessonIds((prev) => new Set([...prev, activeLesson.id]))
    setReward({ metrics, masteryGained: gained, newMastery, prevMastery })
  }

  function handleNextLesson() {
    setReward(null)
    if (activeLessonIndex < allLessons.length - 1) {
      setActiveLessonIndex((i) => i + 1)
    }
  }

  return (
    <AppShell>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          background: 'var(--kc-background)',
        }}
      >
        {/* Header */}
        <header
          style={{
            padding: '0.75rem 1.5rem',
            borderBottom: '1px solid var(--kc-line)',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            flexShrink: 0,
          }}
        >
          <Link
            href="/world"
            style={{ color: 'var(--kc-muted)', textDecoration: 'none', fontSize: '0.8rem' }}
          >
            ← World map
          </Link>
          <span style={{ color: 'var(--kc-line)' }}>|</span>
          <span style={{ color: '#f4efe4', fontWeight: 700 }}>
            {definition.emoji} {definition.name}
          </span>
          <span style={{ color: 'var(--kc-muted)', fontSize: '0.8rem' }}>
            — {definition.tagline}
          </span>
        </header>

        {/* Main layout: scene left, lessons right */}
        <div style={{ flex: 1, display: 'flex', minHeight: 0, overflow: 'hidden' }}>
          {/* Village scene — 55% */}
          <div
            style={{
              width: '55%',
              padding: '1.25rem',
              flexShrink: 0,
              position: 'relative',
            }}
          >
            <VillageScene
              definition={definition}
              mastery={reward ? reward.newMastery : villageMastery}
            />
          </div>

          {/* Lesson panel — 45% */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              borderLeft: '1px solid var(--kc-line)',
            }}
          >
            {/* Lesson list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {allLessons.map((lesson, idx) => {
                const isDone = completedLessonIds.has(lesson.id)
                const isActive = idx === activeLessonIndex && !reward

                return (
                  <button
                    key={lesson.id}
                    onClick={() => { setReward(null); setActiveLessonIndex(idx) }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      padding: '8px 12px',
                      borderRadius: 8,
                      border: isActive
                        ? `1px solid ${definition.palette.accent}`
                        : '1px solid transparent',
                      background: isActive
                        ? `${definition.palette.accent}22`
                        : 'rgba(255,255,255,0.04)',
                      cursor: 'pointer',
                      textAlign: 'left',
                      color: isDone ? 'rgba(255,255,255,0.4)' : '#f4efe4',
                      width: '100%',
                    }}
                  >
                    <span style={{ fontSize: '1rem', flexShrink: 0 }}>
                      {isDone ? '✓' : idx === allLessons.length - 1 ? '⚑' : `${idx + 1}`}
                    </span>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{lesson.label}</div>
                      <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.45)', marginTop: 1 }}>
                        {lesson.focus}
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>

            {/* Active lesson typing surface */}
            {!reward && activeLesson && (
              <div style={{ flex: 1, minHeight: 0 }}>
                <div style={{ marginBottom: 8 }}>
                  <p style={{ color: '#f4efe4', fontWeight: 700, margin: 0, fontSize: '0.9rem' }}>
                    {activeLesson.label}
                  </p>
                  <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', margin: '4px 0 0' }}>
                    {activeLesson.goal}
                  </p>
                </div>
                <TypingSurface
                  prompt={{ text: activeLesson.text, focus: activeLesson.focus }}
                  onComplete={handleSessionComplete}
                />
              </div>
            )}

            {/* Session reward overlay inside lesson panel */}
            {reward && (
              <div style={{ position: 'relative', flex: 1, borderRadius: 12, overflow: 'hidden', minHeight: 280 }}>
                <SessionReward
                  definition={definition}
                  metrics={reward.metrics}
                  masteryGained={reward.masteryGained}
                  newMastery={reward.newMastery}
                  prevMastery={reward.prevMastery}
                  onNextLesson={handleNextLesson}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  )
}
```

- [ ] Typecheck:
```bash
npx tsc --noEmit 2>&1 | grep -v node_modules | head -20
```
Fix any errors before proceeding.

- [ ] Commit:
```bash
git add "app/(hub)/world/[villageId]/page.tsx"
git commit -m "feat: add village page with scene, lesson list, typing surface, and session reward"
```

---

## Task 12: Wire up AppShell nav + add .superpowers to .gitignore

**Files:**
- Modify: `components/layout/app-nav.tsx`
- Modify: `.gitignore`

The AppShell sidebar nav currently links to `/home`. Update it to point to `/world`.

- [ ] Read `components/layout/app-nav.tsx` and find the nav item for "The Village" (href `/home`). Change its href to `/world`:

The item that currently has `href: '/home'` should become `href: '/world'`.

- [ ] Add `.superpowers/` to `.gitignore` (brainstorm mockups shouldn't be committed):
```bash
echo "" >> .gitignore
echo "# Visual brainstorming mockups" >> .gitignore
echo ".superpowers/" >> .gitignore
```

- [ ] Run all unit tests to confirm nothing broke:
```bash
node_modules/.bin/vitest run tests/placement/ tests/progression/ tests/storage/ tests/world/ tests/typing/ tests/content/ 2>&1 | tail -8
```
Expected: all tests pass.

- [ ] Commit everything:
```bash
git add components/layout/app-nav.tsx .gitignore
git commit -m "fix: update nav to /world, add .superpowers to .gitignore"
```

---

## Task 13: Final push

- [ ] Push all commits to remote:
```bash
git push origin main
```

- [ ] Smoke test in browser at `http://localhost:3000`:
  1. Visit `/` (marketing) — unchanged ✓
  2. Complete onboarding if needed, then visit `/world`
  3. Verify Meadow Farm is active (amber border), others locked
  4. Click "Enter village →" — lands on `/world/meadow-farm`
  5. Type through lesson 1, verify SessionReward slides up with WPM/accuracy/mastery
  6. Verify mastery bar increased
  7. Verify "Next lesson →" advances to lesson 2
  8. Verify "World map" link returns to `/world`

---

## Self-Review Checklist

**Spec coverage:**
- ✅ 6 villages with distinct keys, palettes, word banks
- ✅ `/world` map route replaces `/home`
- ✅ `/world/[villageId]` lesson screen
- ✅ VillageScene with CSS-based pixel art + tiered buildings
- ✅ MasteryBar component
- ✅ SessionReward with stats + path-unlock banner
- ✅ `villageMastery` in GuestProgress + `recordVillageMasteryGain()`
- ✅ `projectWorld()` projection + tests
- ✅ mastery-rules + tests (TDD)
- ✅ Village content (word banks + lessons) for all 6

**Type consistency check:**
- `VillageId` — defined in `village-definitions.ts`, imported everywhere consistently
- `VillageContent` type — defined in `meadow-farm.ts`, imported via `import type { VillageContent } from './meadow-farm'` in other village files
- `computeMasteryGain({ accuracy: number })` — takes object with `accuracy`, consistent with use in village page
- `recordVillageMasteryGain(progress, villageId, gain)` — defined in Task 4, used in Task 11 ✓
- `getNextVillageId(id)` — defined in Task 1, used in SessionReward ✓
- `VillageContent.lessons` + `.capstone` — both are `VillageLesson[]` / `VillageLesson`, consistent

**No placeholders:** All code blocks are complete. No TBDs.
