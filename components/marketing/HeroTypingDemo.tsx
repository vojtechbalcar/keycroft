'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'

const DEMO_PHRASE = 'the village grows with every keystroke'

export function HeroTypingDemo() {
  const [typed, setTyped] = useState('')
  const [started, setStarted] = useState(false)
  const [startTime, setStartTime] = useState<number | null>(null)
  const [wpm, setWpm] = useState<number | null>(null)
  const [finished, setFinished] = useState(false)
  const [focused, setFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // Auto-focus on mount for desktop
  useEffect(() => {
    const timer = setTimeout(() => inputRef.current?.focus(), 600)
    return () => clearTimeout(timer)
  }, [])

  function focus() {
    inputRef.current?.focus()
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value
    if (val.length > DEMO_PHRASE.length) return

    if (!started) {
      setStarted(true)
      setStartTime(Date.now())
    }

    setTyped(val)

    if (val === DEMO_PHRASE) {
      const elapsed = (Date.now() - (startTime ?? Date.now())) / 60000
      const words = DEMO_PHRASE.split(' ').length
      setWpm(Math.round(words / Math.max(elapsed, 0.01)))
      setFinished(true)
    }
  }

  function reset() {
    setTyped('')
    setStarted(false)
    setStartTime(null)
    setWpm(null)
    setFinished(false)
    setTimeout(() => inputRef.current?.focus(), 50)
  }

  return (
    <>
      <style>{`
        @keyframes kc-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        .kc-cursor {
          display: inline-block;
          width: 2px;
          height: 1.1em;
          background: #d4a850;
          margin-right: 1px;
          vertical-align: text-bottom;
          animation: kc-blink 1s step-end infinite;
        }
      `}</style>

      <div
        className="relative w-full max-w-2xl cursor-text rounded-2xl p-7"
        style={{
          background: 'rgba(10, 20, 12, 0.6)',
          border: '1px solid rgba(255,255,255,0.1)',
          backdropFilter: 'blur(16px)',
          boxShadow: '0 8px 40px rgba(0,0,0,0.4)',
        }}
        onClick={focus}
      >
        {/* Hidden real input */}
        <input
          ref={inputRef}
          value={typed}
          onChange={handleChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="absolute h-0 w-0 opacity-0"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          aria-label="Type the demo phrase"
          disabled={finished}
        />

        {finished ? (
          /* ── Finished state ── */
          <div className="flex flex-col items-center gap-4 py-2 text-center">
            <div>
              <p
                className="text-5xl font-bold tabular-nums"
                style={{ color: '#7aaa82' }}
              >
                {wpm} <span className="text-2xl font-semibold" style={{ color: 'rgba(255,255,255,0.5)' }}>WPM</span>
              </p>
              <p className="mt-1 text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
                {wpm && wpm >= 80
                  ? 'Fine work, scribe. Your village has been waiting.'
                  : 'A good start. Your village is taking shape.'}
              </p>
            </div>
            <div className="flex gap-3">
              <Link
                href="/play"
                className="rounded-full px-6 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
                style={{
                  background: '#4a8c3a',
                  boxShadow: '0 4px 20px rgba(74,140,58,0.4)',
                }}
              >
                Begin Your Journey →
              </Link>
              <button
                onClick={reset}
                className="rounded-full border px-5 py-2.5 text-sm font-semibold transition hover:bg-white/10"
                style={{
                  borderColor: 'rgba(255,255,255,0.2)',
                  color: 'rgba(255,255,255,0.6)',
                }}
              >
                Try Again
              </button>
            </div>
          </div>
        ) : (
          /* ── Typing state ── */
          <>
            <p
              className="mb-4 text-xs uppercase tracking-[0.2em]"
              style={{ color: 'rgba(255,255,255,0.35)' }}
            >
              {started
                ? 'keep going…'
                : focused
                  ? 'start typing ↓'
                  : 'click here to try it'}
            </p>

            {/* Phrase display */}
            <div
              className="select-none font-mono text-xl leading-relaxed"
              style={{ letterSpacing: '0.02em' }}
            >
              {DEMO_PHRASE.split('').map((char, i) => {
                const isTyped = i < typed.length
                const isCurrent = i === typed.length
                const isCorrect = isTyped && typed[i] === char
                const isWrong = isTyped && typed[i] !== char

                return (
                  <span
                    key={i}
                    style={{
                      color: isCorrect
                        ? '#7aaa82'
                        : isWrong
                          ? '#e05c5c'
                          : 'rgba(255,255,255,0.28)',
                      position: 'relative',
                      textDecoration: isWrong ? 'underline' : 'none',
                      textDecorationColor: '#e05c5c',
                    }}
                  >
                    {isCurrent && focused && (
                      <span className="kc-cursor" aria-hidden />
                    )}
                    {char}
                  </span>
                )
              })}
              {/* Cursor at end when all typed */}
              {typed.length === DEMO_PHRASE.length && focused && (
                <span className="kc-cursor" aria-hidden />
              )}
            </div>

            {/* Progress bar */}
            <div
              className="mt-5 h-0.5 w-full overflow-hidden rounded-full"
              style={{ background: 'rgba(255,255,255,0.08)' }}
            >
              <div
                className="h-full rounded-full transition-all duration-150"
                style={{
                  width: `${(typed.length / DEMO_PHRASE.length) * 100}%`,
                  background: 'linear-gradient(90deg, #4a8c3a, #7aaa82)',
                }}
              />
            </div>

            {/* CTAs */}
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <Link
                href="/play"
                className="rounded-full px-6 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
                style={{
                  background: '#4a8c3a',
                  boxShadow: '0 4px 20px rgba(74,140,58,0.35)',
                }}
              >
                Start Your Harvest
              </Link>
              <Link
                href="/home"
                className="rounded-full border px-5 py-2.5 text-sm font-semibold transition hover:bg-white/10"
                style={{
                  borderColor: 'rgba(255,255,255,0.2)',
                  color: 'rgba(255,255,255,0.6)',
                }}
              >
                View the Map
              </Link>
            </div>
          </>
        )}
      </div>
    </>
  )
}
