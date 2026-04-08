import type { PhaseId } from '@/lib/placement/phase-definitions'

export type ChapterProgressState = {
  completedChapterIds: string[]
}

function phaseRank(phaseId: PhaseId | null): number {
  if (phaseId === 'lookout') return 2
  if (phaseId === 'workshop') return 1
  return 0
}

export function isChapterComplete(progress: ChapterProgressState, chapterId: string): boolean {
  return progress.completedChapterIds.includes(chapterId)
}

export function isChapterUnlocked(
  currentPhaseId: PhaseId | null,
  chapterPhaseId: PhaseId,
): boolean {
  return phaseRank(currentPhaseId) >= phaseRank(chapterPhaseId)
}
