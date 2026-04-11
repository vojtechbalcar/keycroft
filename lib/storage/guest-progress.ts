import type { PlacementResult } from '@/lib/placement/assess'
import { applyMasteryGain } from '@/lib/world/mastery-rules'
import { defaultPhaseId, type PhaseId } from '@/lib/placement/phase-definitions'
import {
  createPlacementCompletedEvent,
  createPracticeSessionCompletedEvent,
  type ProgressEvent,
  type StoredSessionSummary,
} from '@/lib/progression/progress-events'
import { evaluateCurrentPhase } from '@/lib/progression/phase-evaluator'
import type { StorageLike } from '@/lib/storage/guest-profile'
import type { VillageId } from '@/lib/world/village-definitions'

export type GuestProgress = {
  currentPhaseId: PhaseId | null
  placement: PlacementResult | null
  events: ProgressEvent[]
  recentSessions: StoredSessionSummary[]
  completedChapterIds: string[]
  villageMastery: Partial<Record<VillageId, number>>
}

export const guestProgressStorageKey = 'keycroft.guest.progress'

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

export function saveGuestProgress(storage: StorageLike, progress: GuestProgress): void {
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
    completedChapterIds: progress.completedChapterIds,
    villageMastery: progress.villageMastery,
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

export function recordCompletedChapter(
  progress: GuestProgress,
  chapterId: string,
): GuestProgress {
  if (progress.completedChapterIds.includes(chapterId)) {
    return progress
  }

  return {
    ...progress,
    completedChapterIds: [...progress.completedChapterIds, chapterId],
  }
}

export function recordVillageMasteryGain(
  progress: GuestProgress,
  villageId: VillageId,
  gain: number,
): GuestProgress {
  const current = progress.villageMastery[villageId] ?? 0
  const next = applyMasteryGain(current, gain)
  return {
    ...progress,
    villageMastery: {
      ...progress.villageMastery,
      [villageId]: next,
    },
  }
}
