import type {
  VillageContent,
  VillageLesson,
} from '@/content/villages/meadow-farm'
import type { VillageDefinition } from '@/lib/world/village-definitions'

export type VillageLessonGalleryItem = VillageLesson & {
  order: number
  kind: 'foundation' | 'story' | 'authored' | 'capstone'
  keyFocus: string[]
  isGenerated: boolean
}

type DraftVillageLessonGalleryItem = Omit<VillageLessonGalleryItem, 'order'>

function titleCaseKey(key: string): string {
  return key === ';' ? ';' : key.toUpperCase()
}

function formatPairLabel(keys: string[]): string {
  return `Keys ${titleCaseKey(keys[0])} and ${titleCaseKey(keys[1])}`
}

function buildMirroredHomeRowGroups(keys: string[]): string[][] {
  if (keys.join(',') === 'a,s,d,f,j,k,l,;') {
    return [
      ['f', 'j'],
      ['d', 'k'],
      ['s', 'l'],
      ['a', ';'],
    ]
  }

  const groups: string[][] = []

  for (let index = 0; index < keys.length; index += 2) {
    const pair = keys.slice(index, index + 2)

    if (pair.length === 2) {
      groups.push(pair)
    }
  }

  return groups
}

function buildPatternText(keys: string[], variant: number): string {
  const [left, right] = keys
  const patterns = [
    `${left}${left} ${right}${right} ${left}${right} ${right}${left} ${left}${left} ${right}${right} ${left}${right} ${right}${left}`,
    `${left}${right} ${left}${right}${left} ${right}${left} ${right}${left}${right} ${left}${right} ${right}${left}`,
    `${left} ${right} ${left}${right} ${right}${left} ${left}${left}${right} ${right}${right}${left} ${left}${right}${left}`,
    `${right}${left}${left} ${left}${right}${right} ${right}${left} ${left}${right} ${right}${right}${left} ${left}${left}${right}`,
  ]

  return patterns[variant % patterns.length]
}

function buildFoundationLessons(
  definition: VillageDefinition,
  content: VillageContent,
): DraftVillageLessonGalleryItem[] {
  const focusKeys = definition.keyFocus.filter((key) => key !== 'all')
  const focusGroups = buildMirroredHomeRowGroups(focusKeys)

  return focusGroups.flatMap((keys, groupIndex) => {
    const storyLine = content.wordBank[groupIndex % content.wordBank.length]
    const label = formatPairLabel(keys)
    const keyLabel = `${titleCaseKey(keys[0])}/${titleCaseKey(keys[1])}`

    return [
      {
        id: `${definition.id}-foundation-${groupIndex + 1}-intro`,
        label,
        focus: `${keyLabel} pair introduction`,
        goal: 'Feel the pair under your fingers without rushing.',
        text: buildPatternText(keys, 0),
        kind: 'foundation' as const,
        keyFocus: keys,
        isGenerated: true,
      },
      {
        id: `${definition.id}-foundation-${groupIndex + 1}-return`,
        label: `${keyLabel} return path`,
        focus: `${keyLabel} outward and back`,
        goal: 'Return to home position cleanly after each reach.',
        text: buildPatternText(keys, 1),
        kind: 'foundation' as const,
        keyFocus: keys,
        isGenerated: true,
      },
      {
        id: `${definition.id}-foundation-${groupIndex + 1}-rhythm`,
        label: `${keyLabel} quiet rhythm`,
        focus: `${keyLabel} repetition with light pressure`,
        goal: 'Keep the rhythm even enough that the hands stay relaxed.',
        text: buildPatternText(keys, 2),
        kind: 'foundation' as const,
        keyFocus: keys,
        isGenerated: true,
      },
      {
        id: `${definition.id}-foundation-${groupIndex + 1}-story`,
        label: `${label} in a village line`,
        focus: `${keyLabel} inside a real phrase`,
        goal: 'Carry the same key control into a fuller line.',
        text: storyLine,
        kind: 'foundation' as const,
        keyFocus: keys,
        isGenerated: true,
      },
    ]
  })
}

function buildStoryLessons(
  definition: VillageDefinition,
  content: VillageContent,
): DraftVillageLessonGalleryItem[] {
  return content.wordBank.map((line, index) => ({
    id: `${definition.id}-story-${index + 1}`,
    label: `Village line ${String(index + 1).padStart(2, '0')}`,
    focus: `${definition.name.toLowerCase()} phrase practice`,
    goal: 'Settle into a full phrase that still uses the village skill.',
    text: line,
    kind: 'story' as const,
    keyFocus: definition.keyFocus.filter((key) => key !== 'all'),
    isGenerated: true,
  }))
}

export function buildVillageLessonGallery(
  content: VillageContent,
  definition: VillageDefinition,
): VillageLessonGalleryItem[] {
  const foundation = buildFoundationLessons(definition, content)
  const storyLines = buildStoryLessons(definition, content)
  const authored = content.lessons.map((lesson) => ({
    ...lesson,
    kind: 'authored' as const,
    keyFocus: definition.keyFocus.filter((key) => key !== 'all'),
    isGenerated: false,
  }))
  const capstone = {
    ...content.capstone,
    kind: 'capstone' as const,
    keyFocus: definition.keyFocus.filter((key) => key !== 'all'),
    isGenerated: false,
  }

  return [...foundation, ...authored, ...storyLines, capstone].map(
    (lesson, index) => ({
      ...lesson,
      order: index + 1,
    }),
  )
}
