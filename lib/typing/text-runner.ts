import type { TypingKeyAction } from '@/lib/typing/key-events'
import { ensurePlayableText } from '@/lib/validation/typing'

export type CharacterStatus = 'pending' | 'correct' | 'incorrect'

export type CharacterView = {
  expected: string
  actual: string | null
  status: CharacterStatus
}

export type TypingSessionState = {
  targetText: string
  inputValue: string
  startedAt: number | null
  completedAt: number | null
  characterInputCount: number
  correctedErrors: number
  isComplete: boolean
}

export function createTypingSession(targetText: string): TypingSessionState {
  return {
    targetText: ensurePlayableText(targetText),
    inputValue: '',
    startedAt: null,
    completedAt: null,
    characterInputCount: 0,
    correctedErrors: 0,
    isComplete: false,
  }
}

export function applyTypingAction(
  session: TypingSessionState,
  action: TypingKeyAction,
  atMs: number,
): TypingSessionState {
  if (session.isComplete || action.type === 'ignore') {
    return session
  }

  if (action.type === 'backspace') {
    if (session.inputValue.length === 0) {
      return session
    }

    const lastIndex = session.inputValue.length - 1
    const removedWasIncorrect =
      session.inputValue[lastIndex] !== session.targetText[lastIndex]

    return {
      ...session,
      inputValue: session.inputValue.slice(0, -1),
      correctedErrors:
        session.correctedErrors + (removedWasIncorrect ? 1 : 0),
    }
  }

  if (session.inputValue.length >= session.targetText.length) {
    return session
  }

  const nextInputValue = `${session.inputValue}${action.value}`
  const startedAt = session.startedAt ?? atMs
  const isComplete = nextInputValue === session.targetText

  return {
    ...session,
    inputValue: nextInputValue,
    startedAt,
    completedAt: isComplete ? atMs : null,
    characterInputCount: session.characterInputCount + 1,
    isComplete,
  }
}

export function getCharacterStatuses(
  session: TypingSessionState,
): CharacterView[] {
  return session.targetText.split('').map((expected, index) => {
    if (index >= session.inputValue.length) {
      return {
        expected,
        actual: null,
        status: 'pending',
      }
    }

    const actual = session.inputValue[index]
    const status = actual === expected ? 'correct' : 'incorrect'

    return {
      expected,
      actual,
      status,
    }
  })
}

export function getCurrentErrorCount(session: TypingSessionState): number {
  return getCharacterStatuses(session).filter(
    (character) => character.status === 'incorrect',
  ).length
}
