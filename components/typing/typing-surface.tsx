'use client'

import {
  Fragment,
  useEffect,
  useRef,
  useState,
  type ClipboardEvent,
  type KeyboardEvent,
} from 'react'

import { normalizeTypingKey } from '@/lib/typing/key-events'
import type { TypingKeyAction } from '@/lib/typing/key-events'
import type { PracticeText } from '@/lib/typing/practice-texts'
import {
  applyTypingAction,
  createTypingSession,
  getCharacterStatuses,
  getCurrentErrorCount,
  type TypingSessionState,
} from '@/lib/typing/text-runner'

const KB_ROWS = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';'],
  ['z', 'x', 'c', 'v', 'b', 'n', 'm'],
]

type KeyboardVizProps = {
  keyFocus?: string[]
  expectedKey: string | null
  feedback: { key: string; tone: 'correct' | 'incorrect' } | null
  onPressKey: (key: string) => void
}

function getKeyButtonLabel(key: string): string {
  if (key === ';') {
    return 'Type semicolon'
  }

  return `Type ${key}`
}

function KeyboardViz({
  keyFocus,
  expectedKey,
  feedback,
  onPressKey,
}: KeyboardVizProps) {
  const focus = new Set((keyFocus ?? []).map((key) => key.toLowerCase()))

  return (
    <div className="flex select-none flex-col items-center gap-1.5">
      {KB_ROWS.map((row, rowIndex) => (
        <div
          key={rowIndex}
          className="flex gap-1"
          style={{
            marginLeft: rowIndex === 1 ? 14 : rowIndex === 2 ? 28 : 0,
          }}
        >
          {row.map((key) => {
            const active = focus.size === 0 || focus.has(key)
            const keyState =
              feedback?.key === key
                ? feedback.tone === 'correct'
                  ? 'correct'
                  : 'incorrect'
                : expectedKey === key
                  ? 'expected'
                  : active
                    ? 'focus'
                    : 'idle'

            const styleByState =
              keyState === 'correct'
                ? {
                    border: '1px solid rgba(74,140,58,0.52)',
                    background: 'rgba(223,234,213,0.98)',
                    color: 'var(--kc-accent-on-surface)',
                    boxShadow: '0 10px 18px rgba(74,140,58,0.16)',
                    transform: 'translateY(-1px)',
                  }
                : keyState === 'incorrect'
                  ? {
                      border: '1px solid rgba(184,52,27,0.44)',
                      background: 'rgba(248,226,220,0.98)',
                      color: 'var(--kc-error)',
                      boxShadow: '0 10px 18px rgba(184,52,27,0.12)',
                      transform: 'translateY(-1px)',
                    }
                  : keyState === 'expected'
                    ? {
                        border: '1px solid rgba(196,155,60,0.48)',
                        background: 'rgba(252,244,216,0.98)',
                        color: 'var(--kc-on-surface)',
                        boxShadow: '0 10px 18px rgba(196,155,60,0.12)',
                        transform: 'translateY(-1px)',
                      }
                    : keyState === 'focus'
                      ? {
                          border: '1px solid rgba(74,140,58,0.36)',
                          background: 'rgba(238,245,229,0.98)',
                          color: 'var(--kc-accent-on-surface)',
                          boxShadow: '0 10px 18px rgba(74,140,58,0.10)',
                          transform: 'translateY(0px)',
                        }
                      : {
                          border: '1px solid rgba(108,94,72,0.18)',
                          background: 'rgba(255,250,240,0.55)',
                          color: 'rgba(107,94,72,0.55)',
                          boxShadow: 'none',
                          transform: 'translateY(0px)',
                        }

            return (
              <button
                aria-label={getKeyButtonLabel(key)}
                data-key={key}
                data-key-state={keyState}
                key={key}
                onClick={() => onPressKey(key)}
                onMouseDown={(event) => {
                  event.preventDefault()
                }}
                className="flex h-8 w-8 items-center justify-center rounded-[10px] border text-[0.62rem] font-semibold transition-all"
                style={{
                  ...styleByState,
                }}
                type="button"
              >
                {key.toUpperCase()}
              </button>
            )
          })}
        </div>
      ))}
    </div>
  )
}

function StatPill({
  icon,
  value,
  sub,
}: {
  icon: string
  value: string
  sub?: string
}) {
  return (
    <div className="flex items-center gap-2 rounded-full border border-[rgba(107,94,72,0.16)] bg-[rgba(255,250,240,0.72)] px-4 py-2 shadow-[0_8px_20px_rgba(58,45,30,0.05)]">
      <span className="text-sm">{icon}</span>
      <span className="text-[0.82rem] font-semibold text-[var(--kc-on-surface)]">
        {value}
      </span>
      {sub && (
        <span className="text-[0.58rem] uppercase tracking-[0.18em] text-[var(--kc-on-surface-muted)]">
          {sub}
        </span>
      )}
    </div>
  )
}

function formatElapsed(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000)
  const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0')
  const seconds = (totalSeconds % 60).toString().padStart(2, '0')

  return `${minutes}:${seconds}`
}

type TypingSurfaceProps = {
  prompt: PracticeText
  keyFocus?: string[]
  onComplete: (session: TypingSessionState) => void
}

export function TypingSurface({
  prompt,
  keyFocus,
  onComplete,
}: TypingSurfaceProps) {
  const [session, setSession] = useState(() => createTypingSession(prompt.text))
  const [now, setNow] = useState(Date.now())
  const [focused, setFocused] = useState(false)
  const [keyboardFeedback, setKeyboardFeedback] = useState<{
    key: string
    tone: 'correct' | 'incorrect'
  } | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    if (session.startedAt === null || session.isComplete) {
      return
    }

    const intervalId = window.setInterval(() => {
      setNow(Date.now())
    }, 250)

    return () => window.clearInterval(intervalId)
  }, [session.startedAt, session.isComplete])

  useEffect(() => {
    if (keyboardFeedback === null) {
      return
    }

    const timeoutId = window.setTimeout(() => {
      setKeyboardFeedback(null)
    }, 180)

    return () => window.clearTimeout(timeoutId)
  }, [keyboardFeedback])

  const characters = getCharacterStatuses(session)
  const cursorIndex = session.inputValue.length
  const errors = getCurrentErrorCount(session)
  const totalTyped = session.inputValue.length
  const correctTyped = totalTyped - errors
  const accuracy =
    totalTyped === 0 ? 100 : Math.round((correctTyped / totalTyped) * 100)
  const elapsedMs = session.startedAt ? now - session.startedAt : 0
  const elapsedMinutes = elapsedMs / 60000
  const wpm =
    elapsedMinutes > 0 ? Math.round((correctTyped / 5) / elapsedMinutes) : 0
  const progress = Math.round((cursorIndex / prompt.text.length) * 100)
  const expectedKey = session.isComplete
    ? null
    : session.targetText[cursorIndex]?.toLowerCase() ?? null

  function applyAction(action: TypingKeyAction, sourceKey?: string) {
    const feedbackKey =
      sourceKey?.toLowerCase() ??
      (action.type === 'input' ? action.value.toLowerCase() : null)

    if (action.type === 'input' && feedbackKey !== null) {
      setKeyboardFeedback({
        key: feedbackKey,
        tone: feedbackKey === expectedKey ? 'correct' : 'incorrect',
      })
    }

    const nextSession = applyTypingAction(session, action, Date.now())
    setSession(nextSession)

    if (nextSession.isComplete) {
      onComplete(nextSession)
    }
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    const action = normalizeTypingKey(event)

    if (action.type === 'ignore') {
      return
    }

    event.preventDefault()
    applyAction(action)
  }

  function handlePaste(event: ClipboardEvent<HTMLInputElement>) {
    event.preventDefault()
  }

  function handleKeyboardKeyPress(key: string) {
    inputRef.current?.focus()
    applyAction({ type: 'input', value: key }, key)
  }

  return (
    <section
      className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_280px]"
      onClick={() => inputRef.current?.focus()}
    >
      <input
        aria-label="Typing input"
        autoFocus
        className="sr-only"
        onBlur={() => setFocused(false)}
        onChange={() => undefined}
        onFocus={() => setFocused(true)}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        readOnly
        ref={inputRef}
        value=""
      />

      <article className="rounded-[36px] border border-[var(--kc-line-light)] bg-[linear-gradient(180deg,rgba(255,250,240,0.97)_0%,rgba(244,236,219,0.97)_100%)] p-6 shadow-[0_24px_60px_rgba(58,45,30,0.08)] md:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.22em] text-[var(--kc-on-surface-muted)]">
              {prompt.label}
            </p>
            <h1 className="text-[clamp(1.8rem,3vw,2.6rem)] leading-none text-[var(--kc-on-surface)]">
              {prompt.focus}
            </h1>
            <p className="max-w-xl text-sm leading-7 text-[var(--kc-on-surface-muted)]">
              Let the line stay airy and even. Backspace is allowed, but the
              real gain comes from keeping corrections low.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <StatPill icon="⚡" value={String(wpm)} sub="WPM" />
            <StatPill icon="🎯" value={`${accuracy}%`} sub="ACC" />
            <StatPill icon="⏱" value={formatElapsed(elapsedMs)} />
          </div>
        </div>

        <div className="mt-6 rounded-[32px] border border-[rgba(107,94,72,0.16)] bg-[rgba(255,250,240,0.72)] px-5 py-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] md:px-7 md:py-8">
          <div
            className="flex flex-wrap text-[clamp(1.2rem,2vw,1.65rem)] leading-[1.9] tracking-[0.01em] text-[var(--kc-on-surface)] select-none"
            data-testid="typing-line"
          >
            {characters.map((character, index) => {
              const isCursor = !session.isComplete && index === cursorIndex
              const color =
                character.status === 'correct'
                  ? 'var(--kc-on-surface)'
                  : character.status === 'incorrect'
                    ? 'var(--kc-error)'
                    : isCursor
                      ? 'rgba(28,46,30,0.45)'
                      : 'rgba(28,46,30,0.28)'

              return (
                <Fragment key={index}>
                  {isCursor && (
                    <span
                      className="mr-px inline-block h-[1em] w-0.5 shrink-0 rounded-full"
                      style={{
                        background: 'var(--kc-accent)',
                        animation: focused
                          ? 'kc-blink 0.85s ease-in-out infinite'
                          : 'none',
                        opacity: focused ? 1 : 0.5,
                      }}
                    />
                  )}
                  <span
                    data-status={character.status}
                    style={{
                      color,
                      textDecorationLine:
                        character.status === 'incorrect' ? 'underline' : 'none',
                      textDecorationColor:
                        character.status === 'incorrect'
                          ? 'var(--kc-error)'
                          : 'transparent',
                      textDecorationThickness:
                        character.status === 'incorrect' ? '2px' : '0px',
                    }}
                  >
                    {character.expected === ' ' ? '\u00A0' : character.expected}
                  </span>
                </Fragment>
              )
            })}

            {!session.isComplete && cursorIndex >= characters.length && (
              <span
                className="inline-block h-[1em] w-0.5 rounded-full"
                style={{
                  background: 'var(--kc-accent)',
                  animation: 'kc-blink 0.85s ease-in-out infinite',
                }}
              />
            )}
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-[var(--kc-on-surface-muted)]">
          <p className="leading-6">
            {session.startedAt === null
              ? 'Click into the lesson and start with the first key.'
              : 'Keep a gentle pace. Clean rhythm beats rushing.'}
          </p>
          <p className="rounded-full bg-[rgba(74,140,58,0.1)] px-3 py-1 text-xs uppercase tracking-[0.18em] text-[var(--kc-accent-on-surface)]">
            {progress}% through the line
          </p>
        </div>
      </article>

      <aside className="flex h-full flex-col gap-4 rounded-[32px] border border-[var(--kc-line-light)] bg-[rgba(249,244,234,0.92)] p-5 shadow-[0_24px_60px_rgba(58,45,30,0.06)]">
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--kc-on-surface-muted)]">
            Lesson board
          </p>
          <h2 className="text-2xl text-[var(--kc-on-surface)]">Key map</h2>
          <p className="text-sm leading-6 text-[var(--kc-on-surface-muted)]">
            The highlighted keys show the movement this lesson is trying to
            teach your hands.
          </p>
        </div>

        <div className="rounded-[24px] border border-[rgba(107,94,72,0.14)] bg-[rgba(255,250,240,0.86)] p-4">
          <KeyboardViz
            expectedKey={expectedKey}
            feedback={keyboardFeedback}
            keyFocus={keyFocus}
            onPressKey={handleKeyboardKeyPress}
          />
        </div>

        <div className="rounded-[24px] border border-[rgba(107,94,72,0.14)] bg-[rgba(255,250,240,0.72)] p-4">
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--kc-on-surface-muted)]">
            Live feel
          </p>
          <dl className="mt-3 space-y-3 text-sm text-[var(--kc-on-surface)]">
            <div className="flex items-center justify-between gap-4">
              <dt className="text-[var(--kc-on-surface-muted)]">Progress</dt>
              <dd>
                {cursorIndex}/{prompt.text.length}
              </dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt className="text-[var(--kc-on-surface-muted)]">Open errors</dt>
              <dd>{errors}</dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt className="text-[var(--kc-on-surface-muted)]">Focus state</dt>
              <dd>{focused ? 'Listening' : 'Click to refocus'}</dd>
            </div>
          </dl>
        </div>
      </aside>
    </section>
  )
}
