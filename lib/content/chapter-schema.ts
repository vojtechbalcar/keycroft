import type { PhaseId } from '@/lib/placement/phase-definitions'
import type { PracticeText } from '@/lib/typing/practice-texts'

export type ChapterPrompt = PracticeText & {
  goal: string
}

export type ChapterUnlock = {
  type: 'region-detail' | 'chapter-path'
  target: string
  description: string
}

export type ChapterContent = {
  id: string
  order: number
  title: string
  phaseId: PhaseId
  summary: string
  skillTheme: string
  lessons: ChapterPrompt[]
  capstone: ChapterPrompt
  unlocks: ChapterUnlock[]
}

function isPrompt(value: unknown): value is ChapterPrompt {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const prompt = value as Record<string, unknown>
  return (
    typeof prompt.id === 'string' &&
    typeof prompt.label === 'string' &&
    typeof prompt.focus === 'string' &&
    typeof prompt.goal === 'string' &&
    typeof prompt.text === 'string'
  )
}

export function assertChapterContent(value: unknown): asserts value is ChapterContent {
  if (typeof value !== 'object' || value === null) {
    throw new Error('Invalid chapter content: expected an object')
  }

  const chapter = value as Record<string, unknown>

  if (
    typeof chapter.id !== 'string' ||
    typeof chapter.order !== 'number' ||
    typeof chapter.title !== 'string' ||
    typeof chapter.phaseId !== 'string' ||
    typeof chapter.summary !== 'string' ||
    typeof chapter.skillTheme !== 'string' ||
    !Array.isArray(chapter.lessons) ||
    !isPrompt(chapter.capstone)
  ) {
    throw new Error('Invalid chapter content shape')
  }

  if (!chapter.lessons.every(isPrompt)) {
    throw new Error('Invalid chapter lessons')
  }
}
