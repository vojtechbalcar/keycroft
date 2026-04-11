import type { VillageContent } from './meadow-farm'

export const desertMarket: VillageContent = {
  lessons: [
    {
      id: 'desert-market-l01',
      label: 'First Stall',
      focus: 'comma, period, colon, semicolon',
      goal: 'Hit punctuation marks cleanly without slowing.',
      text: 'salt, oil, grain: three staples. ask; take; pay. fair, fast, clean.',
    },
    {
      id: 'desert-market-l02',
      label: 'Market Sign',
      focus: '! @ # and other symbols',
      goal: 'Reach symbol keys without losing your place on the home row.',
      text: 'price: 3! ask @market. #fresh goods; buy now! salt@rate. #deal!',
    },
    {
      id: 'desert-market-l03',
      label: 'Trade Shorthand',
      focus: 'parentheses, quotes, and mixed symbols',
      goal: 'Open and close brackets and quotes without hesitation.',
      text: '"fair price" (ask first); "salt" costs (3 gold). take it, or leave.',
    },
  ],
  capstone: {
    id: 'desert-market-capstone',
    label: 'The Full Invoice',
    focus: 'all punctuation and symbols in context',
    goal: 'Type a short market record with clean symbol accuracy.',
    text: 'item: "salt" (3 bags) @ 2 gold each; total: 6! note: buy more grain. #laststock',
  },
  wordBank: [
    '"fair price" — ask before you buy',
    'salt, oil, grain: three staples',
    'price: 3 gold (negotiable)',
    '#fresh goods; first come, first served!',
    'ask @market before 9am; no refunds.',
    '"the deal" (short): pay now, carry later',
    'note: 5 bags left! buy: salt, grain.',
    'total cost: (3 + 2) = 5 gold pieces',
    '"all trades final" — no exceptions!',
    'item #7: rare spice @ 10 gold. ask.',
  ],
}
