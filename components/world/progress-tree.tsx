import type { PhaseId } from '@/lib/placement/phase-definitions'
import type { RegionProjection } from '@/lib/world/project-village'
import { phaseOrder } from '@/lib/world/world-rules'

type ProgressTreeProps = {
  currentPhaseId: PhaseId | null
  regions: RegionProjection[]
}

type PhaseNode = {
  phaseId: PhaseId
  label: string
  regionName: string
}

const PHASE_NODES: PhaseNode[] = [
  { phaseId: 'lantern', label: 'Lantern Room', regionName: 'Lantern Quarter' },
  { phaseId: 'workshop', label: 'Workshop Lane', regionName: 'Market Row' },
  { phaseId: 'lookout', label: 'Lookout Point', regionName: 'Tower District' },
]

type DotState = 'active' | 'completed' | 'locked'

function getDotState(phaseId: PhaseId, currentPhaseId: PhaseId | null): DotState {
  if (currentPhaseId === null) {
    return phaseId === 'lantern' ? 'active' : 'locked'
  }
  const current = phaseOrder(currentPhaseId)
  const node = phaseOrder(phaseId)
  if (node < current) return 'completed'
  if (node === current) return 'active'
  return 'locked'
}

const DOT_STYLES: Record<DotState, { bg: string; border: string; label: string }> = {
  active: {
    bg: 'var(--kc-warm)',
    border: 'var(--kc-warm)',
    label: 'var(--kc-text-dark)',
  },
  completed: {
    bg: 'var(--kc-accent)',
    border: 'var(--kc-accent)',
    label: '#6a7a5e',
  },
  locked: {
    bg: '#d8cfbc',
    border: '#c8bfac',
    label: '#9aaa8e',
  },
}

export function ProgressTree({ currentPhaseId }: ProgressTreeProps) {
  return (
    <div className="rounded-xl p-5" style={{ background: '#faf7f0', border: '1px solid var(--kc-line-light)' }}>
      <div className="flex items-center gap-2 mb-4">
        <span>🗺</span>
        <h3 className="text-xs font-bold uppercase tracking-[0.18em]" style={{ color: 'var(--kc-accent)' }}>
          Village Progress
        </h3>
      </div>

      <div className="flex items-start">
        {PHASE_NODES.map((node, index) => {
          const dotState = getDotState(node.phaseId, currentPhaseId)
          const styles = DOT_STYLES[dotState]
          const isLast = index === PHASE_NODES.length - 1

          return (
            <div key={node.phaseId} className="flex flex-1 items-start">
              {/* Dot + label */}
              <div className="flex flex-col items-center" style={{ minWidth: 0, flex: 1 }}>
                <div
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold"
                  style={{
                    background: styles.bg,
                    border: `2px solid ${styles.border}`,
                    color: dotState === 'active' ? '#1c2e1e' : dotState === 'completed' ? 'white' : '#9aaa8e',
                    boxShadow: dotState === 'active' ? '0 0 0 3px rgba(212,168,80,0.25)' : undefined,
                  }}
                >
                  {dotState === 'completed' ? '✓' : dotState === 'locked' ? '·' : '●'}
                </div>
                <p
                  className="mt-2 text-center text-[10px] font-semibold leading-4"
                  style={{ color: styles.label }}
                >
                  {node.label}
                </p>
                <p
                  className="mt-0.5 text-center text-[9px] leading-4"
                  style={{ color: dotState === 'locked' ? '#b8c8b0' : 'var(--kc-muted)' }}
                >
                  {node.regionName}
                </p>
              </div>

              {/* Connector line between nodes */}
              {!isLast && (
                <div
                  className="mt-4 h-0.5 shrink-0"
                  style={{
                    flex: 0.3,
                    background: getDotState(PHASE_NODES[index + 1].phaseId, currentPhaseId) === 'locked'
                      ? '#d8cfbc'
                      : 'var(--kc-accent)',
                  }}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
