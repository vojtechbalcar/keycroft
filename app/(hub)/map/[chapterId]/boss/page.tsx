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

export default function BossPage() {
  const { chapterId } = useParams<{ chapterId: ChapterId }>()
  const [result, setResult] = useState<ResultState | null>(null)
  const [key, setKey] = useState(0)

  let chapter
  try {
    chapter = getChapterDefinition(chapterId)
  } catch {
    return <p className="p-8 text-neutral-400">Chapter not found.</p>
  }

  const bossNode = chapter.nodes.find((n) => n.type === 'boss')
  if (!bossNode) return <p className="p-8 text-neutral-400">No boss in this chapter.</p>

  function handleRetry() {
    setResult(null)
    setKey((k) => k + 1)
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-10 space-y-6">
      <div>
        <Link
          href={`/map/${chapterId}`}
          className="text-sm text-neutral-400 hover:text-neutral-200"
        >
          ← Chapter
        </Link>
        <h1 className="mt-2 text-xl font-bold text-neutral-100">{bossNode.title}</h1>
        <p className="text-sm text-neutral-400">
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
