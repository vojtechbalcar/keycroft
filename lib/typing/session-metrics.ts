import type { TypingSessionState } from '@/lib/typing/text-runner'

export type SessionMetrics = {
  elapsedMs: number
  correctCharacters: number
  characterInputCount: number
  correctedErrors: number
  accuracy: number
  wpm: number
  cleanRun: boolean
}

function roundToOneDecimal(value: number): number {
  return Math.round(value * 10) / 10
}

export function calculateSessionMetrics(
  session: TypingSessionState,
): SessionMetrics {
  if (
    session.startedAt === null ||
    session.completedAt === null ||
    !session.isComplete
  ) {
    throw new Error('Session must be complete before calculating metrics.')
  }

  const elapsedMs = Math.max(session.completedAt - session.startedAt, 1)
  const correctCharacters = session.targetText.length
  const characterInputCount = Math.max(session.characterInputCount, 1)
  const accuracy = roundToOneDecimal(
    (correctCharacters / characterInputCount) * 100,
  )
  const wpm = roundToOneDecimal(
    (correctCharacters / 5) / (elapsedMs / 60000),
  )

  return {
    elapsedMs,
    correctCharacters,
    characterInputCount: session.characterInputCount,
    correctedErrors: session.correctedErrors,
    accuracy,
    wpm,
    cleanRun: session.correctedErrors === 0,
  }
}
