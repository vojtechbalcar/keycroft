import type { VillageContent } from './meadow-farm'

export const forestWatch: VillageContent = {
  lessons: [
    {
      id: 'forest-watch-l01',
      label: 'First Count',
      focus: 'number row 1–5',
      goal: 'Find the left side of the number row without looking.',
      text: '1 2 3 4 5 12 34 123 45 13 24 51 342 12345 1 2 3 4 5',
    },
    {
      id: 'forest-watch-l02',
      label: 'High Tally',
      focus: 'number row 6–0',
      goal: 'Find the right side of the number row without looking.',
      text: '6 7 8 9 0 67 89 90 78 60 789 890 6789 0 67 80 9 60 70',
    },
    {
      id: 'forest-watch-l03',
      label: 'Full Record',
      focus: 'full number row mixed',
      goal: 'Move across the entire number row without pausing.',
      text: '1234567890 10 25 36 47 89 100 305 1990 2048 0 999 12 80 456',
    },
  ],
  capstone: {
    id: 'forest-watch-capstone',
    label: 'Ancient Ledger',
    focus: 'numbers in meaningful context',
    goal: 'Type a log entry mixing numbers and words at a steady pace.',
    text: 'the watch recorded 34 pines on day 17 of month 8; 102 birds at the ridge by 9am; total: 1 clear day',
  },
  wordBank: [
    'the watch recorded 7 clear days',
    '34 pines fell in the first storm',
    'the count reached 100 by noon',
    '9 birds at the ridge; 0 at the lake',
    'day 15: still 3 unknown paths',
    'the ledger: 2048 marks; 1 page left',
    'total 57 trees; 12 paths; 1 bridge',
    '100 years; 365 days; 1 watch',
    'the 9th hour; the 3rd gate; the 1st path',
    '0 errors; 5 sessions; 80 points earned',
  ],
}
