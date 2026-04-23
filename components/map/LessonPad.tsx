'use client'

import { useState } from 'react'
import Link from 'next/link'
import { TypingSurface } from '@/components/typing/typing-surface'
import { HandDiagram } from '@/components/map/HandDiagram'
import { calculateSessionMetrics } from '@/lib/typing/session-metrics'
import type { TypingSessionState } from '@/lib/typing/text-runner'
import type { ChapterId } from '@/lib/map/chapter-definitions'
import type { PracticeText } from '@/lib/typing/practice-texts'

type Props = {
  chapterId: ChapterId
  nodeId: string
  prompt: PracticeText
  keyFocusParsed: string[]
}

type Result = {
  wpm: number
  accuracy: number
  goldEarned: number
  isFirstClear: boolean
}

const GOLD  = '#c49a3a'
const TEXT  = '#e6edf3'
const MUTED = 'rgba(255,255,255,0.4)'
const CARD  = 'rgba(255,255,255,0.04)'
const BORD  = 'rgba(255,255,255,0.1)'

export function LessonPad({ chapterId, nodeId, prompt, keyFocusParsed }: Props) {
  const [result, setResult] = useState<Result | null>(null)
  const [key, setKey] = useState(0)

  async function handleComplete(session: TypingSessionState) {
    const m = calculateSessionMetrics(session)
    try {
      const res = await fetch('/api/lesson/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chapterId, nodeId, wpm: m.wpm, accuracy: m.accuracy }),
      })
      const data = (await res.json()) as { goldEarned: number; isFirstClear: boolean }
      setResult({ wpm: m.wpm, accuracy: m.accuracy, goldEarned: data.goldEarned, isFirstClear: data.isFirstClear })
    } catch {
      setResult({ wpm: m.wpm, accuracy: m.accuracy, goldEarned: 0, isFirstClear: false })
    }
  }

  if (result) {
    return (
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        gap: 24, padding: '40px 24px',
      }}>
        <div style={{ fontSize: 52 }}>
          {result.accuracy >= 85 ? '🪔' : '💨'}
        </div>
        <div style={{ textAlign: 'center' }}>
          <p style={{ margin: 0, fontSize: 22, fontWeight: 700, color: TEXT }}>
            {result.accuracy >= 85 ? 'Lesson Complete!' : 'Keep Going'}
          </p>
          {result.isFirstClear && (
            <p style={{ margin: '6px 0 0', fontSize: 11, color: GOLD, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              ✦ First Clear
            </p>
          )}
        </div>

        <div style={{ display: 'flex', gap: 16 }}>
          {[
            { label: 'WPM',      val: String(result.wpm)        },
            { label: 'Accuracy', val: `${result.accuracy}%`     },
          ].map(({ label, val }) => (
            <div key={label} style={{
              padding: '14px 24px', borderRadius: 10,
              background: CARD, border: `1px solid ${BORD}`,
              textAlign: 'center',
            }}>
              <div style={{ fontSize: 26, fontWeight: 700, color: TEXT }}>{val}</div>
              <div style={{ fontSize: 10, color: MUTED, marginTop: 4, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{label}</div>
            </div>
          ))}
        </div>

        {result.goldEarned > 0 && (
          <div style={{
            padding: '10px 22px', borderRadius: 8,
            background: 'rgba(196,154,58,0.08)', border: '1px solid rgba(196,154,58,0.25)',
            fontSize: 14, color: GOLD, fontWeight: 700,
          }}>
            🪙 +{result.goldEarned} gold
          </div>
        )}

        <div style={{ display: 'flex', gap: 12 }}>
          <button
            onClick={() => { setResult(null); setKey((k) => k + 1) }}
            style={{
              padding: '10px 22px', borderRadius: 8, cursor: 'pointer',
              background: CARD, border: `1px solid ${BORD}`,
              color: TEXT, fontSize: 13, fontWeight: 600,
            }}
          >
            Replay
          </button>
          <Link href="/map" style={{
            padding: '10px 22px', borderRadius: 8,
            background: GOLD, color: '#05091a',
            fontSize: 13, fontWeight: 700, textDecoration: 'none',
            display: 'inline-flex', alignItems: 'center',
          }}>
            Back to Map →
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Hand diagram */}
      <div style={{
        display: 'flex', justifyContent: 'center',
        padding: '16px 0 8px',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        <HandDiagram keyFocus={keyFocusParsed} />
      </div>

      {/* Typing surface */}
      <TypingSurface
        key={key}
        prompt={prompt}
        keyFocus={keyFocusParsed}
        onComplete={handleComplete}
      />
    </div>
  )
}
