'use client'

import { useState } from 'react'

import { SessionSummary } from '@/components/typing/session-summary'
import { TypingSurface } from '@/components/typing/typing-surface'
import { practiceTexts } from '@/lib/typing/practice-texts'
import { calculateSessionMetrics } from '@/lib/typing/session-metrics'
import type { TypingSessionState } from '@/lib/typing/text-runner'
import {
  readGuestProgress,
  recordPracticeSession,
  saveGuestProgress,
} from '@/lib/storage/guest-progress'

export default function PlayPage() {
  const [promptIndex, setPromptIndex] = useState(0)
  const [completedSession, setCompletedSession] =
    useState<TypingSessionState | null>(null)

  const prompt = practiceTexts[promptIndex]
  const metrics =
    completedSession === null
      ? null
      : calculateSessionMetrics(completedSession)

  function persistCompletedSession(session: TypingSessionState) {
    const m = calculateSessionMetrics(session)
    const storage = window.localStorage
    const progress = readGuestProgress(storage)
    const nextProgress = recordPracticeSession(progress, {
      completedAt: new Date().toISOString(),
      wpm: m.wpm,
      accuracy: m.accuracy,
      correctedErrors: m.correctedErrors,
    })
    saveGuestProgress(storage, nextProgress)
  }

  function handleComplete(session: TypingSessionState) {
    persistCompletedSession(session)
    setCompletedSession(session)
  }

  function handleTryAnother() {
    setPromptIndex((current) => (current + 1) % practiceTexts.length)
    setCompletedSession(null)
  }

  return (
    <div className="flex flex-col">

      {/* ── Top nav bar ─────────────────────────────────────────── */}
      <header
        className="flex items-center justify-between px-6 py-3"
        style={{
          background: 'var(--kc-surface-glass)',
          borderBottom: '1px solid var(--kc-line-light)',
        }}
      >
        <div className="flex items-center gap-3">
          <span
            className="flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold text-white"
            style={{ background: 'var(--kc-accent)' }}
          >
            K
          </span>
          <span
            className="text-lg font-bold"
            style={{ color: 'var(--kc-on-surface)' }}
          >
            The Digital Homestead
          </span>
        </div>

        <nav className="flex items-center gap-8">
          {['Production', 'The Village', 'Stockpile'].map((tab) => {
            const active = tab === 'Production'
            return (
              <span
                key={tab}
                className="text-sm"
                style={{
                  color: active ? 'var(--kc-accent-on-surface)' : 'var(--kc-on-surface-muted)',
                  fontWeight: active ? 600 : 400,
                  borderBottom: active ? '2px solid var(--kc-accent)' : 'none',
                  paddingBottom: active ? 2 : 0,
                }}
              >
                {tab}
              </span>
            )
          })}
          <div className="flex items-center gap-3" style={{ color: 'var(--kc-on-surface-muted)' }}>
            <span>🎙</span>
            <span>👤</span>
          </div>
        </nav>
      </header>

      {/* ── Village scene ─────────────────────────────────────── */}
      <div className="relative">
        <div
          className="h-[340px] w-full"
          style={{
            backgroundImage: 'url(/village-bg.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center 35%',
          }}
        >
          {/* Resource badges */}
          <div className="absolute right-4 top-4 flex flex-col gap-2">
            {[
              { icon: '🪙', value: '1,240', label: 'Gold',  iconColor: 'var(--kc-warm)' },
              { icon: '🌲', value: '84',    label: 'Wood',  iconColor: 'var(--kc-accent)' },
            ].map(({ icon, value, label, iconColor }) => (
              <div
                key={label}
                className="flex items-center gap-2 px-3 py-1.5"
                style={{
                  borderRadius: 'var(--kc-radius-badge)',
                  background: 'var(--kc-surface-glass)',
                  border: '1px solid var(--kc-line-light)',
                }}
              >
                <span style={{ color: iconColor }}>{icon}</span>
                <span
                  className="text-sm font-bold"
                  style={{ color: 'var(--kc-on-surface)' }}
                >
                  {value}
                </span>
                <span
                  className="text-[10px] uppercase tracking-wider"
                  style={{ color: 'var(--kc-on-surface-muted)' }}
                >
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Progress bar */}
        <div
          className="flex items-center justify-between px-6 py-2"
          style={{
            background: 'var(--kc-surface-glass)',
            borderBottom: '1px solid var(--kc-line-light)',
          }}
        >
          <div
            className="h-3 flex-1 overflow-hidden rounded-full"
            style={{ background: 'var(--kc-line-light)' }}
          >
            <div
              className="h-full rounded-full"
              style={{ width: '58%', background: 'var(--kc-accent)' }}
            />
          </div>
          <span
            className="ml-4 text-xs font-semibold uppercase tracking-wider"
            style={{ color: 'var(--kc-on-surface-muted)' }}
          >
            Road to the North →
          </span>
        </div>
      </div>

      {/* ── Typing area ────────────────────────────────────────── */}
      <div
        className="flex flex-1 gap-0"
        style={{ background: 'var(--kc-surface)' }}
      >
        {/* Left stat: WPM */}
        <div
          className="flex w-[120px] shrink-0 flex-col items-center justify-center"
          style={{
            background: 'var(--kc-surface-2)',
            borderRight: '1px solid var(--kc-line-light)',
          }}
        >
          <span style={{ color: 'var(--kc-accent)', fontSize: '20px' }}>📡</span>
          <p
            className="mt-2 text-4xl font-bold"
            style={{ color: 'var(--kc-on-surface)' }}
          >
            72
          </p>
          <p
            className="text-[10px] uppercase tracking-wider"
            style={{ color: 'var(--kc-on-surface-muted)' }}
          >
            WPM
          </p>
        </div>

        {/* Typing surface */}
        <div className="min-w-0 flex-1">
          {metrics === null ? (
            <TypingSurface
              key={prompt.id}
              onComplete={handleComplete}
              prompt={prompt}
            />
          ) : (
            <SessionSummary
              metrics={metrics}
              onTryAnother={handleTryAnother}
              prompt={prompt}
            />
          )}
        </div>

        {/* Right stat: Accuracy */}
        <div
          className="flex w-[120px] shrink-0 flex-col items-center justify-center"
          style={{
            background: 'var(--kc-surface-2)',
            borderLeft: '1px solid var(--kc-line-light)',
          }}
        >
          <span style={{ color: 'var(--kc-error)', fontSize: '20px' }}>🎯</span>
          <p
            className="mt-2 text-4xl font-bold"
            style={{ color: 'var(--kc-on-surface)' }}
          >
            98<span className="text-lg">%</span>
          </p>
          <p
            className="text-[10px] uppercase tracking-wider"
            style={{ color: 'var(--kc-on-surface-muted)' }}
          >
            Accuracy
          </p>
        </div>
      </div>

      {/* ── Bottom bar ─────────────────────────────────────────── */}
      <div
        className="flex items-center justify-end px-6 py-3"
        style={{
          background: 'var(--kc-surface-2)',
          borderTop: '1px solid var(--kc-line-light)',
        }}
      >
        <button
          className="flex h-12 w-12 items-center justify-center rounded-lg text-xl text-white transition-[transform,opacity] hover:opacity-90 active:scale-[0.95]"
          style={{ background: 'var(--kc-accent)' }}
        >
          ▶
        </button>
      </div>
    </div>
  )
}
