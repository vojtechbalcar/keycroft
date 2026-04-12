import { describe, expect, it } from 'vitest'

import { fishingDocks } from '@/content/villages/fishing-docks'
import { meadowFarm } from '@/content/villages/meadow-farm'
import { buildVillageLessonGallery } from '@/lib/content/build-village-lesson-gallery'
import { getVillageDefinition } from '@/lib/world/village-definitions'

describe('buildVillageLessonGallery', () => {
  it('expands meadow farm into a long lesson path with mirrored home-row pairs', () => {
    const lessons = buildVillageLessonGallery(
      meadowFarm,
      getVillageDefinition('meadow-farm'),
    )

    expect(lessons).toHaveLength(30)
    expect(lessons[0]?.label).toBe('Keys F and J')
    expect(lessons.some((lesson) => lesson.label === 'Keys D and K')).toBe(true)
    expect(lessons.at(-1)?.kind).toBe('capstone')
  })

  it('uses sequential pair drills for non-home-row villages', () => {
    const lessons = buildVillageLessonGallery(
      fishingDocks,
      getVillageDefinition('fishing-docks'),
    )

    expect(lessons).toHaveLength(22)
    expect(lessons[0]?.label).toBe('Keys G and H')
    expect(lessons.some((lesson) => lesson.label === 'Keys T and Y')).toBe(true)
  })

  it('returns unique lesson ids in display order', () => {
    const lessons = buildVillageLessonGallery(
      meadowFarm,
      getVillageDefinition('meadow-farm'),
    )

    expect(new Set(lessons.map((lesson) => lesson.id)).size).toBe(lessons.length)
    expect(lessons[0]?.order).toBe(1)
    expect(lessons.at(-1)?.order).toBe(lessons.length)
  })
})
