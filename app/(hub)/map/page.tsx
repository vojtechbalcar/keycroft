import { redirect } from 'next/navigation'
import { getSessionUser } from '@/lib/auth/get-session-user'
import { readRpgProgress } from '@/lib/storage/rpg-progress'
import { chapterDefinitions } from '@/lib/map/chapter-definitions'
import { ChapterCard } from '@/components/map/ChapterCard'

export default async function MapPage() {
  const sessionUser = await getSessionUser()
  if (!sessionUser) redirect('/login')

  const progress = await readRpgProgress(sessionUser.id)

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-100">Adventure Map</h1>
          <p className="text-sm text-neutral-400">
            Complete lessons to unlock the boss. Defeat the boss to earn loot.
          </p>
        </div>
        <div className="text-right text-sm text-neutral-300">
          <div>🪙 {progress.gold} gold</div>
          {Object.entries(progress.rareMaterials)
            .filter(([, v]) => v > 0)
            .map(([k, v]) => (
              <div key={k}>
                ✨ {v} {k}
              </div>
            ))}
        </div>
      </div>

      <div className="space-y-4">
        {chapterDefinitions.map((chapter) => (
          <ChapterCard
            key={chapter.id}
            chapter={chapter}
            buildingLevels={progress.buildingLevels}
            clearedNodeIds={progress.clearedNodeIds}
          />
        ))}
      </div>
    </div>
  )
}
