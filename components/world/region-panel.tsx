import type { RegionProjection } from '@/lib/world/project-village'
import type { RegionState } from '@/lib/world/world-regions'

type RegionPanelProps = {
  projection: RegionProjection
}

function stateBadge(state: RegionState): { icon: string; label: string; color: string } {
  switch (state) {
    case 'active':
      return { icon: '🌱', label: 'Active', color: 'var(--kc-accent)' }
    case 'flourishing':
      return { icon: '🌿', label: 'Flourishing', color: 'var(--kc-muted)' }
    case 'locked':
      return { icon: '🔒', label: 'Locked', color: '#9aaa8e' }
  }
}

export function RegionPanel({ projection }: RegionPanelProps) {
  const { definition, state } = projection
  const badge = stateBadge(state)

  return (
    <div
      className="rounded-xl p-5"
      style={{ background: 'var(--kc-surface)', border: '1px solid var(--kc-line-light)' }}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3
            className="text-sm font-bold leading-snug"
            style={{ color: 'var(--kc-text-dark)' }}
          >
            {definition.name}
          </h3>
          <p className="mt-0.5 text-[10px] uppercase tracking-[0.15em]" style={{ color: 'var(--kc-muted)' }}>
            {definition.skillDomain}
          </p>
        </div>
        <span
          className="flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider"
          style={{ background: `${badge.color}22`, color: badge.color, border: `1px solid ${badge.color}55` }}
        >
          {badge.icon} {badge.label}
        </span>
      </div>
      <p
        className="mt-3 text-xs leading-5"
        style={{ color: '#6a7a5e' }}
      >
        {definition.description}
      </p>
    </div>
  )
}
