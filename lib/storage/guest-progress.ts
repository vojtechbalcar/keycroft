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
  if (!raw) return createEmptyGuestProgress()
  return JSON.parse(raw) as GuestProgress
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
