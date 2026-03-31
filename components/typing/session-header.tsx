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
        <p className="text-sm text-[var(--kc-muted)]">
          Errors in line: {currentErrors}
        </p>
      </div>

      <dl className="grid gap-3 sm:grid-cols-3">
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
        <div>
          <dt className="text-xs uppercase tracking-[0.18em] text-[var(--kc-muted)]">
            Status
          </dt>
          <dd className="mt-1 text-lg text-[var(--kc-text)]">
            {typedCharacters === 0 ? 'Ready' : 'Typing'}
          </dd>
        </div>
      </dl>
    </header>
  )
}
