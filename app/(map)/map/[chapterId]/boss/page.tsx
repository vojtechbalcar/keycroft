'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { getChapterDefinition, type ChapterId } from '@/lib/map/chapter-definitions'
import { BossSession } from '@/components/boss/BossSession'
import { BossResult } from '@/components/boss/BossResult'

type ResultState = {
  won: boolean
  score: number
  goldEarned: number
  rareDrop: string | null
  skillPointsEarned: number
}

const MUTED = 'rgba(255,255,255,0.4)'
const TEXT  = '#e6edf3'

export default function BossPage() {
  const { chapterId } = useParams<{ chapterId: ChapterId }>()
  const [result, setResult] = useState<ResultState | null>(null)
  const [key, setKey] = useState(0)

  let chapter
  try {
    chapter = getChapterDefinition(chapterId)
  } catch {
    return <p style={{ padding: 32, color: MUTED }}>Chapter not found.</p>
  }

  const bossNode = chapter.nodes.find((n) => n.type === 'boss')
  if (!bossNode) return <p style={{ padding: 32, color: MUTED }}>No boss in this chapter.</p>

  function handleRetry() {
    setResult(null)
    setKey((k) => k + 1)
  }

  return (
    <div style={{
      maxWidth: 560,
      margin: '0 auto',
      padding: '32px 20px 80px',
      fontFamily: 'var(--font-mono, monospace)',
    }}>
      <div style={{ marginBottom: 24 }}>
        <Link
          href={`/map/${chapterId}`}
          style={{ fontSize: 12, color: '#c49a3a', letterSpacing: '0.06em', textDecoration: 'none' }}
        >
          ← Chapter
        </Link>
        <h1 style={{ margin: '12px 0 4px', fontSize: 22, fontWeight: 700, color: TEXT }}>
          {bossNode.title}
        </h1>
        <p style={{ margin: 0, fontSize: 13, color: MUTED }}>
          Type as many words as you can in 60 seconds.
        </p>
      </div>

      {result ? (
        <BossResult {...result} chapterId={chapterId} onRetry={handleRetry} />
      ) : (
        <BossSession
          key={key}
          chapterId={chapterId}
          nodeId={bossNode.id}
          wordBank={bossNode.wordBank}
          onComplete={setResult}
        />
      )}
    </div>
  )
}
