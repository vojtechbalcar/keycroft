'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import type { ChapterId } from '@/lib/map/chapter-definitions'

type BossResult = {
  won: boolean
  score: number
  goldEarned: number
  rareDrop: string | null
  skillPointsEarned: number
}

type Props = {
  chapterId: ChapterId
  nodeId: string
  wordBank: string[]
  onComplete: (result: BossResult) => void
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function BossSession({ chapterId, nodeId, wordBank, onComplete }: Props) {
  const DURATION = 60
  const [timeLeft, setTimeLeft] = useState(DURATION)
  const [words] = useState<string[]>(() =>
    shuffle([...wordBank, ...wordBank, ...wordBank, ...wordBank]),
  )
  const [currentIndex, setCurrentIndex] = useState(0)
  const [input, setInput] = useState('')
  const [correctCount, setCorrectCount] = useState(0)
  const [totalChars, setTotalChars] = useState(0)
  const [errorCount, setErrorCount] = useState(0)
  const [started, setStarted] = useState(false)
  const [finished, setFinished] = useState(false)
  const startTimeRef = useRef<number>(0)
  const finishedRef = useRef(false)

  const finish = useCallback(
    async (correct: number, total: number, errors: number) => {
      if (finishedRef.current) return
      finishedRef.current = true
      setFinished(true)

      const elapsedMin = (Date.now() - startTimeRef.current) / 1000 / 60
      const wpm = elapsedMin > 0 ? Math.round(correct / elapsedMin) : 0
      const accuracy = total > 0 ? Math.round(((total - errors) / total) * 100) : 0

      const res = await fetch('/api/boss/attempt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chapterId, nodeId, wpm, accuracy }),
      })
      const data = await res.json()
      onComplete(data)
    },
    [chapterId, nodeId, onComplete],
  )

  useEffect(() => {
    if (!started || finished) return
    if (timeLeft <= 0) {
      finish(correctCount, totalChars, errorCount)
      return
    }
    const id = setTimeout(() => setTimeLeft((t) => t - 1), 1000)
    return () => clearTimeout(id)
  }, [started, timeLeft, finished, correctCount, totalChars, errorCount, finish])

  function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
    if (finished) return
    if (!started) {
      setStarted(true)
      startTimeRef.current = Date.now()
    }

    const val = e.target.value
    const currentWord = words[currentIndex] ?? ''

    if (val.endsWith(' ')) {
      const typed = val.trim()
      const isCorrect = typed === currentWord
      setTotalChars((t) => t + currentWord.length)
      if (isCorrect) setCorrectCount((c) => c + 1)
      else setErrorCount((err) => err + 1)
      setCurrentIndex((i) => i + 1)
      setInput('')
    } else {
      setInput(val)
    }
  }

  const currentWord = words[currentIndex] ?? ''
  const isWrong = input.length > 0 && !currentWord.startsWith(input)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <span
          className={`text-4xl font-bold tabular-nums ${
            timeLeft <= 10 ? 'text-red-400' : 'text-neutral-100'
          }`}
        >
          {timeLeft}s
        </span>
        <span className="text-sm text-neutral-400">{correctCount} words</span>
      </div>

      <div className="rounded-lg border border-neutral-700 bg-neutral-900 p-4 text-lg font-mono min-h-[3rem] flex flex-wrap gap-2">
        {words.slice(currentIndex, currentIndex + 10).map((word, i) => (
          <span
            key={currentIndex + i}
            className={i === 0 ? 'text-amber-300 underline' : 'text-neutral-500'}
          >
            {word}
          </span>
        ))}
      </div>

      <input
        autoFocus
        className={`w-full rounded-lg border px-4 py-3 bg-neutral-800 font-mono text-lg text-neutral-100 outline-none transition-colors ${
          isWrong
            ? 'border-red-500 bg-red-950/20'
            : 'border-neutral-600 focus:border-neutral-400'
        }`}
        value={input}
        onChange={handleInput}
        disabled={finished}
        placeholder={started ? '' : 'Start typing to begin…'}
      />

      {!started && (
        <p className="text-xs text-center text-neutral-500">
          Type the highlighted word and press space to advance
        </p>
      )}
    </div>
  )
}
