'use client'

import {
  Fragment,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type ClipboardEvent,
} from 'react'

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

function getCharacterClassName(
  status: string,
  isCursorPosition: boolean,
): string {
  if (status === 'correct') {
    return 'text-[var(--kc-on-surface)]'
  }
  if (status === 'incorrect') {
    return 'rounded-sm bg-[var(--kc-error-bg)] text-[var(--kc-error)]'
  }
  if (isCursorPosition) {
    return 'rounded-sm bg-[rgba(74,140,58,0.10)] text-[var(--kc-on-surface)]'
  }
  return 'text-[var(--kc-on-surface-faint)]'
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
  const cursorIndex = session.inputValue.length
  const progressPercent = Math.round(
    (session.inputValue.length / prompt.text.length) * 100,
  )
  const currentErrors = getCurrentErrorCount(session)

  void now
  void progressPercent
  void currentErrors

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
      className="flex flex-col"
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

      {/* Breadcrumb header */}
      <div
        className="flex items-center justify-between px-6 py-3"
        style={{
          background: 'var(--kc-surface)',
          borderBottom: '1px solid var(--kc-line-light)',
        }}
      >
        <div className="flex items-center gap-2">
          <span
            className="text-[10px] uppercase tracking-[0.16em]"
            style={{ color: 'var(--kc-on-surface-muted)' }}
          >
            {prompt.label}
          </span>
          <span style={{ color: 'var(--kc-line-light)' }}>›</span>
          <span
            className="text-[10px] uppercase tracking-[0.16em]"
            style={{ color: 'var(--kc-on-surface-muted)' }}
          >
            Western Path
          </span>
        </div>
        <span
          className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider"
          style={{
            borderRadius: 'var(--kc-radius-badge)',
            background: 'rgba(58,114,48,0.10)',
            color: 'var(--kc-accent-on-surface)',
            border: '1px solid rgba(58,114,48,0.18)',
          }}
        >
          Focus
        </span>
      </div>

      {/* Typing area */}
      <div
        className="flex-1 px-8 py-8"
        style={{ background: '#fff', minHeight: 200 }}
      >
        <div
          className="flex flex-wrap items-end gap-x-0.5 gap-y-4 text-[1.65rem] leading-[1.7]"
          style={{
            fontFamily:
              "'Iowan Old Style', 'Palatino Linotype', 'Book Antiqua', Palatino, Georgia, serif",
          }}
          data-testid="typing-line"
        >
          {characterStatuses.map((character, index) => (
            <Fragment key={`char-${index}`}>
              {!session.isComplete && index === cursorIndex && (
                <span aria-hidden className="kc-cursor" />
              )}
              <span
                className={getCharacterClassName(
                  character.status,
                  index === cursorIndex,
                )}
                data-status={character.status}
              >
                {character.expected === ' ' ? '\u00A0' : character.expected}
              </span>
            </Fragment>
          ))}
          {!session.isComplete && cursorIndex >= characterStatuses.length && (
            <span aria-hidden className="kc-cursor" />
          )}
        </div>
      </div>
    </section>
  )
}
