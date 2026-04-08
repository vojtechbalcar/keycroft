import type { Prisma, PrismaClient } from '@prisma/client'

import { db } from '@/lib/db'
import type { PlacementResult } from '@/lib/placement/assess'
import { defaultPhaseId, type PhaseId } from '@/lib/placement/phase-definitions'
import {
  createPracticeSessionCompletedEvent,
  type ProgressEvent,
  type StoredSessionSummary,
} from '@/lib/progression/progress-events'
import { evaluateCurrentPhase } from '@/lib/progression/phase-evaluator'
import {
  createEmptyGuestProgress,
  recordCompletedChapter,
  recordPlacementResult,
  recordPracticeSession,
  type GuestProgress,
} from '@/lib/storage/guest-progress'

export type PersistedProgressSnapshot = GuestProgress
type ReadClient = PrismaClient | Prisma.TransactionClient

type UserProgressRecord = Prisma.UserGetPayload<{
  include: {
    chapterProgresses: {
      orderBy: {
        completedAt: 'asc'
      }
    }
    typingRuns: {
      orderBy: {
        completedAt: 'asc'
      }
    }
  }
}>

function getEventKey(event: ProgressEvent): string {
  if (event.type === 'placement-completed') {
    return `placement:${event.createdAt}`
  }

  return `session:${event.session.completedAt}`
}

function compareEventsByCreatedAt(a: ProgressEvent, b: ProgressEvent): number {
  return a.createdAt.localeCompare(b.createdAt)
}

function buildEventsFromSnapshot(progress: GuestProgress): ProgressEvent[] {
  if (progress.events.length > 0) {
    return progress.events
  }

  const events: ProgressEvent[] = []

  for (const session of progress.recentSessions) {
    events.push(
      createPracticeSessionCompletedEvent(
        session,
        progress.currentPhaseId ?? 'lantern',
      ),
    )
  }

  return events
}

function dedupeEvents(events: ProgressEvent[]): ProgressEvent[] {
  const map = new Map<string, ProgressEvent>()

  for (const event of events) {
    map.set(getEventKey(event), event)
  }

  return [...map.values()].sort(compareEventsByCreatedAt)
}

function uniqueChapterIds(
  existingChapterIds: string[],
  incomingChapterIds: string[],
): string[] {
  return [...new Set([...existingChapterIds, ...incomingChapterIds])]
}

export function hasMeaningfulProgress(progress: GuestProgress): boolean {
  return (
    progress.placement !== null ||
    progress.completedChapterIds.length > 0 ||
    progress.recentSessions.length > 0 ||
    progress.events.length > 0
  )
}

export function mergeProgressSnapshots(
  existing: PersistedProgressSnapshot | null,
  incoming: PersistedProgressSnapshot,
): PersistedProgressSnapshot {
  if (existing === null) {
    return incoming
  }

  const events = dedupeEvents([
    ...buildEventsFromSnapshot(existing),
    ...buildEventsFromSnapshot(incoming),
  ])

  const placementEvent = [...events]
    .reverse()
    .find((event) => event.type === 'placement-completed')

  const sessionEvents = events
    .filter((event) => event.type === 'practice-session-completed')
    .reverse()
    .slice(0, 5)

  return {
    ...createEmptyGuestProgress(),
    placement: placementEvent?.placement ?? existing.placement ?? incoming.placement,
    completedChapterIds: uniqueChapterIds(
      existing.completedChapterIds,
      incoming.completedChapterIds,
    ),
    recentSessions: sessionEvents.map((event) => event.session),
    events,
    currentPhaseId: evaluateCurrentPhase(events),
  }
}

function getPlacementCreatedAt(progress: GuestProgress): string | null {
  const placementEvent = [...progress.events]
    .reverse()
    .find((event) => event.type === 'placement-completed')

  return placementEvent?.createdAt ?? null
}

function getSessionRecords(progress: GuestProgress): Array<
  StoredSessionSummary & {
    phaseId: PhaseId
  }
> {
  const sessionEvents = progress.events.filter(
    (event): event is Extract<ProgressEvent, { type: 'practice-session-completed' }> =>
      event.type === 'practice-session-completed',
  )

  if (sessionEvents.length > 0) {
    return sessionEvents.map((event) => ({
      ...event.session,
      phaseId: event.phaseId,
    }))
  }

  return progress.recentSessions.map((session) => ({
    ...session,
    phaseId: progress.currentPhaseId ?? defaultPhaseId,
  }))
}

function buildPlacementFromUser(user: UserProgressRecord): PlacementResult | null {
  if (
    user.placementPhaseId === null ||
    user.placementPhaseName === null ||
    user.placementSummary === null ||
    user.placementRecommendedFocus === null ||
    user.placementReason === null ||
    user.placementWpm === null ||
    user.placementAccuracy === null ||
    user.placementCorrectedErrors === null
  ) {
    return null
  }

  return {
    phaseId: user.placementPhaseId as PhaseId,
    phaseName: user.placementPhaseName,
    summary: user.placementSummary,
    recommendedFocus: user.placementRecommendedFocus,
    reason: user.placementReason,
    selfRating: (user.placementSelfRating as PlacementResult['selfRating']) ?? null,
    metrics: {
      wpm: user.placementWpm,
      accuracy: user.placementAccuracy,
      correctedErrors: user.placementCorrectedErrors,
    },
  }
}

function buildProgressFromUser(user: UserProgressRecord): PersistedProgressSnapshot {
  let progress = createEmptyGuestProgress()
  const placement = buildPlacementFromUser(user)

  if (placement) {
    progress = recordPlacementResult(
      progress,
      placement,
      (user.placementCompletedAt ?? user.createdAt).toISOString(),
    )
  }

  for (const run of user.typingRuns) {
    progress = recordPracticeSession(progress, {
      completedAt: run.completedAt.toISOString(),
      wpm: run.wpm,
      accuracy: run.accuracy,
      correctedErrors: run.correctedErrors,
    })
  }

  for (const chapter of user.chapterProgresses) {
    progress = recordCompletedChapter(progress, chapter.chapterId)
  }

  return {
    ...progress,
    currentPhaseId:
      (user.currentPhaseId as PhaseId | null) ??
      progress.currentPhaseId ??
      defaultPhaseId,
  }
}

export async function getLinkedUserId(
  guestProfileId: string,
  client: ReadClient = db,
): Promise<string | null> {
  const link = await client.guestProfileLink.findUnique({
    where: { guestProfileId },
  })

  return link?.userId ?? null
}

export async function readUserProgress(
  userId: string,
  client: ReadClient = db,
): Promise<PersistedProgressSnapshot | null> {
  const user = await client.user.findUnique({
    where: { id: userId },
    include: {
      chapterProgresses: {
        orderBy: { completedAt: 'asc' },
      },
      typingRuns: {
        orderBy: { completedAt: 'asc' },
      },
    },
  })

  if (user === null) {
    return null
  }

  return buildProgressFromUser(user)
}

export async function writeUserProgress(
  input: {
    userId: string
    guestProfileId: string
    progress: PersistedProgressSnapshot
  },
  client: PrismaClient = db,
): Promise<PersistedProgressSnapshot> {
  const placementCreatedAt = getPlacementCreatedAt(input.progress)
  const sessionRecords = getSessionRecords(input.progress)

  await client.$transaction(async (tx: Prisma.TransactionClient) => {
    await tx.guestProfileLink.upsert({
      where: { guestProfileId: input.guestProfileId },
      update: { userId: input.userId },
      create: {
        guestProfileId: input.guestProfileId,
        userId: input.userId,
      },
    })

    await tx.user.update({
      where: { id: input.userId },
      data: {
        currentPhaseId: input.progress.currentPhaseId,
        placementCompletedAt: placementCreatedAt
          ? new Date(placementCreatedAt)
          : null,
        placementPhaseId: input.progress.placement?.phaseId ?? null,
        placementPhaseName: input.progress.placement?.phaseName ?? null,
        placementSummary: input.progress.placement?.summary ?? null,
        placementRecommendedFocus:
          input.progress.placement?.recommendedFocus ?? null,
        placementReason: input.progress.placement?.reason ?? null,
        placementSelfRating: input.progress.placement?.selfRating ?? null,
        placementWpm: input.progress.placement?.metrics.wpm ?? null,
        placementAccuracy: input.progress.placement?.metrics.accuracy ?? null,
        placementCorrectedErrors:
          input.progress.placement?.metrics.correctedErrors ?? null,
      },
    })

    for (const chapterId of input.progress.completedChapterIds) {
      await tx.chapterProgress.upsert({
        where: {
          userId_chapterId: {
            userId: input.userId,
            chapterId,
          },
        },
        update: {},
        create: {
          userId: input.userId,
          chapterId,
          completedAt: new Date(),
        },
      })
    }

    for (const session of sessionRecords) {
      await tx.typingRun.upsert({
        where: {
          userId_completedAt: {
            userId: input.userId,
            completedAt: new Date(session.completedAt),
          },
        },
        update: {
          phaseId: session.phaseId,
          source: 'practice',
          wpm: session.wpm,
          accuracy: session.accuracy,
          correctedErrors: session.correctedErrors,
        },
        create: {
          userId: input.userId,
          phaseId: session.phaseId,
          source: 'practice',
          completedAt: new Date(session.completedAt),
          wpm: session.wpm,
          accuracy: session.accuracy,
          correctedErrors: session.correctedErrors,
        },
      })
    }
  })

  const progress = await readUserProgress(input.userId, client)

  if (progress === null) {
    throw new Error('Failed to reload persisted progress.')
  }

  return progress
}
