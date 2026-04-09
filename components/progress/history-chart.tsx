import type { HistoryPoint } from '@/lib/analytics/build-history-series'

type HistoryChartProps = {
  series: HistoryPoint[]
}

export function HistoryChart({ series }: HistoryChartProps) {
  const maxWpm = Math.max(...series.map((point) => point.averageWpm), 40)

  return (
    <section
      className="rounded-[var(--kc-radius-card)] border p-5"
      style={{ borderColor: 'var(--kc-line-light)', background: 'var(--kc-surface)' }}
    >
      <p
        className="text-[10px] uppercase tracking-[0.2em]"
        style={{ color: 'var(--kc-on-surface-muted)' }}
      >
        Recent Run History
      </p>
      <h2 className="mt-1 text-xl font-semibold" style={{ color: 'var(--kc-on-surface)' }}>
        Daily pace and accuracy
      </h2>

      {series.length === 0 ? (
        <p className="mt-4 text-sm leading-6" style={{ color: 'var(--kc-on-surface-muted)' }}>
          No practice sessions yet. Finish a few lines and the chart will start showing a daily trail.
        </p>
      ) : (
        <>
          <div className="mt-6 flex h-56 items-end gap-3">
            {series.map((point) => {
              const height = Math.max(
                20,
                Math.round((point.averageWpm / maxWpm) * 100),
              )

              return (
                <div key={point.date} className="flex min-w-0 flex-1 flex-col items-center gap-3">
                  <div
                    className="flex w-full items-end justify-center rounded-t-[18px] border-x border-t px-2 pb-3 pt-2"
                    style={{
                      height: `${height}%`,
                      minHeight: '56px',
                      borderColor: 'var(--kc-line-light)',
                      background:
                        'linear-gradient(180deg, rgba(74,140,58,0.20) 0%, rgba(74,140,58,0.72) 100%)',
                    }}
                    aria-label={`${point.label}: ${point.averageWpm} WPM average`}
                  >
                    <span className="text-sm font-semibold text-white">
                      {point.averageWpm}
                    </span>
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-semibold" style={{ color: 'var(--kc-on-surface)' }}>
                      {point.label}
                    </p>
                    <p className="text-[11px]" style={{ color: 'var(--kc-on-surface-muted)' }}>
                      {point.averageAccuracy}% acc
                    </p>
                    <p className="text-[11px]" style={{ color: 'var(--kc-on-surface-muted)' }}>
                      {point.sessionCount} run{point.sessionCount !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-3">
            {series.slice(-3).map((point) => (
              <div
                key={`${point.date}-summary`}
                className="rounded-[var(--kc-radius-inner)] border px-4 py-3"
                style={{
                  borderColor: 'var(--kc-line-light)',
                  background: 'rgba(255,255,255,0.55)',
                }}
              >
                <p className="text-xs font-semibold" style={{ color: 'var(--kc-on-surface)' }}>
                  {point.label}
                </p>
                <p className="mt-1 text-sm" style={{ color: 'var(--kc-on-surface-muted)' }}>
                  {point.cleanRunCount} clean run{point.cleanRunCount !== 1 ? 's' : ''} with{' '}
                  {point.averageAccuracy}% accuracy.
                </p>
              </div>
            ))}
          </div>
        </>
      )}
    </section>
  )
}
