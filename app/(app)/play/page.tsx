'use client'

import { useState } from 'react'

import { SessionSummary } from '@/components/typing/session-summary'
import { TypingSurface } from '@/components/typing/typing-surface'
import { practiceTexts } from '@/lib/typing/practice-texts'
import { calculateSessionMetrics } from '@/lib/typing/session-metrics'
import type { TypingSessionState } from '@/lib/typing/text-runner'

export default function PlayPage() {
  const [promptIndex, setPromptIndex] = useState(0)
  const [completedSession, setCompletedSession] =
    useState<TypingSessionState | null>(null)

  const prompt = practiceTexts[promptIndex]
  const metrics =
    completedSession === null
      ? null
      : calculateSessionMetrics(completedSession)

  function handleTryAnother() {
    setPromptIndex((current) => (current + 1) % practiceTexts.length)
    setCompletedSession(null)
  }

  return (
    <div className="flex flex-col">
      {/* ── Top nav bar ── */}
      <header
        className="flex items-center justify-between px-6 py-3"
        style={{
          background: 'rgba(255,250,240,0.95)',
          borderBottom: '1px solid #d8cfbc',
        }}
      >
        <div className="flex items-center gap-3">
          <span
            className="flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold"
            style={{ background: '#4a8c3a', color: '#fff' }}
          >
            K
          </span>
          <span
            className="text-lg font-bold"
            style={{ color: '#1c2e1e' }}
          >
            The Digital Homestead
          </span>
        </div>
        <nav className="flex items-center gap-8">
          {['Production', 'The Village', 'Stockpile'].map((tab) => (
            <span
              key={tab}
              className="text-sm"
              style={{
                color: tab === 'Production' ? '#4a8c3a' : '#6a7a5e',
                fontWeight: tab === 'Production' ? 600 : 400,
                borderBottom:
                  tab === 'Production' ? '2px solid #4a8c3a' : 'none',
                paddingBottom: 2,
              }}
            >
              {tab}
            </span>
          ))}
          <div className="flex items-center gap-3">
            <span style={{ color: '#6a7a5e' }}>🎙</span>
            <span style={{ color: '#6a7a5e' }}>👤</span>
          </div>
        </nav>
      </header>

      {/* ── Village scene ── */}
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
            <div
              className="flex items-center gap-2 rounded-lg px-3 py-1.5"
              style={{
                background: 'rgba(255,250,240,0.92)',
                border: '1px solid #d8cfbc',
              }}
            >
              <span style={{ color: '#d4a850' }}>🪙</span>
              <span
                className="text-sm font-bold"
                style={{ color: '#1c2e1e' }}
              >
                1,240
              </span>
              <span
                className="text-[10px] uppercase tracking-wider"
                style={{ color: '#8a7a5a' }}
              >
                Gold
              </span>
            </div>
            <div
              className="flex items-center gap-2 rounded-lg px-3 py-1.5"
              style={{
                background: 'rgba(255,250,240,0.92)',
                border: '1px solid #d8cfbc',
              }}
            >
              <span style={{ color: '#4a8c3a' }}>🌲</span>
              <span
                className="text-sm font-bold"
                style={{ color: '#1c2e1e' }}
              >
                84
              </span>
              <span
                className="text-[10px] uppercase tracking-wider"
                style={{ color: '#8a7a5a' }}
              >
                Wood
              </span>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div
          className="flex items-center justify-between px-6 py-2"
          style={{
            background: 'rgba(255,250,240,0.92)',
            borderBottom: '1px solid #d8cfbc',
          }}
        >
          <div
            className="h-3 flex-1 overflow-hidden rounded-full"
            style={{ background: '#d8cfbc' }}
          >
            <div
              className="h-full rounded-full"
              style={{ width: '58%', background: '#4a8c3a' }}
            />
          </div>
          <span
            className="ml-4 text-xs font-semibold uppercase tracking-wider"
            style={{ color: '#6a7a5e' }}
          >
            Road to the North →
          </span>
        </div>
      </div>

      {/* ── Typing area ── */}
      <div
        className="flex flex-1 gap-0 px-0"
        style={{ background: '#f4efe4' }}
      >
        {/* Left stat: WPM */}
        <div
          className="flex w-[120px] shrink-0 flex-col items-center justify-center"
          style={{
            background: '#faf7f0',
            border: '1px solid #d8cfbc',
            borderTop: 'none',
          }}
        >
          <span style={{ color: '#4a8c3a', fontSize: '20px' }}>📡</span>
          <p
            className="mt-2 text-4xl font-bold"
            style={{ color: '#1c2e1e' }}
          >
            72
          </p>
          <p
            className="text-[10px] uppercase tracking-wider"
            style={{ color: '#8a7a5a' }}
          >
            WPM
          </p>
        </div>

        {/* Typing surface */}
        <div className="min-w-0 flex-1">
          {metrics === null ? (
            <TypingSurface
              key={prompt.id}
              onComplete={setCompletedSession}
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
            background: '#faf7f0',
            border: '1px solid #d8cfbc',
            borderTop: 'none',
          }}
        >
          <span style={{ color: '#c0392b', fontSize: '20px' }}>🎯</span>
          <p
            className="mt-2 text-4xl font-bold"
            style={{ color: '#1c2e1e' }}
          >
            98
            <span className="text-lg">%</span>
          </p>
          <p
            className="text-[10px] uppercase tracking-wider"
            style={{ color: '#8a7a5a' }}
          >
            Accuracy
          </p>
        </div>
      </div>

      {/* Bottom play button */}
      <div
        className="flex items-center justify-end px-6 py-3"
        style={{
          background: '#f4efe4',
          borderTop: '1px solid #d8cfbc',
        }}
      >
        <button
          className="flex h-12 w-12 items-center justify-center rounded-lg text-xl text-white transition hover:opacity-90"
          style={{ background: '#4a8c3a' }}
        >
          ▶
        </button>
      </div>
    </div>
  )
}
