import type { PhaseId } from '@/lib/placement/phase-definitions'

type KeyboardHeatmapProps = {
  phaseId: PhaseId | null
  averageAccuracy: number
  totalCorrectedErrors: number
  totalSessions: number
}

type Zone = 'numbers' | 'anchor' | 'home' | 'reach'

const rows: Array<Array<{ key: string; zone: Zone }>> = [
  [
    { key: '1', zone: 'numbers' },
    { key: '2', zone: 'numbers' },
    { key: '3', zone: 'numbers' },
    { key: '4', zone: 'numbers' },
    { key: '5', zone: 'numbers' },
    { key: '6', zone: 'numbers' },
    { key: '7', zone: 'numbers' },
    { key: '8', zone: 'numbers' },
    { key: '9', zone: 'numbers' },
    { key: '0', zone: 'numbers' },
  ],
  [
    { key: 'Q', zone: 'anchor' },
    { key: 'W', zone: 'anchor' },
    { key: 'E', zone: 'anchor' },
    { key: 'R', zone: 'reach' },
    { key: 'T', zone: 'reach' },
    { key: 'Y', zone: 'reach' },
    { key: 'U', zone: 'reach' },
    { key: 'I', zone: 'anchor' },
    { key: 'O', zone: 'anchor' },
    { key: 'P', zone: 'anchor' },
  ],
  [
    { key: 'A', zone: 'home' },
    { key: 'S', zone: 'home' },
    { key: 'D', zone: 'home' },
    { key: 'F', zone: 'home' },
    { key: 'G', zone: 'reach' },
    { key: 'H', zone: 'reach' },
    { key: 'J', zone: 'home' },
    { key: 'K', zone: 'home' },
    { key: 'L', zone: 'home' },
    { key: ';', zone: 'home' },
  ],
  [
    { key: 'Z', zone: 'reach' },
    { key: 'X', zone: 'anchor' },
    { key: 'C', zone: 'anchor' },
    { key: 'V', zone: 'reach' },
    { key: 'B', zone: 'reach' },
    { key: 'N', zone: 'reach' },
    { key: 'M', zone: 'reach' },
    { key: ',', zone: 'anchor' },
    { key: '.', zone: 'anchor' },
    { key: '/', zone: 'anchor' },
  ],
]

const baseIntensity: Record<NonNullable<KeyboardHeatmapProps['phaseId']>, Record<Zone, number>> = {
  lantern: {
    numbers: 1,
    anchor: 2,
    home: 4,
    reach: 2,
  },
  workshop: {
    numbers: 1,
    anchor: 3,
    home: 3,
    reach: 4,
  },
  lookout: {
    numbers: 2,
    anchor: 4,
    home: 2,
    reach: 3,
  },
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

function getZoneIntensity({
  phaseId,
  zone,
  averageAccuracy,
  averageCorrections,
}: {
  phaseId: KeyboardHeatmapProps['phaseId']
  zone: Zone
  averageAccuracy: number
  averageCorrections: number
}) {
  const base = phaseId ? baseIntensity[phaseId][zone] : 2
  let next = base

  if (averageCorrections >= 2 && (zone === 'home' || zone === 'reach')) {
    next += 1
  }

  if (averageCorrections >= 3 && zone === 'home') {
    next += 1
  }

  if (averageAccuracy >= 97 && zone === 'home') {
    next -= 1
  }

  return clamp(next, 1, 5)
}

function getKeyStyle(intensity: number) {
  const alpha = 0.08 + intensity * 0.14
  const borderAlpha = 0.12 + intensity * 0.06

  return {
    background: `rgba(74,140,58,${alpha.toFixed(2)})`,
    border: `1px solid rgba(58,114,48,${borderAlpha.toFixed(2)})`,
    color: intensity >= 4 ? '#1f3b1a' : 'var(--kc-on-surface)',
  }
}

function getFocusLabel(phaseId: KeyboardHeatmapProps['phaseId']) {
  if (phaseId === 'lantern') {
    return 'Home-row stability still deserves the most attention.'
  }

  if (phaseId === 'workshop') {
    return 'Reach transitions are the current pressure point.'
  }

  if (phaseId === 'lookout') {
    return 'The map is more balanced now, with edge keys taking more refinement.'
  }

  return 'The heatmap will sharpen once you have a placed phase.'
}

export function KeyboardHeatmap({
  phaseId,
  averageAccuracy,
  totalCorrectedErrors,
  totalSessions,
}: KeyboardHeatmapProps) {
  const averageCorrections =
    totalSessions === 0 ? 0 : totalCorrectedErrors / totalSessions

  return (
    <section
      className="rounded-[var(--kc-radius-card)] border p-5"
      style={{ borderColor: 'var(--kc-line-light)', background: 'var(--kc-surface)' }}
    >
      <p
        className="text-[10px] uppercase tracking-[0.2em]"
        style={{ color: 'var(--kc-on-surface-muted)' }}
      >
        Keyboard Focus Map
      </p>
      <h2 className="mt-1 text-xl font-semibold" style={{ color: 'var(--kc-on-surface)' }}>
        Derived heat from phase and corrections
      </h2>
      <p className="mt-2 text-sm leading-6" style={{ color: 'var(--kc-on-surface-muted)' }}>
        {getFocusLabel(phaseId)} This is a derived map, not per-key telemetry.
      </p>

      <div className="mt-5 space-y-2">
        {rows.map((row, rowIndex) => (
          <div key={`row-${rowIndex}`} className="flex flex-wrap gap-2">
            {row.map(({ key, zone }) => {
              const intensity = getZoneIntensity({
                phaseId,
                zone,
                averageAccuracy,
                averageCorrections,
              })

              return (
                <div
                  key={key}
                  className="flex h-10 min-w-10 items-center justify-center rounded-xl px-3 text-sm font-semibold"
                  style={getKeyStyle(intensity)}
                >
                  {key}
                </div>
              )
            })}
          </div>
        ))}
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-3">
        {[
          { label: 'Average accuracy', value: `${averageAccuracy}%` },
          {
            label: 'Average corrections',
            value: totalSessions === 0 ? '0.0' : averageCorrections.toFixed(1),
          },
          {
            label: 'Phase map',
            value: phaseId ? phaseId[0].toUpperCase() + phaseId.slice(1) : 'Unplaced',
          },
        ].map(({ label, value }) => (
          <div
            key={label}
            className="rounded-[var(--kc-radius-inner)] border px-4 py-3"
            style={{
              borderColor: 'var(--kc-line-light)',
              background: 'rgba(255,255,255,0.55)',
            }}
          >
            <p className="text-[10px] uppercase tracking-[0.16em]" style={{ color: 'var(--kc-on-surface-muted)' }}>
              {label}
            </p>
            <p className="mt-2 text-lg font-semibold" style={{ color: 'var(--kc-on-surface)' }}>
              {value}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
