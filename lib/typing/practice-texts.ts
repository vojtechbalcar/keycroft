import { listChapters } from '@/lib/content/list-chapters'

export type PracticeText = {
  id: string
  label: string
  focus: string
  text: string
}

export const practiceTexts: PracticeText[] = listChapters().flatMap((chapter) => [
  ...chapter.lessons,
  chapter.capstone,
])
