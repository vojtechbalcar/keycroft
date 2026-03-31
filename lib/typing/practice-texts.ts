export type PracticeText = {
  id: string
  label: string
  focus: string
  text: string
}

export const practiceTexts: PracticeText[] = [
  {
    id: 'village-path',
    label: 'Village Path',
    focus: 'light rhythm',
    text: 'calm hands build quiet speed',
  },
  {
    id: 'lantern-row',
    label: 'Lantern Row',
    focus: 'clean space control',
    text: 'soft steps keep the lanterns bright',
  },
  {
    id: 'market-square',
    label: 'Market Square',
    focus: 'punctuation touch',
    text: 'clear words, steady hands, open doors.',
  },
]
