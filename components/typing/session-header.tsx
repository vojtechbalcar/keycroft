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

  return (
    <header className="space-y-4 rounded-[28px] border border-[var(--kc-line)] bg-[rgba(255,250,240,0.86)] p-5 shadow-[0_10px_30px_rgba(58,45,30,0.06)] backdrop-blur-sm">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-1">
          <p className="text-sm uppercase tracking-[0.18em] text-[var(--kc-muted)]">
            {promptLabel}
          </p>
          <h1 className="text-2xl tracking-tight text-[var(--kc-text)]">
            Focus: {promptFocus}
          </h1>
        </div>
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs ${
            currentErrors > 0
              ? 'bg-[rgba(200,155,109,0.18)] text-[var(--kc-warm)]'
              : typedCharacters > 0
                ? 'bg-[rgba(94,116,72,0.12)] text-[var(--kc-accent-strong)]'
                : 'bg-[rgba(109,98,84,0.08)] text-[var(--kc-muted)]'
          }`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              currentErrors > 0
                ? 'bg-[var(--kc-warm)]'
                : typedCharacters > 0
                  ? 'bg-[var(--kc-accent)]'
                  : 'bg-[var(--kc-muted)]'
            }`}
          />
          {currentErrors > 0
            ? `${currentErrors} error${currentErrors > 1 ? 's' : ''}`
            : typedCharacters > 0
              ? 'Clean so far'
              : 'Ready'}
        </span>
      </div>

      <dl className="grid gap-3 sm:grid-cols-2">
        <div>
          <dt className="text-xs uppercase tracking-[0.18em] text-[var(--kc-muted)]">
            Time
          </dt>
          <dd className="mt-1 text-lg text-[var(--kc-text)]">
            {formatElapsed(elapsedMs)}
          </dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-[0.18em] text-[var(--kc-muted)]">
            Progress
          </dt>
          <dd className="mt-1 text-lg text-[var(--kc-text)]">
            {typedCharacters}/{totalCharacters}
          </dd>
        </div>
      </dl>

      <div
        className="h-1.5 overflow-hidden rounded-full bg-[var(--kc-line)]"
        role="progressbar"
        aria-valuenow={progressPercent}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full rounded-full bg-[var(--kc-accent)] transition-[width] duration-200 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </header>
  )
}
