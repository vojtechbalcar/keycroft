const KEY = 'keycroft.lessons.completed'

function readIds(storage: Pick<Storage, 'getItem'>): string[] {
  try {
    const raw = storage.getItem(KEY)
    return raw ? (JSON.parse(raw) as string[]) : []
  } catch {
    return []
  }
}

function writeIds(storage: Pick<Storage, 'setItem'>, ids: string[]) {
  storage.setItem(KEY, JSON.stringify(ids))
}

export function isLessonComplete(lessonId: string): boolean {
  if (typeof window === 'undefined') return false
  return readIds(window.localStorage).includes(lessonId)
}

export function markLessonComplete(lessonId: string): void {
  if (typeof window === 'undefined') return
  const ids = readIds(window.localStorage)
  if (!ids.includes(lessonId)) {
    writeIds(window.localStorage, [...ids, lessonId])
  }
}

export function readCompletedLessons(): string[] {
  if (typeof window === 'undefined') return []
  return readIds(window.localStorage)
}
