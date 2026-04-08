import {
  getPhaseDefinition,
  type PhaseId,
} from '@/lib/placement/phase-definitions'
import type { SessionMetrics } from '@/lib/typing/session-metrics'

export type PlacementSelfRating =
  | 'finding-keys'
  | 'steady-practice'
  | 'already-fast'

export type PlacementAssessmentInput = {
  metrics: SessionMetrics
  selfRating: PlacementSelfRating | null
}

export type PlacementResult = {
  phaseId: PhaseId
  phaseName: string
  summary: string
  recommendedFocus: string
  reason: string
  selfRating: PlacementSelfRating | null
  metrics: Pick<SessionMetrics, 'wpm' | 'accuracy' | 'correctedErrors'>
}

function getBasePhaseId(metrics: SessionMetrics): PhaseId {
  if (metrics.accuracy >= 96 && metrics.wpm >= 42) {
    return 'lookout'
  }
  if (metrics.accuracy >= 93 && metrics.wpm >= 24) {
    return 'workshop'
  }
  return 'lantern'
}

function applySelfRatingTiebreaker(
  basePhaseId: PhaseId,
  metrics: SessionMetrics,
  selfRating: PlacementSelfRating | null,
): PhaseId {
  if (
    basePhaseId === 'workshop' &&
    selfRating === 'already-fast' &&
    metrics.accuracy >= 95 &&
    metrics.wpm >= 38
  ) {
    return 'lookout'
  }
  if (
    basePhaseId === 'workshop' &&
    selfRating === 'finding-keys' &&
    metrics.accuracy < 94 &&
    metrics.wpm < 30
  ) {
    return 'lantern'
  }
  return basePhaseId
}

function getPlacementReason(phaseId: PhaseId, metrics: SessionMetrics): string {
  if (phaseId === 'lookout') {
    return `You already pair speed and control at ${metrics.wpm} WPM and ${metrics.accuracy}% accuracy.`
  }
  if (phaseId === 'workshop') {
    return `You have a solid base at ${metrics.wpm} WPM, and the next gains come from consistency.`
  }
  return `You will gain the most by building comfort first at ${metrics.accuracy}% accuracy and a slower pace.`
}

export function assessPlacement({
  metrics,
  selfRating,
}: PlacementAssessmentInput): PlacementResult {
  const phaseId = applySelfRatingTiebreaker(
    getBasePhaseId(metrics),
    metrics,
    selfRating,
  )
  const definition = getPhaseDefinition(phaseId)
  return {
    phaseId,
    phaseName: definition.name,
    summary: definition.summary,
    recommendedFocus: definition.recommendedFocus,
    reason: getPlacementReason(phaseId, metrics),
    selfRating,
    metrics: {
      wpm: metrics.wpm,
      accuracy: metrics.accuracy,
      correctedErrors: metrics.correctedErrors,
    },
  }
}
