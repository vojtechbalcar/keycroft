import type {
  VillageContent,
  VillageLesson,
} from '@/content/villages/meadow-farm'
import type { VillageDefinition } from '@/lib/world/village-definitions'

export type VillageLessonGalleryItem = VillageLesson & {
  order: number
  kind: 'foundation' | 'story' | 'authored' | 'capstone' | 'combo'
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

/**
 * Produces 80–120 character text for a key pair drill.
 * variant: 0=intro, 1=return, 2=rhythm, 3=reverse, 4=speed-1, 5=speed-2, 6=words, 7=phrase
 */
function buildLongPatternText(left: string, right: string, variant: number): string {
  const L = left
  const R = right
  const LL = `${L}${L}`
  const RR = `${R}${R}`
  const LR = `${L}${R}`
  const RL = `${R}${L}`
  const LRL = `${L}${R}${L}`
  const RLR = `${R}${L}${R}`
  const LLRR = `${L}${L}${R}${R}`
  const RRLL = `${R}${R}${L}${L}`
  const LRLR = `${L}${R}${L}${R}`
  const RLRL = `${R}${L}${R}${L}`

  // Words that can be formed from home-row letters only — keyed to specific pairs
  const wordMap: Record<string, string> = {
    'dk': 'dad add dads adds fad fads sad sads flask dad add dads fads asks all flask falls dad adds',
    'kd': 'dad add dads adds fad fads sad sads flask dad add dads fads asks all flask falls dad adds',
    'sl': 'all falls lass lads all falls lass lads salads all falls lass lads all falls salads lads lass',
    'ls': 'all falls lass lads all falls lass lads salads all falls lass lads all falls salads lads lass',
    'a;': 'all ask all ask add all ask add all ask all ads ask dads all ask adds all ask add all',
    ';a': 'all ask all ask add all ask add all ask all ads ask dads all ask adds all ask add all',
    'fj': `${LL} ${RR} ${LR} ${RL} ${LRL} ${RLR} ${LL} ${RR} ${LRLR} ${RLRL} ${LR} ${RL} ${LRL} ${RLR} ${LL} ${RR}`,
    'jf': `${RR} ${LL} ${RL} ${LR} ${RLR} ${LRL} ${RR} ${LL} ${RLRL} ${LRLR} ${RL} ${LR} ${RLR} ${LRL} ${RR} ${LL}`,
  }

  const pairKey = `${L}${R}`

  // phrase variant text — blends previous keys with the current pair
  const phraseMap: Record<string, string> = {
    'fj': `${LL} ${RR} ${LR} ${RL} ${LL} ${RR} ${LRLR} ${RLRL} ${LRL} ${RLR} ${LLRR} ${RRLL} ${LR} ${RL} ${LL} ${RR} ${LR}`,
    'dk': 'add a flask; ask all dads; a sad lad falls; add all fads; flask falls; ask a dad; all fall',
    'sl': 'all falls lass; a sad lass falls; lads ask all; fall all flasks; lass falls; all lads fall;',
    'a;': 'ask a dad; all fall; add all ads; a sad lad asks; falls all; flask falls; ask all dads fall',
  }

  switch (variant) {
    case 0: // intro — clean left-right alternation
      return `${LL} ${RR} ${LR} ${RL} ${LRL} ${RLR} ${LLRR} ${RRLL} ${LL} ${RR} ${LR} ${RL} ${LRLR} ${RLRL} ${LL} ${RR} ${LR} ${RL}`
        .slice(0, 120)

    case 1: // return — outward and back with extension
      return `${LR} ${RL} ${LR} ${RL} ${LRL} ${RLR} ${LR} ${RL} ${LRLR} ${RLRL} ${LR} ${RL} ${LRL} ${RLR} ${LLRR} ${RRLL} ${LRLR} ${RLRL} ${LR} ${RL}`
        .slice(0, 120)

    case 2: // rhythm — slow even beats
      return `${L} ${R} ${L} ${R} ${LR} ${RL} ${L} ${R} ${L} ${R} ${RL} ${LR} ${L} ${R} ${LR} ${RL} ${LRL} ${RLR} ${L} ${R} ${L} ${R} ${LR} ${RL} ${LRL} ${RLR} ${LR} ${RL}`
        .slice(0, 120)

    case 3: // reverse — right-to-left emphasis
      return `${RL} ${RL} ${RR} ${LL} ${RR} ${LL} ${RLR} ${LRL} ${RL} ${RL} ${RR} ${LL} ${RLRL} ${LRLR} ${RR} ${LL} ${RL} ${RL} ${RLR} ${LRL} ${RRLL} ${LLRR}`
        .slice(0, 120)

    case 4: // speed-1 — faster groupings
      return `${LRL} ${RLR} ${LRL} ${RLR} ${LLRR} ${RRLL} ${LLRR} ${RRLL} ${LRLR} ${RLRL} ${LRLR} ${RLRL} ${LLRR} ${RRLL} ${LRL} ${RLR} ${LRL} ${RLR}`
        .slice(0, 120)

    case 5: // speed-2 — maximum repetition
      return `${LR} ${LR} ${LR} ${LR} ${RL} ${RL} ${RL} ${RL} ${LRLR} ${RLRL} ${LRLR} ${RLRL} ${LR} ${LR} ${LR} ${LR} ${RL} ${RL} ${RL} ${RL} ${LRL} ${RLR} ${LRL} ${RLR}`
        .slice(0, 120)

    case 6: // words — real words when possible, extended pattern for f/j
      return (wordMap[pairKey] ?? `${LL} ${RR} ${LR} ${RL} ${LRL} ${RLR} ${LRLR} ${RLRL} ${LLRR} ${RRLL} ${LR} ${RL} ${LRL} ${RLR} ${LL} ${RR} ${LRLR} ${RLRL}`)
        .slice(0, 120)

    case 7: // phrase — blended with known keys
      return (phraseMap[pairKey] ?? `${LR} ${RL} ${LRLR} ${RLRL} ${LRL} ${RLR} ${LLRR} ${RRLL} ${LR} ${RL} ${LRL} ${RLR} ${LRLR} ${RLRL} ${LR} ${RL}`)
        .slice(0, 120)

    default:
      return `${LL} ${RR} ${LR} ${RL} ${LRL} ${RLR} ${LLRR} ${RRLL} ${LRLR} ${RLRL}`.slice(0, 120)
  }
}

const VARIANT_META = [
  {
    suffix: 'intro',
    labelSuffix: 'pair introduction',
    focus: 'pair intro',
    goal: 'Feel the pair under your fingers without rushing.',
  },
  {
    suffix: 'return',
    labelSuffix: 'return path',
    focus: 'outward and back',
    goal: 'Return to home position cleanly after each reach.',
  },
  {
    suffix: 'rhythm',
    labelSuffix: 'quiet rhythm',
    focus: 'repetition with light pressure',
    goal: 'Keep the rhythm even enough that the hands stay relaxed.',
  },
  {
    suffix: 'reverse',
    labelSuffix: 'reverse emphasis',
    focus: 'right-to-left priority',
    goal: 'Lead with the right-hand key and feel its mirror return.',
  },
  {
    suffix: 'speed-1',
    labelSuffix: 'speed drill I',
    focus: 'faster grouped patterns',
    goal: 'Push pace while keeping finger placement clean.',
  },
  {
    suffix: 'speed-2',
    labelSuffix: 'speed drill II',
    focus: 'maximum repetition density',
    goal: 'Let the fingers settle into the pattern at higher speed.',
  },
  {
    suffix: 'words',
    labelSuffix: 'real words',
    focus: 'pair keys inside vocabulary',
    goal: 'Carry the same key control into recognisable words.',
  },
  {
    suffix: 'phrase',
    labelSuffix: 'phrase blend',
    focus: 'pair inside a full phrase',
    goal: 'Blend the pair naturally with surrounding home-row keys.',
  },
]

function buildFoundationLessons(
  definition: VillageDefinition,
  _content: VillageContent,
): DraftVillageLessonGalleryItem[] {
  const focusKeys = definition.keyFocus.filter((key) => key !== 'all')
  const focusGroups = buildMirroredHomeRowGroups(focusKeys)

  return focusGroups.flatMap((keys, groupIndex) => {
    const label = formatPairLabel(keys)
    const keyLabel = `${titleCaseKey(keys[0])}/${titleCaseKey(keys[1])}`
    const [left, right] = keys

    return VARIANT_META.map((meta, variantIndex) => ({
      id: `${definition.id}-foundation-${groupIndex + 1}-${meta.suffix}`,
      label: variantIndex === 0 ? label : `${keyLabel} ${meta.labelSuffix}`,
      focus: `${keyLabel} ${meta.focus}`,
      goal: meta.goal,
      text: buildLongPatternText(left, right, variantIndex),
      kind: 'foundation' as const,
      keyFocus: keys,
      isGenerated: true,
    }))
  })
}

const HOME_ROW_COMBO_TEXTS = [
  'ff jj ff jj dd kk dd kk ss ll ss ll aa ;; aa ;; fj dk sl a; fj dk sl a; ff jj dd kk ss ll aa ;;',
  'fj jf fj jf dk kd dk kd sl ls sl ls a; ;a a; ;a fj jf dk kd sl ls a; ;a fj jf dk kd sl ls a;',
  'fjdk dksl slaf; fjdk dksl slaf; fjdk dksl slaf; fjdk dksl slaf; fjdk dksl slaf; fjdk dksl',
  'add all ask dad fall flask lads lass sad salad fads falls all add ask dad fall flask lads lass sad',
  'all dads ask; flask falls; a sad lass falls; lads add all; flask falls; ask a dad; all lads fall;',
  'ff dd ss aa jj kk ll ;; ff dd ss aa jj kk ll ;; fj dk sl a; ;a ls kd jf fj dk sl a; ;a ls kd jf',
  'fad lad sad dad add all ask fall flask lass lads fads salad falls asks dads fads flask lads lass all',
  'ask all lads; a flask falls; sad dads fall; all adds ask; fall all flasks; lads all ask; dads fall;',
]

const HOME_ROW_COMBO_GOALS = [
  'Alternate left and right pairs across all eight home keys.',
  'Weave outward and back across the full row without pausing.',
  'Flow through all four pairs in a rolling chain without breaks.',
  'Let real words anchor your fingers while covering all home keys.',
  'Carry phrase rhythm across all home keys at a comfortable pace.',
  'Drill every column pair in order, then reverse — full row fluency.',
  'Move through home-row vocabulary building speed and accuracy together.',
  'Read the semicolons as punctuation and keep your pace through full phrases.',
]

function buildComboLessons(
  definition: VillageDefinition,
): DraftVillageLessonGalleryItem[] {
  const focusKeys = definition.keyFocus.filter((key) => key !== 'all')

  return HOME_ROW_COMBO_TEXTS.map((text, index) => ({
    id: `${definition.id}-combo-${index + 1}`,
    label: `Full Home Row — Drill ${index + 1}`,
    focus: 'all eight home row keys together',
    goal: HOME_ROW_COMBO_GOALS[index] ?? 'Cover all home row keys in a single unbroken run.',
    text,
    kind: 'combo' as const,
    keyFocus: focusKeys,
    isGenerated: true,
  }))
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
  const combo = buildComboLessons(definition)
  const capstone = {
    ...content.capstone,
    kind: 'capstone' as const,
    keyFocus: definition.keyFocus.filter((key) => key !== 'all'),
    isGenerated: false,
  }

  return [...foundation, ...authored, ...storyLines, ...combo, capstone].map(
    (lesson, index) => ({
      ...lesson,
      order: index + 1,
    }),
  )
}
