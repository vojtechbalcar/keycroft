import { describe, expect, it } from 'vitest'

import { listChapters } from '@/lib/content/list-chapters'
import { loadChapter } from '@/lib/content/load-chapter'

describe('chapter content', () => {
  it('lists the first three chapters in learning order', () => {
    const chapters = listChapters()

    expect(chapters.map((chapter) => chapter.id)).toEqual([
      'ch01-arrival',
      'ch02-home-row',
      'ch03-reach-control',
    ])
  })

  it('loads a chapter with typed lessons and a capstone prompt', () => {
    const chapter = loadChapter('ch02-home-row')

    expect(chapter.title).toBe('Home Row Stability')
    expect(chapter.phaseId).toBe('lantern')
    expect(chapter.lessons).toHaveLength(3)
    expect(chapter.lessons[0].text.length).toBeGreaterThan(12)
    expect(chapter.capstone.id).toBe('ch02-home-row-capstone')
  })

  it('throws when a chapter id is unknown', () => {
    expect(() => loadChapter('missing-chapter')).toThrow(/unknown chapter/i)
  })
})
