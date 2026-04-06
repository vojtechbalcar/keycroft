# Keycroft Stage 3 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the first real onboarding loop for Keycroft by placing new guests into a named starting phase, persisting that progress locally, and routing returning users back into a meaningful home state.

**Architecture:** Keep Stage 3 split into four thin layers. `lib/placement/` owns the starting-phase decision, `lib/progression/` owns event shapes plus phase re-evaluation rules, `lib/storage/` owns local guest persistence, and `components/onboarding/` owns the short onboarding UI. Reuse the existing typing session engine for the placement sample so the assessment path stays close to the real product experience instead of creating a second typing system.

**Tech Stack:** Next.js App Router, React, TypeScript, Tailwind CSS, Vitest, React Testing Library, Playwright

---

## Starting Point

- Stage 1 and Stage 2 already exist in the repository root
- `/play` already works and computes session metrics from the typing engine
- `/home` still renders a placeholder card and does not know whether the visitor is new or returning
- There is no `onboarding` route yet
- There are no placement rules, phase definitions, or local guest storage modules yet
- Completed typing sessions are not persisted anywhere yet
- This stage should stay fully client-side and must not introduce server persistence, auth, or village rendering

## Files to Create in Stage 3

- Create: `lib/placement/phase-definitions.ts`
- Create: `lib/placement/assess.ts`
- Create: `lib/progression/progress-events.ts`
- Create: `lib/progression/phase-evaluator.ts`
- Create: `lib/storage/guest-profile.ts`
- Create: `lib/storage/guest-progress.ts`
- Create: `components/onboarding/opening-scene.tsx`
- Create: `components/onboarding/placement-flow.tsx`
- Create: `components/onboarding/phase-result.tsx`
- Create: `app/(app)/onboarding/page.tsx`
- Create: `tests/placement/assess.test.ts`
- Create: `tests/progression/phase-evaluator.test.ts`
- Create: `tests/storage/guest-progress.test.ts`
- Create: `e2e/onboarding-placement.spec.ts`

## Files to Modify in Stage 3

- Modify: `app/(app)/home/page.tsx`
- Modify: `app/(app)/play/page.tsx`

## Task 1: Define the Starting Phases and Placement Rules

**Files:**
- Create: `tests/placement/assess.test.ts`
- Create: `tests/progression/phase-evaluator.test.ts`
- Create: `lib/placement/phase-definitions.ts`
- Create: `lib/placement/assess.ts`
- Create: `lib/progression/progress-events.ts`
- Create: `lib/progression/phase-evaluator.ts`

- [ ] **Step 1: Write the failing placement and progression tests**

```ts
// tests/placement/assess.test.ts
import { describe, expect, it } from 'vitest'

import {
  assessPlacement,
  type PlacementSelfRating,
} from '@/lib/placement/assess'
import type { SessionMetrics } from '@/lib/typing/session-metrics'

function createMetrics(overrides: Partial<SessionMetrics>): SessionMetrics {
  return {
    elapsedMs: 20000,
    correctCharacters: 32,
    characterInputCount: 32,
    correctedErrors: 0,
    accuracy: 100,
    wpm: 19.2,
    cleanRun: true,
    ...overrides,
  }
}

describe('assessPlacement', () => {
  it('places slower but clean typists into Lantern Room', () => {
    const result = assessPlacement({
      metrics: createMetrics({
        accuracy: 96.4,
        wpm: 18.8,
      }),
      selfRating: null,
    })

    expect(result.phaseId).toBe('lantern')
    expect(result.phaseName).toBe('Lantern Room')
  })

  it('places steady mid-range typists into Workshop Lane', () => {
    const result = assessPlacement({
      metrics: createMetrics({
        accuracy: 95.1,
        wpm: 31.6,
      }),
      selfRating: 'steady-practice',
    })

    expect(result.phaseId).toBe('workshop')
    expect(result.phaseName).toBe('Workshop Lane')
  })

  it('places advanced typists into Lookout Point', () => {
    const result = assessPlacement({
      metrics: createMetrics({
        accuracy: 98.2,
        wpm: 55.4,
      }),
      selfRating: 'already-fast',
    })

    expect(result.phaseId).toBe('lookout')
    expect(result.phaseName).toBe('Lookout Point')
  })

  it('uses self-rating only as a gentle tiebreaker near a threshold', () => {
    const metrics = createMetrics({
      accuracy: 95,
      wpm: 39.5,
    })

    const withoutSelfRating = assessPlacement({
      metrics,
      selfRating: null,
    })

    const withFastSelfRating = assessPlacement({
      metrics,
      selfRating: 'already-fast' satisfies PlacementSelfRating,
    })

    expect(withoutSelfRating.phaseId).toBe('workshop')
    expect(withFastSelfRating.phaseId).toBe('lookout')
  })
})
```

```ts
// tests/progression/phase-evaluator.test.ts
import { describe, expect, it } from 'vitest'

import { assessPlacement } from '@/lib/placement/assess'
import {
  createPlacementCompletedEvent,
  createPracticeSessionCompletedEvent,
} from '@/lib/progression/progress-events'
import { evaluateCurrentPhase } from '@/lib/progression/phase-evaluator'

const placement = assessPlacement({
  metrics: {
    elapsedMs: 22000,
    correctCharacters: 32,
    characterInputCount: 33,
    correctedErrors: 1,
    accuracy: 97,
    wpm: 18,
    cleanRun: false,
  },
  selfRating: 'finding-keys',
})

describe('evaluateCurrentPhase', () => {
  it('defaults to Lantern Room before any progress exists', () => {
    expect(evaluateCurrentPhase([])).toBe('lantern')
  })

  it('uses the most recent placement as the current phase baseline', () => {
    const events = [
      createPlacementCompletedEvent(placement, '2026-04-01T08:00:00.000Z'),
    ]

    expect(evaluateCurrentPhase(events)).toBe('lantern')
  })

  it('promotes Lantern Room guests into Workshop Lane after three strong sessions', () => {
    const events = [
      createPlacementCompletedEvent(placement, '2026-04-01T08:00:00.000Z'),
      createPracticeSessionCompletedEvent(
        {
          completedAt: '2026-04-02T08:00:00.000Z',
          wpm: 28,
          accuracy: 95.4,
          correctedErrors: 1,
        },
        'lantern',
      ),
      createPracticeSessionCompletedEvent(
        {
          completedAt: '2026-04-03T08:00:00.000Z',
          wpm: 30,
          accuracy: 96.1,
          correctedErrors: 0,
        },
        'lantern',
      ),
      createPracticeSessionCompletedEvent(
        {
          completedAt: '2026-04-04T08:00:00.000Z',
          wpm: 31,
          accuracy: 95.8,
          correctedErrors: 0,
        },
        'lantern',
      ),
    ]

    expect(evaluateCurrentPhase(events)).toBe('workshop')
  })

  it('does not skip directly from Lantern Room to Lookout Point on one fast run', () => {
    const events = [
      createPlacementCompletedEvent(placement, '2026-04-01T08:00:00.000Z'),
      createPracticeSessionCompletedEvent(
        {
          completedAt: '2026-04-02T08:00:00.000Z',
          wpm: 55,
          accuracy: 98.4,
          correctedErrors: 0,
        },
        'lantern',
      ),
    ]

    expect(evaluateCurrentPhase(events)).toBe('lantern')
  })
})
```

- [ ] **Step 2: Run the new tests to verify they fail**

Run:

```bash
npx vitest run tests/placement/assess.test.ts tests/progression/phase-evaluator.test.ts
```

Expected:
- FAIL with missing module errors for `@/lib/placement/assess`
- FAIL with missing module errors for `@/lib/progression/phase-evaluator`
- no passing assertions yet

- [ ] **Step 3: Write the phase definitions, assessment logic, and phase evaluator**

```ts
// lib/placement/phase-definitions.ts
export type PhaseId = 'lantern' | 'workshop' | 'lookout'

export type PhaseDefinition = {
  id: PhaseId
  name: string
  summary: string
  recommendedFocus: string
}

export const defaultPhaseId: PhaseId = 'lantern'

export const phaseDefinitions: PhaseDefinition[] = [
  {
    id: 'lantern',
    name: 'Lantern Room',
    summary: 'Build clean key recall with calm, repeatable rhythm.',
    recommendedFocus: 'Slow enough to stay accurate, then add pace later.',
  },
  {
    id: 'workshop',
    name: 'Workshop Lane',
    summary: 'Your hands already know the route. Now tighten consistency.',
    recommendedFocus: 'Hold accuracy while gradually stretching speed.',
  },
  {
    id: 'lookout',
    name: 'Lookout Point',
    summary: 'You already move quickly. Focus on polish and staying relaxed.',
    recommendedFocus: 'Refine control so speed stays clean under pressure.',
  },
]

export function getPhaseDefinition(phaseId: PhaseId): PhaseDefinition {
  const definition = phaseDefinitions.find((phase) => phase.id === phaseId)

  if (!definition) {
    throw new Error(`Unknown phase: ${phaseId}`)
  }

  return definition
}
```

```ts
// lib/placement/assess.ts
import {
  getPhaseDefinition,
  type PhaseId,
} from '@/lib/placement/phase-definitions'
import type { SessionMetrics } from '@/lib/typing/session-metrics'

export type PlacementSelfRating =
  | 'finding-keys'
  | 'steady-practice'
  | 'already-fast'

export type PlacementAssessmentInput = {
  metrics: SessionMetrics
  selfRating: PlacementSelfRating | null
}

export type PlacementResult = {
  phaseId: PhaseId
  phaseName: string
  summary: string
  recommendedFocus: string
  reason: string
  selfRating: PlacementSelfRating | null
  metrics: Pick<SessionMetrics, 'wpm' | 'accuracy' | 'correctedErrors'>
}

function getBasePhaseId(metrics: SessionMetrics): PhaseId {
  if (metrics.accuracy >= 96 && metrics.wpm >= 42) {
    return 'lookout'
  }

  if (metrics.accuracy >= 93 && metrics.wpm >= 24) {
    return 'workshop'
  }

  return 'lantern'
}

function applySelfRatingTiebreaker(
  basePhaseId: PhaseId,
  metrics: SessionMetrics,
  selfRating: PlacementSelfRating | null,
): PhaseId {
  if (
    basePhaseId === 'workshop' &&
    selfRating === 'already-fast' &&
    metrics.accuracy >= 95 &&
    metrics.wpm >= 38
  ) {
    return 'lookout'
  }

  if (
    basePhaseId === 'workshop' &&
    selfRating === 'finding-keys' &&
    metrics.accuracy < 94 &&
    metrics.wpm < 30
  ) {
    return 'lantern'
  }

  return basePhaseId
}

function getPlacementReason(phaseId: PhaseId, metrics: SessionMetrics): string {
  if (phaseId === 'lookout') {
    return `You already pair speed and control at ${metrics.wpm} WPM and ${metrics.accuracy}% accuracy.`
  }

  if (phaseId === 'workshop') {
    return `You have a solid base at ${metrics.wpm} WPM, and the next gains come from consistency.`
  }

  return `You will gain the most by building comfort first at ${metrics.accuracy}% accuracy and a slower pace.`
}

export function assessPlacement({
  metrics,
  selfRating,
}: PlacementAssessmentInput): PlacementResult {
  const phaseId = applySelfRatingTiebreaker(
    getBasePhaseId(metrics),
    metrics,
    selfRating,
  )
  const definition = getPhaseDefinition(phaseId)

  return {
    phaseId,
    phaseName: definition.name,
    summary: definition.summary,
    recommendedFocus: definition.recommendedFocus,
    reason: getPlacementReason(phaseId, metrics),
    selfRating,
    metrics: {
      wpm: metrics.wpm,
      accuracy: metrics.accuracy,
      correctedErrors: metrics.correctedErrors,
    },
  }
}
```

```ts
// lib/progression/progress-events.ts
import type { PlacementResult } from '@/lib/placement/assess'
import type { PhaseId } from '@/lib/placement/phase-definitions'

export type StoredSessionSummary = {
  completedAt: string
  wpm: number
  accuracy: number
  correctedErrors: number
}

export type PlacementCompletedEvent = {
  type: 'placement-completed'
  createdAt: string
  phaseId: PhaseId
  placement: PlacementResult
}

export type PracticeSessionCompletedEvent = {
  type: 'practice-session-completed'
  createdAt: string
  phaseId: PhaseId
  session: StoredSessionSummary
}

export type ProgressEvent =
  | PlacementCompletedEvent
  | PracticeSessionCompletedEvent

export function createPlacementCompletedEvent(
  placement: PlacementResult,
  createdAt: string,
): PlacementCompletedEvent {
  return {
    type: 'placement-completed',
    createdAt,
    phaseId: placement.phaseId,
    placement,
  }
}

export function createPracticeSessionCompletedEvent(
  session: StoredSessionSummary,
  phaseId: PhaseId,
): PracticeSessionCompletedEvent {
  return {
    type: 'practice-session-completed',
    createdAt: session.completedAt,
    phaseId,
    session,
  }
}
```

```ts
// lib/progression/phase-evaluator.ts
import { defaultPhaseId, type PhaseId } from '@/lib/placement/phase-definitions'
import type { ProgressEvent } from '@/lib/progression/progress-events'

function getRecentSessionAverages(events: ProgressEvent[]) {
  const sessions = events
    .filter((event) => event.type === 'practice-session-completed')
    .slice(-3)

  if (sessions.length < 3) {
    return null
  }

  const totalWpm = sessions.reduce((sum, event) => sum + event.session.wpm, 0)
  const totalAccuracy = sessions.reduce(
    (sum, event) => sum + event.session.accuracy,
    0,
  )

  return {
    averageWpm: totalWpm / sessions.length,
    averageAccuracy: totalAccuracy / sessions.length,
  }
}

export function evaluateCurrentPhase(events: ProgressEvent[]): PhaseId {
  const latestPlacement = [...events]
    .reverse()
    .find((event) => event.type === 'placement-completed')

  const basePhaseId = latestPlacement?.phaseId ?? defaultPhaseId
  const averages = getRecentSessionAverages(events)

  if (!averages) {
    return basePhaseId
  }

  if (
    basePhaseId === 'lantern' &&
    averages.averageWpm >= 26 &&
    averages.averageAccuracy >= 95
  ) {
    return 'workshop'
  }

  if (
    basePhaseId === 'workshop' &&
    averages.averageWpm >= 44 &&
    averages.averageAccuracy >= 96
  ) {
    return 'lookout'
  }

  return basePhaseId
}
```

- [ ] **Step 4: Run the targeted logic tests again**

Run:

```bash
npx vitest run tests/placement/assess.test.ts tests/progression/phase-evaluator.test.ts
```

Expected:
- PASS for `tests/placement/assess.test.ts`
- PASS for `tests/progression/phase-evaluator.test.ts`

- [ ] **Step 5: Commit the phase logic foundation**

```bash
git add tests/placement/assess.test.ts tests/progression/phase-evaluator.test.ts lib/placement/phase-definitions.ts lib/placement/assess.ts lib/progression/progress-events.ts lib/progression/phase-evaluator.ts
git commit -m "feat: add placement assessment and phase evaluation"
```

## Task 2: Add Local Guest Profile and Progress Persistence

**Files:**
- Create: `tests/storage/guest-progress.test.ts`
- Create: `lib/storage/guest-profile.ts`
- Create: `lib/storage/guest-progress.ts`

- [ ] **Step 1: Write failing storage tests for the guest profile and progress record**

```ts
// tests/storage/guest-progress.test.ts
import { describe, expect, it } from 'vitest'

import { assessPlacement } from '@/lib/placement/assess'
import {
  createEmptyGuestProgress,
  readGuestProgress,
  recordPlacementResult,
  recordPracticeSession,
  saveGuestProgress,
} from '@/lib/storage/guest-progress'
import {
  ensureGuestProfile,
  type StorageLike,
} from '@/lib/storage/guest-profile'

function createMemoryStorage(): StorageLike {
  const values = new Map<string, string>()

  return {
    getItem(key) {
      return values.get(key) ?? null
    },
    setItem(key, value) {
      values.set(key, value)
    },
    removeItem(key) {
      values.delete(key)
    },
  }
}

describe('guest storage', () => {
  it('creates a stable guest profile id once and reuses it later', () => {
    const storage = createMemoryStorage()

    const firstProfile = ensureGuestProfile(storage, {
      now: () => '2026-04-01T08:00:00.000Z',
      createId: () => 'guest-123',
    })
    const secondProfile = ensureGuestProfile(storage, {
      now: () => '2026-04-01T08:10:00.000Z',
      createId: () => 'guest-999',
    })

    expect(firstProfile.id).toBe('guest-123')
    expect(secondProfile.id).toBe('guest-123')
  })

  it('persists a placement result and current phase', () => {
    const storage = createMemoryStorage()
    const placement = assessPlacement({
      metrics: {
        elapsedMs: 24000,
        correctCharacters: 32,
        characterInputCount: 33,
        correctedErrors: 1,
        accuracy: 97,
        wpm: 18,
        cleanRun: false,
      },
      selfRating: 'finding-keys',
    })

    const nextProgress = recordPlacementResult(
      createEmptyGuestProgress(),
      placement,
      '2026-04-01T08:00:00.000Z',
    )

    saveGuestProgress(storage, nextProgress)

    expect(readGuestProgress(storage)).toEqual(
      expect.objectContaining({
        currentPhaseId: 'lantern',
        placement,
      }),
    )
  })

  it('keeps the five most recent practice sessions in newest-first order', () => {
    const storage = createMemoryStorage()
    let progress = createEmptyGuestProgress()

    progress = recordPlacementResult(
      progress,
      assessPlacement({
        metrics: {
          elapsedMs: 18000,
          correctCharacters: 32,
          characterInputCount: 32,
          correctedErrors: 0,
          accuracy: 100,
          wpm: 28,
          cleanRun: true,
        },
        selfRating: 'steady-practice',
      }),
      '2026-04-01T08:00:00.000Z',
    )

    for (let index = 0; index < 6; index += 1) {
      progress = recordPracticeSession(progress, {
        completedAt: `2026-04-0${index + 1}T09:00:00.000Z`,
        wpm: 26 + index,
        accuracy: 95 + index * 0.1,
        correctedErrors: index % 2,
      })
    }

    saveGuestProgress(storage, progress)

    const stored = readGuestProgress(storage)

    expect(stored.recentSessions).toHaveLength(5)
    expect(stored.recentSessions[0]?.completedAt).toBe(
      '2026-04-06T09:00:00.000Z',
    )
    expect(stored.recentSessions.at(-1)?.completedAt).toBe(
      '2026-04-02T09:00:00.000Z',
    )
  })
})
```

- [ ] **Step 2: Run the new storage tests to verify they fail**

Run:

```bash
npx vitest run tests/storage/guest-progress.test.ts
```

Expected:
- FAIL with missing module errors for `@/lib/storage/guest-profile`
- FAIL with missing module errors for `@/lib/storage/guest-progress`

- [ ] **Step 3: Implement the guest profile and persisted progress modules**

```ts
// lib/storage/guest-profile.ts
export type StorageLike = {
  getItem: (key: string) => string | null
  setItem: (key: string, value: string) => void
  removeItem: (key: string) => void
}

export type GuestProfile = {
  id: string
  createdAt: string
  updatedAt: string
}

type EnsureGuestProfileOptions = {
  now?: () => string
  createId?: () => string
}

export const guestProfileStorageKey = 'keycroft.guest.profile'

export function readGuestProfile(storage: StorageLike): GuestProfile | null {
  const raw = storage.getItem(guestProfileStorageKey)

  if (!raw) {
    return null
  }

  return JSON.parse(raw) as GuestProfile
}

export function saveGuestProfile(
  storage: StorageLike,
  profile: GuestProfile,
): void {
  storage.setItem(guestProfileStorageKey, JSON.stringify(profile))
}

export function ensureGuestProfile(
  storage: StorageLike,
  options: EnsureGuestProfileOptions = {},
): GuestProfile {
  const existing = readGuestProfile(storage)

  if (existing) {
    return existing
  }

  const now = options.now?.() ?? new Date().toISOString()
  const id =
    options.createId?.() ??
    (typeof crypto !== 'undefined' ? crypto.randomUUID() : `guest-${now}`)

  const profile: GuestProfile = {
    id,
    createdAt: now,
    updatedAt: now,
  }

  saveGuestProfile(storage, profile)

  return profile
}
```

```ts
// lib/storage/guest-progress.ts
import type { PlacementResult } from '@/lib/placement/assess'
import { defaultPhaseId, type PhaseId } from '@/lib/placement/phase-definitions'
import {
  createPlacementCompletedEvent,
  createPracticeSessionCompletedEvent,
  type ProgressEvent,
  type StoredSessionSummary,
} from '@/lib/progression/progress-events'
import { evaluateCurrentPhase } from '@/lib/progression/phase-evaluator'
import type { StorageLike } from '@/lib/storage/guest-profile'

export type GuestProgress = {
  currentPhaseId: PhaseId | null
  placement: PlacementResult | null
  events: ProgressEvent[]
  recentSessions: StoredSessionSummary[]
}

export const guestProgressStorageKey = 'keycroft.guest.progress'

export function createEmptyGuestProgress(): GuestProgress {
  return {
    currentPhaseId: null,
    placement: null,
    events: [],
    recentSessions: [],
  }
}

export function readGuestProgress(storage: StorageLike): GuestProgress {
  const raw = storage.getItem(guestProgressStorageKey)

  if (!raw) {
    return createEmptyGuestProgress()
  }

  return JSON.parse(raw) as GuestProgress
}

export function saveGuestProgress(
  storage: StorageLike,
  progress: GuestProgress,
): void {
  storage.setItem(guestProgressStorageKey, JSON.stringify(progress))
}

export function recordPlacementResult(
  progress: GuestProgress,
  placement: PlacementResult,
  createdAt: string,
): GuestProgress {
  return {
    currentPhaseId: placement.phaseId,
    placement,
    events: [...progress.events, createPlacementCompletedEvent(placement, createdAt)],
    recentSessions: progress.recentSessions,
  }
}

export function recordPracticeSession(
  progress: GuestProgress,
  session: StoredSessionSummary,
): GuestProgress {
  const phaseId = progress.currentPhaseId ?? defaultPhaseId
  const nextEvents = [
    ...progress.events,
    createPracticeSessionCompletedEvent(session, phaseId),
  ]

  return {
    ...progress,
    currentPhaseId: evaluateCurrentPhase(nextEvents),
    events: nextEvents,
    recentSessions: [session, ...progress.recentSessions].slice(0, 5),
  }
}
```

- [ ] **Step 4: Run the storage tests again**

Run:

```bash
npx vitest run tests/storage/guest-progress.test.ts
```

Expected:
- PASS for `tests/storage/guest-progress.test.ts`

- [ ] **Step 5: Commit the persistence layer**

```bash
git add tests/storage/guest-progress.test.ts lib/storage/guest-profile.ts lib/storage/guest-progress.ts
git commit -m "feat: add local guest profile and progress storage"
```

## Task 3: Build the Onboarding UI and Persist the Placement Result

**Files:**
- Create: `components/onboarding/opening-scene.tsx`
- Create: `components/onboarding/placement-flow.tsx`
- Create: `components/onboarding/phase-result.tsx`
- Create: `app/(app)/onboarding/page.tsx`

- [ ] **Step 1: Create the opening scene and phase result presentation components**

```tsx
// components/onboarding/opening-scene.tsx
import { PrimaryButton } from '@/components/shared/primary-button'

type OpeningSceneProps = {
  onBegin: () => void
}

export function OpeningScene({ onBegin }: OpeningSceneProps) {
  return (
    <section className="space-y-6 rounded-[36px] border border-[var(--kc-line)] bg-[linear-gradient(180deg,rgba(255,250,240,0.98)_0%,rgba(244,236,219,0.98)_100%)] p-8 shadow-[0_18px_50px_rgba(58,45,30,0.10)] md:p-10">
      <div className="space-y-2">
        <p className="text-sm uppercase tracking-[0.18em] text-[var(--kc-muted)]">
          First arrival
        </p>
        <h1 className="text-4xl tracking-tight text-[var(--kc-text)]">
          We will place you from one short typing sample.
        </h1>
        <p className="max-w-2xl text-base leading-7 text-[var(--kc-muted)]">
          This opening pass should take less than a minute. Type one line,
          choose how familiar touch typing already feels, and Keycroft will
          place you into a starting path.
        </p>
      </div>

      <PrimaryButton onClick={onBegin}>Begin placement</PrimaryButton>
    </section>
  )
}
```

```tsx
// components/onboarding/phase-result.tsx
import Link from 'next/link'

import type { PlacementResult } from '@/lib/placement/assess'

type PhaseResultProps = {
  result: PlacementResult
}

export function PhaseResult({ result }: PhaseResultProps) {
  return (
    <section className="space-y-6 rounded-[36px] border border-[var(--kc-line)] bg-[linear-gradient(180deg,rgba(255,250,240,0.98)_0%,rgba(244,236,219,0.98)_100%)] p-8 shadow-[0_18px_50px_rgba(58,45,30,0.10)] md:p-10">
      <div className="space-y-2">
        <p className="text-sm uppercase tracking-[0.18em] text-[var(--kc-muted)]">
          Starting phase
        </p>
        <h1 className="text-4xl tracking-tight text-[var(--kc-text)]">
          {result.phaseName}
        </h1>
        <p className="max-w-2xl text-base leading-7 text-[var(--kc-muted)]">
          {result.summary}
        </p>
      </div>

      <dl className="grid gap-4 md:grid-cols-3">
        <div className="rounded-[24px] border border-[var(--kc-line)] bg-[rgba(255,250,240,0.6)] p-4">
          <dt className="text-xs uppercase tracking-[0.18em] text-[var(--kc-muted)]">
            WPM
          </dt>
          <dd className="mt-2 text-3xl text-[var(--kc-text)]">
            {result.metrics.wpm}
          </dd>
        </div>
        <div className="rounded-[24px] border border-[var(--kc-line)] bg-[rgba(255,250,240,0.6)] p-4">
          <dt className="text-xs uppercase tracking-[0.18em] text-[var(--kc-muted)]">
            Accuracy
          </dt>
          <dd className="mt-2 text-3xl text-[var(--kc-text)]">
            {result.metrics.accuracy}%
          </dd>
        </div>
        <div className="rounded-[24px] border border-[var(--kc-line)] bg-[rgba(255,250,240,0.6)] p-4">
          <dt className="text-xs uppercase tracking-[0.18em] text-[var(--kc-muted)]">
            Corrections
          </dt>
          <dd className="mt-2 text-3xl text-[var(--kc-text)]">
            {result.metrics.correctedErrors}
          </dd>
        </div>
      </dl>

      <div className="rounded-[24px] border border-[var(--kc-line)] bg-[rgba(255,250,240,0.72)] p-5">
        <p className="text-sm uppercase tracking-[0.18em] text-[var(--kc-muted)]">
          Why this phase
        </p>
        <p className="mt-2 text-base leading-7 text-[var(--kc-text)]">
          {result.reason}
        </p>
        <p className="mt-3 text-base leading-7 text-[var(--kc-text)]">
          Focus next: {result.recommendedFocus}
        </p>
      </div>

      <Link
        className="inline-flex items-center justify-center rounded-full bg-[var(--kc-accent)] px-5 py-3 text-sm font-medium text-white transition hover:bg-[var(--kc-accent-strong)]"
        href="/home"
      >
        Go to home
      </Link>
    </section>
  )
}
```

- [ ] **Step 2: Build the placement flow component that reuses the real typing surface**

```tsx
// components/onboarding/placement-flow.tsx
'use client'

import { useState } from 'react'

import { OpeningScene } from '@/components/onboarding/opening-scene'
import { PhaseResult } from '@/components/onboarding/phase-result'
import { PrimaryButton } from '@/components/shared/primary-button'
import { SessionSummary } from '@/components/typing/session-summary'
import { TypingSurface } from '@/components/typing/typing-surface'
import {
  assessPlacement,
  type PlacementResult,
  type PlacementSelfRating,
} from '@/lib/placement/assess'
import { calculateSessionMetrics } from '@/lib/typing/session-metrics'
import type { TypingSessionState } from '@/lib/typing/text-runner'

type PlacementFlowProps = {
  onPlacementComplete: (result: PlacementResult) => void
}

const placementPrompt = {
  id: 'arrival-placement',
  label: 'Arrival line',
  focus: 'steady first rhythm',
  text: 'steady hands shape patient rhythm',
}

type Step = 'opening' | 'typing' | 'rating' | 'result'

export function PlacementFlow({ onPlacementComplete }: PlacementFlowProps) {
  const [step, setStep] = useState<Step>('opening')
  const [completedSession, setCompletedSession] =
    useState<TypingSessionState | null>(null)
  const [selfRating, setSelfRating] = useState<PlacementSelfRating | null>(null)
  const [result, setResult] = useState<PlacementResult | null>(null)

  function handlePlacementSessionComplete(session: TypingSessionState) {
    setCompletedSession(session)
    setStep('rating')
  }

  function handleRevealPhase() {
    if (!completedSession) {
      return
    }

    const placement = assessPlacement({
      metrics: calculateSessionMetrics(completedSession),
      selfRating,
    })

    setResult(placement)
    onPlacementComplete(placement)
    setStep('result')
  }

  if (step === 'opening') {
    return <OpeningScene onBegin={() => setStep('typing')} />
  }

  if (step === 'typing') {
    return (
      <TypingSurface
        onComplete={handlePlacementSessionComplete}
        prompt={placementPrompt}
      />
    )
  }

  if (step === 'rating' && completedSession) {
    const metrics = calculateSessionMetrics(completedSession)

    return (
      <section className="space-y-6">
        <SessionSummary
          metrics={metrics}
          onTryAnother={() => {
            setCompletedSession(null)
            setStep('typing')
          }}
          prompt={placementPrompt}
        />

        <section className="rounded-[32px] border border-[var(--kc-line)] bg-[var(--kc-surface)] p-6 shadow-[0_18px_50px_rgba(58,45,30,0.10)]">
          <fieldset className="space-y-4">
            <legend className="text-lg text-[var(--kc-text)]">
              Which description feels closest right now?
            </legend>

            <label className="flex items-start gap-3 rounded-[20px] border border-[var(--kc-line)] p-4 text-[var(--kc-text)]">
              <input
                checked={selfRating === 'finding-keys'}
                name="self-rating"
                onChange={() => setSelfRating('finding-keys')}
                type="radio"
              />
              <span>I am still finding the keys and want a gentler start.</span>
            </label>

            <label className="flex items-start gap-3 rounded-[20px] border border-[var(--kc-line)] p-4 text-[var(--kc-text)]">
              <input
                checked={selfRating === 'steady-practice'}
                name="self-rating"
                onChange={() => setSelfRating('steady-practice')}
                type="radio"
              />
              <span>I already have some steady practice but want structure.</span>
            </label>

            <label className="flex items-start gap-3 rounded-[20px] border border-[var(--kc-line)] p-4 text-[var(--kc-text)]">
              <input
                checked={selfRating === 'already-fast'}
                name="self-rating"
                onChange={() => setSelfRating('already-fast')}
                type="radio"
              />
              <span>I type quickly already and want refinement, not basics.</span>
            </label>
          </fieldset>

          <PrimaryButton className="mt-6" onClick={handleRevealPhase}>
            See my starting phase
          </PrimaryButton>
        </section>
      </section>
    )
  }

  if (!result) {
    return null
  }

  return <PhaseResult result={result} />
}
```

- [ ] **Step 3: Add the onboarding route and save placement results into local storage**

```tsx
// app/(app)/onboarding/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

import { PlacementFlow } from '@/components/onboarding/placement-flow'
import type { PlacementResult } from '@/lib/placement/assess'
import {
  readGuestProgress,
  recordPlacementResult,
  saveGuestProgress,
} from '@/lib/storage/guest-progress'
import { ensureGuestProfile } from '@/lib/storage/guest-profile'

export default function OnboardingPage() {
  const router = useRouter()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const storage = window.localStorage

    ensureGuestProfile(storage)

    const progress = readGuestProgress(storage)

    if (progress.placement !== null) {
      router.replace('/home')
      return
    }

    setReady(true)
  }, [router])

  function handlePlacementComplete(result: PlacementResult) {
    const storage = window.localStorage
    const progress = readGuestProgress(storage)
    const nextProgress = recordPlacementResult(
      progress,
      result,
      new Date().toISOString(),
    )

    saveGuestProgress(storage, nextProgress)
  }

  if (!ready) {
    return (
      <section className="rounded-[32px] border border-[var(--kc-line)] bg-[var(--kc-surface)] p-8 text-[var(--kc-text)] shadow-[0_18px_50px_rgba(58,45,30,0.10)]">
        Preparing your starting path...
      </section>
    )
  }

  return <PlacementFlow onPlacementComplete={handlePlacementComplete} />
}
```

- [ ] **Step 4: Run the unit test suite to catch any regressions before wiring the remaining routes**

Run:

```bash
npx vitest run tests/placement/assess.test.ts tests/progression/phase-evaluator.test.ts tests/storage/guest-progress.test.ts tests/typing/session-metrics.test.ts tests/typing/text-runner.test.ts tests/typing/typing-surface.test.tsx
```

Expected:
- PASS for all placement, progression, storage, and typing tests

- [ ] **Step 5: Commit the onboarding route**

```bash
git add components/onboarding/opening-scene.tsx components/onboarding/placement-flow.tsx components/onboarding/phase-result.tsx app/\(app\)/onboarding/page.tsx
git commit -m "feat: add onboarding placement flow"
```

## Task 4: Gate Home for New Guests, Persist Practice History, and Cover the Flow End-to-End

**Files:**
- Modify: `app/(app)/home/page.tsx`
- Modify: `app/(app)/play/page.tsx`
- Create: `e2e/onboarding-placement.spec.ts`

- [ ] **Step 1: Update the home page so it redirects new guests into onboarding and shows returning progress**

```tsx
// app/(app)/home/page.tsx
'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

import { PrimaryButton } from '@/components/shared/primary-button'
import { getPhaseDefinition } from '@/lib/placement/phase-definitions'
import {
  readGuestProgress,
  type GuestProgress,
} from '@/lib/storage/guest-progress'
import { ensureGuestProfile } from '@/lib/storage/guest-profile'

export default function AppHomePage() {
  const router = useRouter()
  const [progress, setProgress] = useState<GuestProgress | null>(null)

  useEffect(() => {
    const storage = window.localStorage

    ensureGuestProfile(storage)

    const nextProgress = readGuestProgress(storage)

    if (nextProgress.placement === null) {
      router.replace('/onboarding')
      return
    }

    setProgress(nextProgress)
  }, [router])

  if (progress === null) {
    return (
      <section className="rounded-[32px] border border-[var(--kc-line)] bg-[var(--kc-surface)] p-8 text-[var(--kc-text)] shadow-[0_18px_50px_rgba(58,45,30,0.10)]">
        Loading your desk...
      </section>
    )
  }

  const phase = getPhaseDefinition(progress.currentPhaseId ?? 'lantern')

  return (
    <section className="space-y-6 rounded-[32px] border border-[var(--kc-line)] bg-[var(--kc-surface)] p-8 shadow-[0_18px_50px_rgba(58,45,30,0.10)]">
      <div className="space-y-2">
        <p className="text-sm uppercase tracking-[0.18em] text-[var(--kc-muted)]">
          Current path
        </p>
        <h1 className="text-4xl tracking-tight text-[var(--kc-text)]">
          {phase.name}
        </h1>
        <p className="max-w-2xl text-base leading-7 text-[var(--kc-muted)]">
          {phase.summary}
        </p>
      </div>

      <div className="rounded-[24px] border border-[var(--kc-line)] bg-[rgba(255,250,240,0.72)] p-5">
        <p className="text-sm uppercase tracking-[0.18em] text-[var(--kc-muted)]">
          Focus next
        </p>
        <p className="mt-2 text-base leading-7 text-[var(--kc-text)]">
          {phase.recommendedFocus}
        </p>
      </div>

      <section className="space-y-3">
        <p className="text-sm uppercase tracking-[0.18em] text-[var(--kc-muted)]">
          Recent history
        </p>

        {progress.recentSessions.length === 0 ? (
          <p className="text-base leading-7 text-[var(--kc-muted)]">
            No saved sessions yet. Finish a practice line and it will appear
            here.
          </p>
        ) : (
          <ul className="grid gap-3 md:grid-cols-2">
            {progress.recentSessions.map((session) => (
              <li
                className="rounded-[20px] border border-[var(--kc-line)] bg-[rgba(255,250,240,0.6)] p-4 text-[var(--kc-text)]"
                key={session.completedAt}
              >
                <p className="text-sm text-[var(--kc-muted)]">
                  {new Date(session.completedAt).toLocaleDateString()}
                </p>
                <p className="mt-2 text-lg">
                  {session.wpm} WPM at {session.accuracy}% accuracy
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <PrimaryButton>
        <Link href="/play">Continue practice</Link>
      </PrimaryButton>
    </section>
  )
}
```

- [ ] **Step 2: Persist completed practice sessions from the existing `/play` route**

```tsx
// app/(app)/play/page.tsx
'use client'

import { useState } from 'react'

import { SessionSummary } from '@/components/typing/session-summary'
import { TypingSurface } from '@/components/typing/typing-surface'
import { practiceTexts } from '@/lib/typing/practice-texts'
import { calculateSessionMetrics } from '@/lib/typing/session-metrics'
import {
  readGuestProgress,
  recordPracticeSession,
  saveGuestProgress,
} from '@/lib/storage/guest-progress'
import { ensureGuestProfile } from '@/lib/storage/guest-profile'
import type { TypingSessionState } from '@/lib/typing/text-runner'

export default function PlayPage() {
  const [promptIndex, setPromptIndex] = useState(0)
  const [completedSession, setCompletedSession] =
    useState<TypingSessionState | null>(null)

  const prompt = practiceTexts[promptIndex]
  const metrics =
    completedSession === null
      ? null
      : calculateSessionMetrics(completedSession)

  function persistCompletedSession(session: TypingSessionState) {
    const storage = window.localStorage

    ensureGuestProfile(storage)

    const progress = readGuestProgress(storage)

    if (progress.placement === null) {
      return
    }

    const nextProgress = recordPracticeSession(progress, {
      completedAt: new Date().toISOString(),
      wpm: calculateSessionMetrics(session).wpm,
      accuracy: calculateSessionMetrics(session).accuracy,
      correctedErrors: calculateSessionMetrics(session).correctedErrors,
    })

    saveGuestProgress(storage, nextProgress)
  }

  function handleComplete(session: TypingSessionState) {
    setCompletedSession(session)
    persistCompletedSession(session)
  }

  function handleTryAnother() {
    setPromptIndex((current) => (current + 1) % practiceTexts.length)
    setCompletedSession(null)
  }

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6">
      <div className="space-y-2">
        <p className="text-sm uppercase tracking-[0.18em] text-[var(--kc-muted)]">
          Writing desk
        </p>
        <h1 className="text-4xl tracking-tight text-[var(--kc-text)]">
          Practice a single line with full attention.
        </h1>
        <p className="max-w-2xl text-base leading-7 text-[var(--kc-muted)]">
          This Stage 2 route proves the typing loop itself: input, correction,
          completion, and useful feedback.
        </p>
      </div>

      {metrics === null ? (
        <TypingSurface key={prompt.id} onComplete={handleComplete} prompt={prompt} />
      ) : (
        <SessionSummary
          metrics={metrics}
          onTryAnother={handleTryAnother}
          prompt={prompt}
        />
      )}
    </div>
  )
}
```

- [ ] **Step 3: Add the Stage 3 Playwright coverage**

```ts
// e2e/onboarding-placement.spec.ts
import { expect, test, type Page } from '@playwright/test'

const placementLine = 'steady hands shape patient rhythm'
const practiceLine = 'calm hands build quiet speed'

async function typeLine(page: Page, text: string) {
  const input = page.getByLabel(/typing input/i)

  await input.click()

  for (const character of text) {
    await input.press(character === ' ' ? 'Space' : character)
  }
}

test('a first-time guest completes onboarding and lands on home', async ({
  page,
}) => {
  await page.addInitScript(() => {
    window.localStorage.clear()
  })

  await page.goto('/home')
  await expect(page).toHaveURL(/\/onboarding$/)

  await page.getByRole('button', { name: /begin placement/i }).click()
  await typeLine(page, placementLine)

  await page
    .getByLabel(/I already have some steady practice but want structure./i)
    .check()
  await page
    .getByRole('button', { name: /see my starting phase/i })
    .click()

  await expect(page.getByText(/starting phase/i)).toBeVisible()
  await page.getByRole('link', { name: /go to home/i }).click()

  await expect(page).toHaveURL(/\/home$/)
  await expect(page.getByText(/current path/i)).toBeVisible()
})

test('completed play sessions show up in home history', async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.setItem(
      'keycroft.guest.profile',
      JSON.stringify({
        id: 'guest-123',
        createdAt: '2026-04-01T08:00:00.000Z',
        updatedAt: '2026-04-01T08:00:00.000Z',
      }),
    )

    window.localStorage.setItem(
      'keycroft.guest.progress',
      JSON.stringify({
        currentPhaseId: 'workshop',
        placement: {
          phaseId: 'workshop',
          phaseName: 'Workshop Lane',
          summary: 'You have a solid base.',
          recommendedFocus: 'Hold accuracy while gradually stretching speed.',
          reason: 'Seeded for the test.',
          selfRating: 'steady-practice',
          metrics: {
            wpm: 29,
            accuracy: 96,
            correctedErrors: 0,
          },
        },
        events: [],
        recentSessions: [],
      }),
    )
  })

  await page.goto('/play')
  await typeLine(page, practiceLine)
  await expect(page.getByRole('heading', { name: /session complete/i })).toBeVisible()

  await page.goto('/home')
  await expect(page.getByText(/recent history/i)).toBeVisible()
  await expect(page.getByText(/WPM/i)).toBeVisible()
})
```

- [ ] **Step 4: Run the new end-to-end test first, then the full verification pass**

Run:

```bash
npx playwright test e2e/onboarding-placement.spec.ts
npm run test
```

Expected:
- PASS for `e2e/onboarding-placement.spec.ts`
- PASS for the Vitest suite

- [ ] **Step 5: Commit the Stage 3 flow integration**

```bash
git add app/\(app\)/home/page.tsx app/\(app\)/play/page.tsx e2e/onboarding-placement.spec.ts
git commit -m "feat: route guests through onboarding and persist progress"
```

## Exit Criteria

- A first-time visitor landing on `/home` is redirected to `/onboarding`
- The onboarding flow records one typing sample plus optional self-identification and produces a named starting phase
- Placement results are stored in `localStorage` with a stable guest profile id
- Returning visitors stay on `/home` and see their current phase plus recent saved sessions
- Completing a session on `/play` adds to local recent history and can advance the current phase over time
- `npm run test` passes
- `npx playwright test e2e/onboarding-placement.spec.ts` passes
