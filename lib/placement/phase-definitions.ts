export type PhaseId = 'lantern' | 'workshop' | 'lookout'

export type PhaseDefinition = {
  id: PhaseId
  name: string
  summary: string
  recommendedFocus: string
}

export const defaultPhaseId: PhaseId = 'lantern'

export const phaseDefinitions: PhaseDefinition[] = [
  {
    id: 'lantern',
    name: 'Lantern Room',
    summary: 'Build clean key recall with calm, repeatable rhythm.',
    recommendedFocus: 'Slow enough to stay accurate, then add pace later.',
  },
  {
    id: 'workshop',
    name: 'Workshop Lane',
    summary: 'Your hands already know the route. Now tighten consistency.',
    recommendedFocus: 'Hold accuracy while gradually stretching speed.',
  },
  {
    id: 'lookout',
    name: 'Lookout Point',
    summary: 'You already move quickly. Focus on polish and staying relaxed.',
    recommendedFocus: 'Refine control so speed stays clean under pressure.',
  },
]

export function getPhaseDefinition(phaseId: PhaseId): PhaseDefinition {
  const definition = phaseDefinitions.find((phase) => phase.id === phaseId)
  if (!definition) {
    throw new Error(`Unknown phase: ${phaseId}`)
  }
  return definition
}
