export type SkillId =
  | 'sharp-eye'
  | 'quick-hands'
  | 'clutch'
  | 'resource-magnet'
  | 'lucky-strike'
  | 'second-chance'

export type SkillBranch = 'performance' | 'economy'

export type SkillDefinition = {
  id: SkillId
  branch: SkillBranch
  name: string
  description: string
  pointCost: number
  requires: SkillId | null
}

export const skillDefinitions: SkillDefinition[] = [
  {
    id: 'sharp-eye',
    branch: 'performance',
    name: 'Sharp Eye',
    description: 'Accuracy counts 20% more toward your boss score.',
    pointCost: 1,
    requires: null,
  },
  {
    id: 'quick-hands',
    branch: 'performance',
    name: 'Quick Hands',
    description: '+5 WPM added to your boss score calculation.',
    pointCost: 1,
    requires: 'sharp-eye',
  },
  {
    id: 'clutch',
    branch: 'performance',
    name: 'Clutch',
    description: '+20% score bonus applied to your final boss score.',
    pointCost: 2,
    requires: 'quick-hands',
  },
  {
    id: 'resource-magnet',
    branch: 'economy',
    name: 'Resource Magnet',
    description: '+15% gold from all lessons.',
    pointCost: 1,
    requires: null,
  },
  {
    id: 'lucky-strike',
    branch: 'economy',
    name: 'Lucky Strike',
    description: '20% chance to double your rare material on boss win.',
    pointCost: 1,
    requires: 'resource-magnet',
  },
  {
    id: 'second-chance',
    branch: 'economy',
    name: 'Second Chance',
    description: 'One free retry on a boss fight per chapter. Still wins full loot.',
    pointCost: 2,
    requires: 'lucky-strike',
  },
]

export function getSkillDefinition(id: SkillId): SkillDefinition {
  const def = skillDefinitions.find((s) => s.id === id)
  if (!def) throw new Error(`Unknown skill: ${id}`)
  return def
}

export function canUnlockSkill(
  skillId: SkillId,
  unlockedSkills: SkillId[],
  availablePoints: number,
): boolean {
  const def = getSkillDefinition(skillId)
  if (unlockedSkills.includes(skillId)) return false
  if (availablePoints < def.pointCost) return false
  if (def.requires && !unlockedSkills.includes(def.requires)) return false
  return true
}
