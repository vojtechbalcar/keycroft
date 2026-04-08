import type { VillageState } from '@/lib/world/project-village'
import { getPhaseDefinition } from '@/lib/placement/phase-definitions'
import { VillageMap } from './village-map'
import { NextSessionCard } from './next-session-card'

type VillageOverviewProps = {
  state: VillageState
  sessionCount: number
}

export function VillageOverview({ state, sessionCount }: VillageOverviewProps) {
  // Determine current phase from the active region
  const activeRegion = state.regions.find((r) => r.definition.id === state.activeRegionId)
  const phaseId = activeRegion?.definition.phaseUnlockId ?? 'lantern'
  const phaseDefinition = getPhaseDefinition(phaseId)

  return (
    <div className="relative">
      {/* Village scene area */}
      <div
        className="relative h-[360px] w-full"
        style={{ background: '#1e3d22' }}
      >
        {/* Region pins */}
        <VillageMap state={state} />

        {/* Next session card — top right overlay */}
        <div className="absolute right-4 top-4">
          <NextSessionCard phaseDefinition={phaseDefinition} sessionCount={sessionCount} />
        </div>

        {/* Session count chip — bottom of village area */}
        <div className="absolute bottom-4 left-4">
          <div
            className="flex items-center gap-1.5 rounded-full px-3 py-1.5"
            style={{
              background: 'rgba(20,30,20,0.80)',
              border: '1px solid rgba(255,255,255,0.14)',
              backdropFilter: 'blur(4px)',
            }}
          >
            <span className="text-xs">📜</span>
            <span className="text-xs font-semibold" style={{ color: 'rgba(255,255,255,0.8)' }}>
              {sessionCount === 0
                ? 'No sessions yet'
                : `${sessionCount} session${sessionCount !== 1 ? 's' : ''} completed`}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
