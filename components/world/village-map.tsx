import type { VillageState } from '@/lib/world/project-village'
import type { RegionId } from '@/lib/world/world-regions'

type RegionPin = {
  regionId: RegionId
  left: string
  top: string
}

const REGION_PINS: RegionPin[] = [
  { regionId: 'lantern-quarter', left: '25%', top: '55%' },
  { regionId: 'market-row', left: '55%', top: '35%' },
  { regionId: 'tower-district', left: '75%', top: '65%' },
]

const REGION_ICONS: Record<RegionId, string> = {
  'lantern-quarter': '🏮',
  'market-row': '🏪',
  'tower-district': '🗼',
}

type VillageMapProps = {
  state: VillageState
}

export function VillageMap({ state }: VillageMapProps) {
  return (
    <>
      {REGION_PINS.map(({ regionId, left, top }) => {
        const projection = state.regions.find((r) => r.definition.id === regionId)
        if (!projection) return null

        const isActive = state.activeRegionId === regionId
        const isLocked = projection.state === 'locked'

        return (
          <div
            key={regionId}
            className="absolute flex items-center gap-1.5 rounded-md px-2.5 py-1"
            style={{
              left,
              top,
              transform: 'translate(-50%, -50%)',
              background: isActive
                ? 'rgba(74,140,58,0.88)'
                : isLocked
                  ? 'rgba(20,30,20,0.55)'
                  : 'rgba(20,30,20,0.82)',
              border: isActive
                ? '1px solid rgba(122,170,130,0.6)'
                : '1px solid rgba(255,255,255,0.12)',
              backdropFilter: 'blur(4px)',
              opacity: isLocked ? 0.55 : 1,
            }}
          >
            <span className="text-xs">{isLocked ? '🔒' : REGION_ICONS[regionId]}</span>
            <span
              className="text-xs font-semibold"
              style={{ color: isActive ? '#e8f5e2' : 'rgba(255,255,255,0.85)' }}
            >
              {projection.definition.name}
            </span>
          </div>
        )
      })}
    </>
  )
}
