import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { VillageMap } from '@/components/world/village-map'
import type { VillageState } from '@/lib/world/project-village'

function makeVillageState(overrides: Partial<VillageState> = {}): VillageState {
  return {
    activeRegionId: 'lantern-quarter',
    sessionCount: 0,
    canProgress: true,
    regions: [
      {
        definition: {
          id: 'lantern-quarter',
          name: 'Lantern Quarter',
          skillDomain: 'Home row accuracy',
          phaseUnlockId: 'lantern',
          description: 'Quiet streets lit by warm lanterns.',
        },
        state: 'active',
      },
      {
        definition: {
          id: 'market-row',
          name: 'Market Row',
          skillDomain: 'Speed and flow',
          phaseUnlockId: 'workshop',
          description: 'A bustling lane.',
        },
        state: 'locked',
      },
      {
        definition: {
          id: 'tower-district',
          name: 'Tower District',
          skillDomain: 'Precision under pressure',
          phaseUnlockId: 'lookout',
          description: 'Tall spires.',
        },
        state: 'locked',
      },
    ],
    ...overrides,
  }
}

describe('VillageMap', () => {
  it('renders all 3 region names', () => {
    render(<VillageMap state={makeVillageState()} />)

    expect(screen.getByText('Lantern Quarter')).toBeInTheDocument()
    expect(screen.getByText('Market Row')).toBeInTheDocument()
    expect(screen.getByText('Tower District')).toBeInTheDocument()
  })

  it('locked regions show lock icon', () => {
    render(<VillageMap state={makeVillageState()} />)

    // market-row and tower-district are locked — each gets a 🔒 icon
    const lockIcons = screen.getAllByText('🔒')
    expect(lockIcons).toHaveLength(2)
  })

  it('active region label has accent colour styling distinct from locked regions', () => {
    render(<VillageMap state={makeVillageState()} />)

    // The active region name uses a distinct colour (#e8f5e2) while locked ones use rgba(255,255,255,0.85)
    const lanternLabel = screen.getByText('Lantern Quarter')
    expect(lanternLabel).toHaveStyle({ color: '#e8f5e2' })
  })
})
