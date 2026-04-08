type SessionHeaderProps = {
  promptLabel: string
  promptFocus: string
  elapsedMs: number
  typedCharacters: number
  totalCharacters: number
  currentErrors: number
}

function formatElapsed(elapsedMs: number): string {
  return `${(elapsedMs / 1000).toFixed(1)}s`
}

export function SessionHeader({
  promptLabel,
  promptFocus,
  elapsedMs,
  typedCharacters,
  totalCharacters,
  currentErrors,
}: SessionHeaderProps) {
  const progressPercent = Math.round((typedCharacters / totalCharacters) * 100)

  const statusColor =
    currentErrors > 0
      ? { bg: 'rgba(184,52,27,0.10)', dot: 'var(--kc-error)', text: 'var(--kc-error)' }
      : typedCharacters > 0
        ? { bg: 'rgba(58,114,48,0.10)', dot: 'var(--kc-accent-on-surface)', text: 'var(--kc-accent-on-surface)' }
        : { bg: 'rgba(107,94,72,0.08)', dot: 'var(--kc-on-surface-muted)', text: 'var(--kc-on-surface-muted)' }

  const statusLabel =
    currentErrors > 0
      ? `${currentErrors} error${currentErrors > 1 ? 's' : ''}`
      : typedCharacters > 0
        ? 'Clean so far'
        : 'Ready'

  return (
    <header
      className="space-y-4 p-5 backdrop-blur-sm"
      style={{
        borderRadius: 'var(--kc-radius-card)',
        border: '1px solid var(--kc-line-light)',
        background: 'rgba(250,247,241,0.90)',
        boxShadow: '0 8px 24px rgba(28,46,30,0.06)',
      }}
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-1">
          <p
            className="text-xs uppercase tracking-[0.16em]"
            style={{ color: 'var(--kc-on-surface-muted)' }}
          >
            {promptLabel}
          </p>
          <h1
            className="text-2xl tracking-tight"
            style={{ color: 'var(--kc-on-surface)' }}
          >
            Focus: {promptFocus}
          </h1>
        </div>

        <span
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium"
          style={{
            borderRadius: 'var(--kc-radius-badge)',
            background: statusColor.bg,
            color: statusColor.text,
          }}
        >
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{ background: statusColor.dot }}
          />
          {statusLabel}
        </span>
      </div>

      <dl className="grid gap-3 sm:grid-cols-2">
        <div>
          <dt
            className="text-xs uppercase tracking-[0.16em]"
            style={{ color: 'var(--kc-on-surface-muted)' }}
          >
            Time
          </dt>
          <dd
            className="mt-1 text-lg"
            style={{ color: 'var(--kc-on-surface)' }}
          >
            {formatElapsed(elapsedMs)}
          </dd>
        </div>
        <div>
          <dt
            className="text-xs uppercase tracking-[0.16em]"
            style={{ color: 'var(--kc-on-surface-muted)' }}
          >
            Progress
          </dt>
          <dd
            className="mt-1 text-lg"
            style={{ color: 'var(--kc-on-surface)' }}
          >
            {typedCharacters}/{totalCharacters}
          </dd>
        </div>
      </dl>

      <div
        className="h-1.5 overflow-hidden rounded-full"
        style={{ background: 'var(--kc-line-light)' }}
        role="progressbar"
        aria-valuenow={progressPercent}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full rounded-full transition-[width] duration-200"
          style={{ width: `${progressPercent}%`, background: 'var(--kc-accent)' }}
        />
      </div>
    </header>
  )
}
