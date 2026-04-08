import type { PhaseId } from '@/lib/placement/phase-definitions'

export type RegionId = 'lantern-quarter' | 'market-row' | 'tower-district'

export type RegionState = 'locked' | 'active' | 'flourishing'

export type RegionDefinition = {
  id: RegionId
  name: string
  skillDomain: string
  phaseUnlockId: PhaseId
  description: string
}

export const regionDefinitions: RegionDefinition[] = [
  {
    id: 'lantern-quarter',
    name: 'Lantern Quarter',
    skillDomain: 'Home row accuracy',
    phaseUnlockId: 'lantern',
    description: 'Quiet streets lit by warm lanterns where every keystroke finds its home.',
  },
  {
    id: 'market-row',
    name: 'Market Row',
    skillDomain: 'Speed and flow',
    phaseUnlockId: 'workshop',
    description: 'A bustling lane where traders move fast and rhythm is everything.',
  },
  {
    id: 'tower-district',
    name: 'Tower District',
    skillDomain: 'Precision under pressure',
    phaseUnlockId: 'lookout',
    description: 'Tall spires demand steady hands and sharp focus at every keystroke.',
  },
]

export function getRegionDefinition(regionId: RegionId): RegionDefinition {
  const definition = regionDefinitions.find((region) => region.id === regionId)
  if (!definition) {
    throw new Error(`Unknown region: ${regionId}`)
  }
  return definition
}
