import type { ChapterDefinition } from '@/lib/map/chapter-definitions'
import type { BuildingLevels } from '@/lib/map/map-rules'
import { isChapterUnlocked, isBossUnlocked } from '@/lib/map/map-rules'
import { MapNode } from '@/components/map/MapNode'

type Props = {
  chapter: ChapterDefinition
  buildingLevels: BuildingLevels
  clearedNodeIds: Set<string>
}

export function ChapterCard({ chapter, buildingLevels, clearedNodeIds }: Props) {
  const unlocked = isChapterUnlocked(chapter.buildingUnlockKey, buildingLevels)
  const bossUnlocked = unlocked && isBossUnlocked(chapter, clearedNodeIds)

  return (
    <div
      className={`rounded-xl border p-5 space-y-4 ${
        unlocked
          ? 'border-neutral-600 bg-neutral-900'
          : 'border-neutral-800 bg-neutral-950 opacity-60'
      }`}
    >
      <div>
        <h2 className="text-lg font-semibold text-neutral-100">{chapter.name}</h2>
        <p className="text-sm text-neutral-400">{chapter.tagline}</p>
      </div>

      {!unlocked && (
        <p className="text-xs text-amber-400">
          Upgrade your Town Hall to unlock this chapter.
        </p>
      )}

      <div className="grid grid-cols-2 gap-2">
        {chapter.nodes.map((node) => {
          const isLocked = !unlocked || (node.type === 'boss' && !bossUnlocked)
          return (
            <MapNode
              key={node.id}
              node={node}
              chapterId={chapter.id}
              cleared={clearedNodeIds.has(node.id)}
              locked={isLocked}
            />
          )
        })}
      </div>
    </div>
  )
}
