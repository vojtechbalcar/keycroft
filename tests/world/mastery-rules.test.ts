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
