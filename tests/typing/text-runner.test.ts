import { describe, expect, it } from 'vitest'

import {
  applyTypingAction,
  createTypingSession,
  getCharacterStatuses,
} from '@/lib/typing/text-runner'

describe('text-runner', () => {
  it('creates an empty session for a valid prompt', () => {
    const session = createTypingSession('calm')

    expect(session.targetText).toBe('calm')
    expect(session.inputValue).toBe('')
    expect(session.startedAt).toBeNull()
    expect(session.completedAt).toBeNull()
    expect(session.characterInputCount).toBe(0)
    expect(session.correctedErrors).toBe(0)
    expect(session.isComplete).toBe(false)
  })

  it('advances through correct input and completes on an exact match', () => {
    let session = createTypingSession('go')

    session = applyTypingAction(session, { type: 'input', value: 'g' }, 1000)
    session = applyTypingAction(session, { type: 'input', value: 'o' }, 1400)

    expect(session.inputValue).toBe('go')
    expect(session.startedAt).toBe(1000)
    expect(session.completedAt).toBe(1400)
    expect(session.characterInputCount).toBe(2)
    expect(session.isComplete).toBe(true)
  })

  it('marks incorrect characters until they are removed', () => {
    let session = createTypingSession('calm')

    session = applyTypingAction(session, { type: 'input', value: 'x' }, 1000)

    expect(getCharacterStatuses(session)[0]).toEqual({
      expected: 'c',
      actual: 'x',
      status: 'incorrect',
    })

    session = applyTypingAction(session, { type: 'backspace' }, 1100)

    expect(getCharacterStatuses(session)[0]).toEqual({
      expected: 'c',
      actual: null,
      status: 'pending',
    })
  })

  it('counts corrected errors only when an incorrect character is removed', () => {
    let session = createTypingSession('calm')

    session = applyTypingAction(session, { type: 'input', value: 'x' }, 1000)
    session = applyTypingAction(session, { type: 'backspace' }, 1050)
    session = applyTypingAction(session, { type: 'input', value: 'c' }, 1100)
    session = applyTypingAction(session, { type: 'backspace' }, 1150)

    expect(session.correctedErrors).toBe(1)
  })
})
