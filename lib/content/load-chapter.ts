import type { ChapterContent } from '@/lib/content/chapter-schema'
import { assertChapterContent } from '@/lib/content/chapter-schema'

import ch01Arrival from '@/content/chapters/ch01-arrival.json'
import ch02HomeRow from '@/content/chapters/ch02-home-row.json'
import ch03ReachControl from '@/content/chapters/ch03-reach-control.json'

const chapterEntries = [
  ch01Arrival,
  ch02HomeRow,
  ch03ReachControl,
] satisfies unknown[]

const chaptersById = new Map<string, ChapterContent>()

for (const entry of chapterEntries) {
  assertChapterContent(entry)
  chaptersById.set(entry.id, entry)
}

export function loadChapter(chapterId: string): ChapterContent {
  const chapter = chaptersById.get(chapterId)
  if (!chapter) {
    throw new Error(`Unknown chapter: ${chapterId}`)
  }
  return chapter
}
