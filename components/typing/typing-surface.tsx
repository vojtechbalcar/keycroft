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

function getCharStyle(status: string, isCursor: boolean): React.CSSProperties {
  if (status === 'correct')   return { color: '#e6edf3' }
  if (status === 'incorrect') return { color: '#f85149', textDecoration: 'underline', textDecorationColor: '#f85149' }
  if (isCursor)               return { color: 'rgba(230,237,243,0.5)' }
  return { color: 'rgba(230,237,243,0.22)' }
}

export function TypingSurface({ prompt, onComplete }: TypingSurfaceProps) {
  const [session, setSession] = useState(() => createTypingSession(prompt.text))
  const [now, setNow] = useState(0)
  const [focused, setFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // auto-focus on mount
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    if (session.startedAt === null || session.isComplete) return
    const id = window.setInterval(() => setNow(Date.now()), 100)
    return () => window.clearInterval(id)
  }, [session.startedAt, session.isComplete])

  const characterStatuses = getCharacterStatuses(session)
  const cursorIndex       = session.inputValue.length
  const progressPercent   = Math.round((session.inputValue.length / prompt.text.length) * 100)
  const currentErrors     = getCurrentErrorCount(session)

  void now
  void currentErrors

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    const action = normalizeTypingKey(event)
    if (action.type === 'ignore') return
    event.preventDefault()
    const next = applyTypingAction(session, action, Date.now())
    setSession(next)
    if (next.isComplete) onComplete(next)
  }

  function handlePaste(event: ClipboardEvent<HTMLInputElement>) {
    event.preventDefault()
  }

  return (
    <section
      style={{ display: 'flex', flexDirection: 'column', flex: 1 }}
      onClick={() => inputRef.current?.focus()}
    >
      {/* Hidden real input */}
      <input
        aria-label="Typing input"
        autoFocus
        className="sr-only"
        onChange={() => undefined}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        readOnly
        ref={inputRef}
        value=""
      />

      {/* ── Text display ── */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2.5rem 2rem',
          cursor: 'text',
        }}
      >
        {/* Phrase */}
        <div
          style={{
            background: 'rgba(22,27,34,0.7)',
            border: '1px solid #30363d',
            borderRadius: 8,
            padding: '2rem 2.5rem',
            maxWidth: 680,
            width: '100%',
          }}
        >
          <div
            style={{
              fontFamily: 'var(--font-mono, monospace)',
              fontSize: '1.35rem',
              lineHeight: 1.8,
              letterSpacing: '0.02em',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'flex-end',
              gap: '0 0',
              userSelect: 'none',
            }}
            data-testid="typing-line"
          >
            {characterStatuses.map((ch, i) => (
              <Fragment key={i}>
                {!session.isComplete && i === cursorIndex && (
                  <span
                    aria-hidden
                    style={{
                      display: 'inline-block',
                      width: 2,
                      height: '1.1em',
                      background: '#c49a3a',
                      verticalAlign: 'text-bottom',
                      marginRight: 1,
                      borderRadius: 1,
                      flexShrink: 0,
                      animation: focused ? 'kc-blink 0.85s ease-in-out infinite' : 'none',
                      opacity: focused ? 1 : 0.4,
                    }}
                  />
                )}
                <span style={getCharStyle(ch.status, i === cursorIndex)}>
                  {ch.expected === ' ' ? '\u00A0' : ch.expected}
                </span>
              </Fragment>
            ))}
            {!session.isComplete && cursorIndex >= characterStatuses.length && (
              <span
                aria-hidden
                style={{
                  display: 'inline-block',
                  width: 2,
                  height: '1.1em',
                  background: '#c49a3a',
                  verticalAlign: 'text-bottom',
                  borderRadius: 1,
                  animation: 'kc-blink 0.85s ease-in-out infinite',
                }}
              />
            )}
          </div>
        </div>

        {/* Click hint — shown when not yet started */}
        {session.startedAt === null && (
          <p style={{
            marginTop: '1.25rem',
            fontSize: '0.72rem',
            color: 'rgba(125,133,144,0.7)',
            fontFamily: 'var(--font-mono, monospace)',
            letterSpacing: '0.06em',
          }}>
            Click anywhere and start typing...
          </p>
        )}
      </div>

      {/* ── Progress bar ── */}
      <div style={{
        padding: '0.75rem 1.5rem 1rem',
        borderTop: '1px solid #21262d',
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '0.4rem',
        }}>
          <span style={{ fontSize: '0.62rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#7d8590', fontFamily: 'var(--font-mono, monospace)' }}>
            Mastery
          </span>
          <span style={{ fontSize: '0.62rem', color: '#7d8590', fontFamily: 'var(--font-mono, monospace)' }}>
            {progressPercent} / 100 xp
          </span>
        </div>
        <div style={{
          height: 4,
          background: '#21262d',
          borderRadius: 2,
          overflow: 'hidden',
        }}>
          <div style={{
            height: '100%',
            width: `${progressPercent}%`,
            background: '#c49a3a',
            borderRadius: 2,
            transition: 'width 150ms ease',
          }} />
        </div>
      </div>
    </section>
  )
}
