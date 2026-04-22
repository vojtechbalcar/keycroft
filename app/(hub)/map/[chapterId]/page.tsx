import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { getSessionUser } from '@/lib/auth/get-session-user'
import { readRpgProgress } from '@/lib/storage/rpg-progress'
import { getChapterDefinition, type ChapterId } from '@/lib/map/chapter-definitions'
import { isChapterUnlocked, isBossUnlocked } from '@/lib/map/map-rules'

type Props = { params: Promise<{ chapterId: string }> }

export default async function ChapterPage({ params }: Props) {
  const { chapterId } = await params
  const sessionUser = await getSessionUser()
  if (!sessionUser) redirect('/login')

  let chapter
  try {
    chapter = getChapterDefinition(chapterId as ChapterId)
  } catch {
    notFound()
  }

  const progress = await readRpgProgress(sessionUser.id)

  if (!isChapterUnlocked(chapter.buildingUnlockKey, progress.buildingLevels)) {
    redirect('/map')
  }

  const lessonNodes = chapter.nodes.filter((n) => n.type === 'lesson')
  const bossNode = chapter.nodes.find((n) => n.type === 'boss')
  const bossUnlocked = isBossUnlocked(chapter, progress.clearedNodeIds)

  return (
    <div className="max-w-xl mx-auto px-4 py-10 space-y-6">
      <div>
        <Link href="/map" className="text-sm text-neutral-400 hover:text-neutral-200">
          ← Map
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-neutral-100">{chapter.name}</h1>
        <p className="text-sm text-neutral-400">{chapter.tagline}</p>
      </div>

      <div className="space-y-3">
        {lessonNodes.map((node) => {
          const cleared = progress.clearedNodeIds.has(node.id)
          return (
            <div
              key={node.id}
              id={node.id}
              className={`rounded-lg border p-4 flex items-center justify-between ${
                cleared
                  ? 'border-emerald-700 bg-emerald-950'
                  : 'border-neutral-600 bg-neutral-900'
              }`}
            >
              <div>
                <p className="font-medium text-neutral-100">{node.title}</p>
                <p className="text-xs text-neutral-400 mt-0.5">Keys: {node.keyFocus}</p>
              </div>
              <span
                className={`text-xs px-3 py-1.5 rounded font-medium ${
                  cleared
                    ? 'bg-emerald-800 text-emerald-200'
                    : 'bg-neutral-700 text-neutral-200'
                }`}
              >
                {cleared ? 'Replay' : 'Start'}
              </span>
            </div>
          )
        })}
      </div>

      {bossNode && (
        <div className="pt-2">
          {bossUnlocked ? (
            <Link
              href={`/map/${chapter.id}/boss`}
              className="flex items-center justify-between rounded-lg border border-red-800 bg-red-950 p-4 hover:bg-red-900 transition-colors"
            >
              <div>
                <p className="font-semibold text-red-200">{bossNode.title}</p>
                <p className="text-xs text-red-400 mt-0.5">Boss fight — 60 second sprint</p>
              </div>
              <span className="text-2xl">💀</span>
            </Link>
          ) : (
            <div className="rounded-lg border border-neutral-700 bg-neutral-900 p-4 opacity-50">
              <p className="font-semibold text-neutral-400">{bossNode.title}</p>
              <p className="text-xs text-neutral-500 mt-0.5">
                Complete all lessons to unlock the boss
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
