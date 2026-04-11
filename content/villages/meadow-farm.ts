export type VillageLesson = {
  id: string
  label: string
  focus: string
  goal: string
  text: string
}

export type VillageContent = {
  lessons: VillageLesson[]
  capstone: VillageLesson
  wordBank: string[]
}

export const meadowFarm: VillageContent = {
  lessons: [
    {
      id: 'meadow-farm-l01',
      label: 'First Furrow',
      focus: 'home row — left hand (asdf)',
      goal: 'Find the home keys without looking.',
      text: 'a sad dad asks fall glass flask lass dads fads',
    },
    {
      id: 'meadow-farm-l02',
      label: 'Even Ground',
      focus: 'home row — right hand (jkl;)',
      goal: 'Let the right hand settle into its keys.',
      text: 'jkl; hall lash fall skull all jak kill lull; lads',
    },
    {
      id: 'meadow-farm-l03',
      label: 'Full Row',
      focus: 'home row — both hands together',
      goal: 'Keep both hands calm and unhurried.',
      text: 'ask a lad; fall all jaks; a sad flask shall last',
    },
  ],
  capstone: {
    id: 'meadow-farm-capstone',
    label: 'Harvest Check',
    focus: 'home row rhythm',
    goal: 'Prove the home row feels natural at a gentle pace.',
    text: 'a glad lad shall ask a lass; all fall tasks shall last a full season',
  },
  wordBank: [
    'calm hands build quiet speed',
    'soft steps keep the field alive',
    'a slow harvest fills the barn',
    'the lark asks for a still lake',
    'all hands fall still at dusk',
    'a flask of dark ale; a glad fire',
    'fall grass; dusk; a last flask',
    'ask the lads; all shall fall still',
    'glad hands shall keep a full shelf',
    'a sad fall shall ask a dark flask',
  ],
}
