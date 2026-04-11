import type { VillageContent } from './meadow-farm'

export const mountainMine: VillageContent = {
  lessons: [
    {
      id: 'mountain-mine-l01',
      label: 'Break Ground',
      focus: 'b and n — lower reach keys',
      goal: 'Find b and n cleanly, return to home row each time.',
      text: 'ban bind burn blank noble bane brand blank burn; ban bin',
    },
    {
      id: 'mountain-mine-l02',
      label: 'Upper Seam',
      focus: 'q w e r p — upper row',
      goal: 'Reach up without lifting your wrists off the desk.',
      text: 'wear reap wrap pew quart prawn; weep pour wrap quart',
    },
    {
      id: 'mountain-mine-l03',
      label: 'Full Vein',
      focus: 'b n q w e r p all together',
      goal: 'Navigate the outer reaches without losing home row.',
      text: 'break the wall; burn bright; wrap the rope; pour water near',
    },
  ],
  capstone: {
    id: 'mountain-mine-capstone',
    label: 'Iron Bloom',
    focus: 'outer reaches under sustained pressure',
    goal: 'Hold accuracy through a longer sentence of outer-reach keys.',
    text: 'beneath the bare peak the burned rope; break the wall and pour the water near the iron bloom',
  },
  wordBank: [
    'break the rock beneath the peak',
    'burn bright in the narrow vein',
    'the rope runs deep below the wall',
    'pour the water; break the burn',
    'near the peak; wrap the bare beam',
    'the iron bloom burns at the wall',
    'beneath the burn; a blank peak',
    'wrap the brand; pour the brew',
    'wear the rope; burn the ruin near',
    'a proud peak; a burnt wall; an open vein',
  ],
}
