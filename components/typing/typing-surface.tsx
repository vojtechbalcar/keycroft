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

const BG_TEXT   = 'rgba(22,27,34,0.85)'
const TEXT      = '#e6edf3'
const MUTED     = '#7d8590'
const GOLD      = '#c49a3a'
const GREEN     = '#3fb950'
const RED       = '#f85149'
const BORDER    = '#21262d'

const KB_ROWS = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';'],
  ['z', 'x', 'c', 'v', 'b', 'n', 'm'],
]

function formatElapsed(ms: number): string {
  const s = Math.floor(ms / 1000)
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`
}

/* ── Keyboard visualization ───────────────────────────────────── */
function KeyboardViz({
  keyFocus,
  expectedKey,
  feedback,
}: {
  keyFocus?: string[]
  expectedKey: string | null
  feedback: { key: string; tone: 'correct' | 'incorrect' } | null
}) {
  const focus = new Set((keyFocus ?? []).map((k) => k.toLowerCase()))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
      {KB_ROWS.map((row, ri) => (
        <div
          key={ri}
          style={{
            display: 'flex',
            gap: 4,
            marginLeft: ri === 1 ? 14 : ri === 2 ? 28 : 0,
          }}
        >
          {row.map((key) => {
            const isFocus   = focus.size === 0 || focus.has(key)
            const isExpect  = expectedKey === key
            const fbTone    = feedback?.key === key ? feedback.tone : null

            let bg, border, color
            if (fbTone === 'correct') {
              bg = 'rgba(63,185,80,0.2)'; border = 'rgba(63,185,80,0.6)'; color = GREEN
            } else if (fbTone === 'incorrect') {
              bg = 'rgba(248,81,73,0.18)'; border = 'rgba(248,81,73,0.5)'; color = RED
            } else if (isExpect) {
              bg = 'rgba(196,154,58,0.18)'; border = 'rgba(196,154,58,0.6)'; color = GOLD
            } else if (isFocus) {
              bg = 'rgba(196,154,58,0.07)'; border = 'rgba(196,154,58,0.25)'; color = GOLD
            } else {
              bg = 'rgba(255,255,255,0.04)'; border = BORDER; color = 'rgba(125,133,144,0.5)'
            }

            return (
              <div
                key={key}
                style={{
                  width: 28, height: 28,
                  borderRadius: 4,
                  border: `1px solid ${border}`,
                  background: bg,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.6rem',
                  fontWeight: 700,
                  color,
                  letterSpacing: '0.04em',
                  transition: 'all 80ms ease',
                  userSelect: 'none',
                }}
              >
                {key.toUpperCase()}
              </div>
            )
          })}
        </div>
      ))}
    </div>
  )
}

/* ── Main component ───────────────────────────────────────────── */
type TypingSurfaceProps = {
  prompt: PracticeText
  keyFocus?: string[]
  onComplete: (session: TypingSessionState) => void
}

export function TypingSurface({ prompt, keyFocus, onComplete }: TypingSurfaceProps) {
  const [session, setSession] = useState(() => createTypingSession(prompt.text))
  const [now, setNow]         = useState(Date.now())
  const [focused, setFocused] = useState(false)
  const [feedback, setFeedback] = useState<{ key: string; tone: 'correct' | 'incorrect' } | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Auto-focus
  useEffect(() => { inputRef.current?.focus() }, [])

  // Timer tick
  useEffect(() => {
    if (!session.startedAt || session.isComplete) return
    const id = window.setInterval(() => setNow(Date.now()), 250)
    return () => window.clearInterval(id)
  }, [session.startedAt, session.isComplete])

  // Clear feedback flash
  useEffect(() => {
    if (!feedback) return
    const id = window.setTimeout(() => setFeedback(null), 160)
    return () => window.clearTimeout(id)
  }, [feedback])

  const characters   = getCharacterStatuses(session)
  const cursor       = session.inputValue.length
  const errors       = getCurrentErrorCount(session)
  const totalTyped   = session.inputValue.length
  const correctTyped = totalTyped - errors
  const accuracy     = totalTyped === 0 ? 100 : Math.round((correctTyped / totalTyped) * 100)
  const elapsedMs    = session.startedAt ? now - session.startedAt : 0
  const wpm          = elapsedMs > 0 ? Math.round((correctTyped / 5) / (elapsedMs / 60000)) : 0
  const expectedKey  = session.isComplete ? null : session.targetText[cursor]?.toLowerCase() ?? null

  function applyAction(action: TypingKeyAction, sourceKey?: string) {
    const fk = sourceKey?.toLowerCase() ?? (action.type === 'input' ? action.value.toLowerCase() : null)
    if (action.type === 'input' && fk) {
      setFeedback({ key: fk, tone: fk === expectedKey ? 'correct' : 'incorrect' })
    }
    const next = applyTypingAction(session, action, Date.now())
    setSession(next)
    if (next.isComplete) onComplete(next)
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    const action = normalizeTypingKey(e)
    if (action.type === 'ignore') return
    e.preventDefault()
    applyAction(action)
  }

  function handlePaste(e: ClipboardEvent<HTMLInputElement>) { e.preventDefault() }

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1.5rem',
        padding: '1.5rem',
        cursor: 'text',
        fontFamily: 'var(--font-mono, monospace)',
      }}
      onClick={() => inputRef.current?.focus()}
    >
      {/* Hidden input */}
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

      {/* ── Stats row ─────────────────────────────────────── */}
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        {[
          { icon: '⚡', val: String(wpm), label: 'WPM' },
          { icon: '🎯', val: `${accuracy}%`, label: 'ACC' },
          { icon: '⏱', val: formatElapsed(elapsedMs), label: '' },
        ].map(({ icon, val, label }) => (
          <div
            key={label || 'time'}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '0.4rem 1rem',
              background: 'rgba(22,27,34,0.8)',
              border: `1px solid ${BORDER}`,
              borderRadius: 20,
              fontSize: '0.8rem',
              color: TEXT,
              letterSpacing: '0.04em',
            }}
          >
            <span style={{ fontSize: '0.85rem' }}>{icon}</span>
            <span style={{ fontWeight: 600 }}>{val}</span>
            {label && <span style={{ fontSize: '0.6rem', color: MUTED, letterSpacing: '0.12em' }}>{label}</span>}
          </div>
        ))}
      </div>

      {/* ── Text box ──────────────────────────────────────── */}
      <div style={{
        width: '100%',
        maxWidth: 680,
        background: BG_TEXT,
        border: `1px solid ${BORDER}`,
        borderRadius: 6,
        padding: '1.5rem 2rem',
      }}>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            fontSize: 'clamp(1.1rem, 2.5vw, 1.5rem)',
            lineHeight: 2,
            letterSpacing: '0.02em',
            userSelect: 'none',
          }}
          data-testid="typing-line"
        >
          {characters.map((ch, i) => {
            const isCursor = !session.isComplete && i === cursor
            const charColor =
              ch.status === 'correct'   ? TEXT :
              ch.status === 'incorrect' ? RED  :
              isCursor                  ? 'rgba(230,237,243,0.4)' :
                                          'rgba(125,133,144,0.45)'

            return (
              <Fragment key={i}>
                {isCursor && (
                  <span
                    style={{
                      display: 'inline-block',
                      width: 2, height: '1.1em',
                      marginRight: 1,
                      background: GOLD,
                      borderRadius: 1,
                      flexShrink: 0,
                      alignSelf: 'center',
                      animation: focused ? 'kc-blink 0.85s ease-in-out infinite' : 'none',
                      opacity: focused ? 1 : 0.6,
                    }}
                  />
                )}
                <span
                  style={{
                    color: charColor,
                    textDecoration: ch.status === 'incorrect' ? `underline ${RED} 2px` : 'none',
                  }}
                >
                  {ch.expected === ' ' ? '\u00A0' : ch.expected}
                </span>
              </Fragment>
            )
          })}
          {!session.isComplete && cursor >= characters.length && (
            <span style={{
              display: 'inline-block', width: 2, height: '1.1em',
              background: GOLD, borderRadius: 1, alignSelf: 'center',
              animation: 'kc-blink 0.85s ease-in-out infinite',
            }} />
          )}
        </div>
      </div>

      {/* ── Hint ──────────────────────────────────────────── */}
      <p style={{ fontSize: '0.72rem', color: MUTED, letterSpacing: '0.08em' }}>
        {session.startedAt === null
          ? 'Click anywhere and start typing...'
          : 'Keep a steady rhythm.'}
      </p>

      {/* ── Keyboard ──────────────────────────────────────── */}
      <KeyboardViz keyFocus={keyFocus} expectedKey={expectedKey} feedback={feedback} />
    </div>
  )
}
