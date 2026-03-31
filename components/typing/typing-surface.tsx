'use client'

import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type ClipboardEvent,
} from 'react'

import { SessionHeader } from '@/components/typing/session-header'
import { normalizeTypingKey } from '@/lib/typing/key-events'
import type { PracticeText } from '@/lib/typing/practice-texts'
import {
  applyTypingAction,
  createTypingSession,
  getCharacterStatuses,
  getCurrentErrorCount,
  type TypingSessionState,
} from '@/lib/typing/text-runner'

type TypingSurfaceProps = {
  prompt: PracticeText
  onComplete: (session: TypingSessionState) => void
}

export function TypingSurface({ prompt, onComplete }: TypingSurfaceProps) {
  const [session, setSession] = useState(() => createTypingSession(prompt.text))
  const [now, setNow] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (session.startedAt === null || session.isComplete) {
      return
    }

    const intervalId = window.setInterval(() => {
      setNow(Date.now())
    }, 100)

    return () => {
      window.clearInterval(intervalId)
    }
  }, [session.startedAt, session.isComplete])

  const characterStatuses = getCharacterStatuses(session)
  const elapsedMs =
    session.startedAt === null
      ? 0
      : session.isComplete && session.completedAt !== null
        ? session.completedAt - session.startedAt
        : now - session.startedAt

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    const action = normalizeTypingKey(event)

    if (action.type === 'ignore') {
      return
    }

    event.preventDefault()

    const nextSession = applyTypingAction(session, action, Date.now())
    setSession(nextSession)

    if (nextSession.isComplete) {
      onComplete(nextSession)
    }
  }

  function handlePaste(event: ClipboardEvent<HTMLInputElement>) {
    event.preventDefault()
  }

  return (
    <section
      className="space-y-6"
      onClick={() => {
        inputRef.current?.focus()
      }}
    >
      <input
        aria-label="Typing input"
        autoFocus
        className="sr-only"
        onChange={() => undefined}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        readOnly
        ref={inputRef}
        value=""
      />

      <SessionHeader
        currentErrors={getCurrentErrorCount(session)}
        elapsedMs={elapsedMs}
        promptFocus={prompt.focus}
        promptLabel={prompt.label}
        totalCharacters={prompt.text.length}
        typedCharacters={session.inputValue.length}
      />

      <section className="rounded-[36px] border border-[var(--kc-line)] bg-[linear-gradient(180deg,rgba(255,250,240,0.96)_0%,rgba(248,240,224,0.96)_100%)] p-8 shadow-[0_18px_50px_rgba(58,45,30,0.10)] md:p-10">
        <p className="text-sm uppercase tracking-[0.18em] text-[var(--kc-muted)]">
          Type the line exactly as shown
        </p>

        <div
          className="mt-6 flex flex-wrap gap-x-0.5 gap-y-3 text-3xl leading-relaxed text-[var(--kc-text)]"
          data-testid="typing-line"
        >
          {characterStatuses.map((character, index) => (
            <span
              className={
                character.status === 'correct'
                  ? 'text-[var(--kc-accent-strong)]'
                  : character.status === 'incorrect'
                    ? 'rounded bg-[rgba(200,155,109,0.22)] text-[var(--kc-warm)]'
                    : 'text-[var(--kc-text)] opacity-55'
              }
              data-status={character.status}
              key={`${character.expected}-${index}`}
            >
              {character.expected === ' ' ? '\u00A0' : character.expected}
            </span>
          ))}
        </div>

        <p className="mt-6 text-sm leading-6 text-[var(--kc-muted)]">
          Backspace is allowed. Progress only counts when the full line is
          correct.
        </p>
      </section>
    </section>
  )
}
