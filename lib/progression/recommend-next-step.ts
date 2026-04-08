import type { PhaseId } from '@/lib/placement/phase-definitions'
import { listChapters } from '@/lib/content/list-chapters'
import { isChapterComplete, isChapterUnlocked } from '@/lib/progression/chapter-progress'

export type NextStepRecommendation =
  | {
      kind: 'chapter'
      chapterId: string
      label: string
      reason: string
    }
  | {
      kind: 'practice'
      chapterId: null
      label: string
      reason: string
    }

type RecommendNextStepInput = {
  currentPhaseId: PhaseId | null
  completedChapterIds: string[]
}

export function recommendNextStep({
  currentPhaseId,
  completedChapterIds,
}: RecommendNextStepInput): NextStepRecommendation {
  const chapters = listChapters()

  const nextChapter = chapters.find(
    (chapter) =>
      isChapterUnlocked(currentPhaseId, chapter.phaseId) &&
      !isChapterComplete({ completedChapterIds }, chapter.id),
  )

  if (nextChapter) {
    return {
      kind: 'chapter',
      chapterId: nextChapter.id,
      label: nextChapter.title,
      reason: nextChapter.summary,
    }
  }

  return {
    kind: 'practice',
    chapterId: null,
    label: 'Free Practice',
    reason: 'All unlocked chapters are complete, so the next gain comes from steady repetition.',
  }
}
