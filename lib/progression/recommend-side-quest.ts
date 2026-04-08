import type { PhaseId } from '@/lib/placement/phase-definitions'
import type { StoredSessionSummary } from '@/lib/progression/progress-events'

export type SideQuestRecommendation = {
  id: string
  chapterId: string
  title: string
  skillFocus: string
  reason: string
}

type RecommendSideQuestInput = {
  currentPhaseId: PhaseId | null
  recentSessions: StoredSessionSummary[]
}

function average(values: number[]): number {
  return values.reduce((sum, value) => sum + value, 0) / values.length
}

export function recommendSideQuest({
  currentPhaseId,
  recentSessions,
}: RecommendSideQuestInput): SideQuestRecommendation | null {
  if (recentSessions.length < 3) {
    return null
  }

  const recentSlice = recentSessions.slice(0, 3)
  const averageAccuracy = average(recentSlice.map((session) => session.accuracy))
  const averageCorrections = average(recentSlice.map((session) => session.correctedErrors))

  if (averageAccuracy >= 94 && averageCorrections < 2.5) {
    return null
  }

  if (currentPhaseId === 'workshop' || currentPhaseId === 'lookout') {
    return {
      id: 'reach-reset',
      chapterId: 'ch03-reach-control',
      title: 'Reach Reset',
      skillFocus: 'Accuracy and lighter corrections across mixed-row reaches',
      reason: 'Recent sessions suggest your reaches are introducing avoidable corrections.',
    }
  }

  return {
    id: 'home-row-reset',
    chapterId: 'ch02-home-row',
    title: 'Home Row Reset',
    skillFocus: 'Accuracy and correction control on the home row',
    reason: 'Recent sessions show correction-heavy lines, so a calmer accuracy pass should help.',
  }
}
