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
