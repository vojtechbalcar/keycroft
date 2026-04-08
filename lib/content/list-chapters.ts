import type { ChapterContent } from '@/lib/content/chapter-schema'
import { loadChapter } from '@/lib/content/load-chapter'

const chapterIds = ['ch01-arrival', 'ch02-home-row', 'ch03-reach-control'] as const

export function listChapters(): ChapterContent[] {
  return chapterIds.map((chapterId) => loadChapter(chapterId))
}
