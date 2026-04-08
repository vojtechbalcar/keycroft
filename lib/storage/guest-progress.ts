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
  completedChapterIds: string[]
}

export const guestProgressStorageKey = 'keycroft.guest.progress'

export function createEmptyGuestProgress(): GuestProgress {
  return {
    currentPhaseId: null,
    placement: null,
    events: [],
    recentSessions: [],
    completedChapterIds: [],
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
