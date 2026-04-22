import Link from 'next/link'

type Props = {
  won: boolean
  score: number
  goldEarned: number
  rareDrop: string | null
  skillPointsEarned: number
  chapterId: string
  onRetry: () => void
}

export function BossResult({
  won,
  score,
  goldEarned,
  rareDrop,
  skillPointsEarned,
  chapterId,
  onRetry,
}: Props) {
  return (
    <div className="text-center space-y-6">
      <div>
        <p className="text-5xl">{won ? '🏆' : '💀'}</p>
        <h2 className="mt-3 text-2xl font-bold text-neutral-100">
          {won ? 'Victory!' : 'Defeated'}
        </h2>
        <p className="text-neutral-400 mt-1">Score: {score}</p>
      </div>

      <div className="rounded-lg border border-neutral-700 bg-neutral-900 p-4 space-y-2 text-sm text-left">
        <div className="flex justify-between text-neutral-300">
          <span>Gold earned</span>
          <span className="text-amber-400 font-medium">+{goldEarned} 🪙</span>
        </div>
        {rareDrop && (
          <div className="flex justify-between text-neutral-300">
            <span>Rare drop</span>
            <span className="text-purple-400 font-medium">+1 {rareDrop} ✨</span>
          </div>
        )}
        {skillPointsEarned > 0 && (
          <div className="flex justify-between text-neutral-300">
            <span>Skill point</span>
            <span className="text-blue-400 font-medium">+{skillPointsEarned} ⚡</span>
          </div>
        )}
      </div>

      <div className="flex gap-3 justify-center flex-wrap">
        {!won && (
          <button
            onClick={onRetry}
            className="px-5 py-2 rounded-lg bg-neutral-700 text-neutral-100 hover:bg-neutral-600 font-medium"
          >
            Try Again
          </button>
        )}
        <Link
          href={`/map/${chapterId}`}
          className="px-5 py-2 rounded-lg bg-neutral-800 text-neutral-100 hover:bg-neutral-700 font-medium"
        >
          Back to Chapter
        </Link>
        <Link
          href="/village"
          className="px-5 py-2 rounded-lg bg-amber-700 text-white hover:bg-amber-600 font-medium"
        >
          Go to Village
        </Link>
      </div>
    </div>
  )
}
