'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import Link from 'next/link'
import type { ChapterId } from '@/lib/map/chapter-definitions'

type Props = {
  chapterId: ChapterId
  nodeId: string
  wordBank: string[]
  title: string
}

type Result = {
  wpm: number
  accuracy: number
  goldEarned: number
  isFirstClear: boolean
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

const BG     = 'rgba(5,9,26,0.97)'
const CARD   = 'rgba(255,255,255,0.04)'
const BORDER = 'rgba(255,255,255,0.1)'
const GOLD   = '#c49a3a'
const TEXT   = '#e6edf3'
const MUTED  = 'rgba(255,255,255,0.4)'
const GREEN  = '#4ade80'
const RED    = '#f87171'

export function LessonSession({ chapterId, nodeId, wordBank, title }: Props) {
  const WORD_COUNT = Math.min(wordBank.length * 2, 20)
  const [words] = useState<string[]>(() => {
    const doubled = shuffle([...wordBank, ...wordBank])
    return doubled.slice(0, WORD_COUNT)
  })

  const [phase, setPhase] = useState<'idle' | 'typing' | 'done'>('idle')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [input, setInput] = useState('')
  const [correctCount, setCorrectCount] = useState(0)
  const [totalChars, setTotalChars] = useState(0)
  const [errorChars, setErrorChars] = useState(0)
  const [result, setResult] = useState<Result | null>(null)
  const startTimeRef = useRef<number>(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const doneRef = useRef(false)

  const finish = useCallback(async (correct: number, total: number, errors: number) => {
    if (doneRef.current) return
    doneRef.current = true
    setPhase('done')

    const elapsed = (Date.now() - startTimeRef.current) / 1000 / 60
    const wpm      = elapsed > 0 ? Math.round(correct / elapsed) : 0
    const accuracy = total  > 0 ? Math.round(((total - errors) / total) * 100) : 100

    try {
      const res = await fetch('/api/lesson/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chapterId, nodeId, wpm, accuracy }),
      })
      const data = (await res.json()) as { goldEarned: number; isFirstClear: boolean }
      setResult({ wpm, accuracy, goldEarned: data.goldEarned, isFirstClear: data.isFirstClear })
    } catch {
      setResult({ wpm, accuracy, goldEarned: 0, isFirstClear: false })
    }
  }, [chapterId, nodeId])

  function start() {
    setPhase('typing')
    startTimeRef.current = Date.now()
    setTimeout(() => inputRef.current?.focus(), 50)
  }

  function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value

    if (val.endsWith(' ')) {
      const typed   = val.trimEnd()
      const target  = words[currentIndex] ?? ''
      const chars   = target.length
      const correct = typed === target ? Math.floor(chars / 5) : 0
      const errs    = typed !== target ? 1 : 0

      const newCorrect = correctCount + correct
      const newTotal   = totalChars + chars
      const newErrors  = errorChars + errs
      const nextIndex  = currentIndex + 1

      setCorrectCount(newCorrect)
      setTotalChars(newTotal)
      setErrorChars(newErrors)
      setInput('')

      if (nextIndex >= words.length) {
        finish(newCorrect, newTotal, newErrors)
      } else {
        setCurrentIndex(nextIndex)
      }
      return
    }

    setInput(val)
  }

  // Auto-focus on mount if typing
  useEffect(() => {
    if (phase === 'typing') inputRef.current?.focus()
  }, [phase])

  const currentWord = words[currentIndex] ?? ''
  const isMatch = currentWord.startsWith(input) || input === ''
  const progress = (currentIndex / words.length) * 100

  // ── Done screen ──────────────────────────────────────────────
  if (phase === 'done') {
    return (
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        gap: 24, paddingTop: 32,
      }}>
        {result ? (
          <>
            <div style={{ fontSize: 48 }}>
              {result.accuracy >= 85 ? '🪔' : '💨'}
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ margin: 0, fontSize: 20, fontWeight: 700, color: TEXT }}>
                {result.accuracy >= 85 ? 'Lesson Complete!' : 'Keep Practising'}
              </p>
              {result.isFirstClear && (
                <p style={{ margin: '4px 0 0', fontSize: 12, color: GOLD, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                  ✦ First Clear!
                </p>
              )}
            </div>

            {/* Stats */}
            <div style={{ display: 'flex', gap: 16 }}>
              {[
                { label: 'WPM', value: result.wpm },
                { label: 'Accuracy', value: `${result.accuracy}%` },
              ].map(({ label, value }) => (
                <div key={label} style={{
                  padding: '14px 20px', borderRadius: 10,
                  background: CARD, border: `1px solid ${BORDER}`,
                  textAlign: 'center', minWidth: 90,
                }}>
                  <div style={{ fontSize: 22, fontWeight: 700, color: TEXT }}>{value}</div>
                  <div style={{ fontSize: 10, color: MUTED, marginTop: 3, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{label}</div>
                </div>
              ))}
            </div>

            {/* Gold earned */}
            {result.goldEarned > 0 && (
              <div style={{
                padding: '10px 20px', borderRadius: 8,
                background: 'rgba(196,154,58,0.08)',
                border: '1px solid rgba(196,154,58,0.25)',
                fontSize: 14, color: GOLD, fontWeight: 600,
              }}>
                🪙 +{result.goldEarned} gold earned
              </div>
            )}

            <div style={{ display: 'flex', gap: 12 }}>
              <button
                onClick={() => {
                  doneRef.current = false
                  setPhase('idle')
                  setCurrentIndex(0)
                  setInput('')
                  setCorrectCount(0)
                  setTotalChars(0)
                  setErrorChars(0)
                  setResult(null)
                }}
                style={{
                  padding: '10px 22px', borderRadius: 8, cursor: 'pointer',
                  background: CARD, border: `1px solid ${BORDER}`,
                  color: TEXT, fontSize: 13, fontWeight: 600,
                }}
              >
                Replay
              </button>
              <Link
                href="/map"
                style={{
                  padding: '10px 22px', borderRadius: 8,
                  background: GOLD, border: 'none',
                  color: '#05091a', fontSize: 13, fontWeight: 700,
                  textDecoration: 'none', display: 'inline-flex', alignItems: 'center',
                }}
              >
                Back to Map →
              </Link>
            </div>
          </>
        ) : (
          <p style={{ color: MUTED }}>Saving results…</p>
        )}
      </div>
    )
  }

  // ── Idle screen ──────────────────────────────────────────────
  if (phase === 'idle') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24, paddingTop: 24 }}>
        <div style={{ fontSize: 48 }}>🪔</div>
        <div style={{ textAlign: 'center' }}>
          <p style={{ margin: 0, fontSize: 18, fontWeight: 700, color: TEXT }}>{title}</p>
          <p style={{ margin: '8px 0 0', fontSize: 13, color: MUTED }}>
            Type {WORD_COUNT} words to complete this lesson
          </p>
        </div>
        <button
          onClick={start}
          style={{
            padding: '12px 32px', borderRadius: 8, cursor: 'pointer',
            background: GOLD, border: 'none',
            color: '#05091a', fontSize: 14, fontWeight: 700, letterSpacing: '0.08em',
            textTransform: 'uppercase',
          }}
        >
          Start →
        </button>
      </div>
    )
  }

  // ── Typing screen ────────────────────────────────────────────
  const upcoming = words.slice(currentIndex + 1, currentIndex + 5)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Progress bar */}
      <div style={{ height: 4, background: 'rgba(255,255,255,0.08)', borderRadius: 2, overflow: 'hidden' }}>
        <div style={{
          height: '100%', borderRadius: 2,
          background: GOLD,
          width: `${progress}%`,
          transition: 'width 200ms ease',
        }} />
      </div>

      <div style={{ textAlign: 'center', fontSize: 11, color: MUTED, letterSpacing: '0.1em' }}>
        {currentIndex + 1} / {words.length}
      </div>

      {/* Current word */}
      <div style={{ textAlign: 'center' }}>
        <span style={{
          fontSize: 36,
          fontWeight: 700,
          letterSpacing: '0.08em',
          color: isMatch ? TEXT : RED,
          fontFamily: 'var(--font-mono, monospace)',
          transition: 'color 80ms',
        }}>
          {currentWord}
        </span>
      </div>

      {/* Upcoming words */}
      <div style={{
        display: 'flex', justifyContent: 'center', gap: 14, flexWrap: 'wrap',
        minHeight: 24,
      }}>
        {upcoming.map((w, i) => (
          <span key={i} style={{
            fontSize: 14, color: `rgba(255,255,255,${0.25 - i * 0.05})`,
            fontFamily: 'var(--font-mono, monospace)',
          }}>
            {w}
          </span>
        ))}
      </div>

      {/* Input */}
      <div style={{ position: 'relative' }}>
        <input
          ref={inputRef}
          value={input}
          onChange={handleInput}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          placeholder="Type the word above, press Space to advance…"
          style={{
            width: '100%',
            boxSizing: 'border-box',
            padding: '14px 16px',
            borderRadius: 10,
            background: CARD,
            border: `1.5px solid ${!isMatch ? RED : input.length ? GREEN : BORDER}`,
            color: TEXT,
            fontSize: 16,
            fontFamily: 'var(--font-mono, monospace)',
            outline: 'none',
            transition: 'border-color 80ms',
          }}
        />
      </div>

      <p style={{ margin: 0, textAlign: 'center', fontSize: 11, color: MUTED }}>
        Press <kbd style={{ padding: '1px 6px', borderRadius: 4, background: 'rgba(255,255,255,0.08)', border: `1px solid ${BORDER}` }}>Space</kbd> after each word
      </p>
    </div>
  )
}
