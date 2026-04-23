import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getSessionUser } from '@/lib/auth/get-session-user'
import { readRpgProgress } from '@/lib/storage/rpg-progress'
import { chapterDefinitions } from '@/lib/map/chapter-definitions'
import { isChapterUnlocked, isBossUnlocked } from '@/lib/map/map-rules'
import { MapTopBar } from '@/components/map/MapTopBar'

// All lantern positions as % of the map canvas
// First entries map 1:1 to lesson/boss nodes; the rest are locked future lanterns
const LANTERN_POSITIONS: { x: number; y: number }[] = [
  // ── Actual lesson/boss nodes (order matches chapterDefinitions flat nodes) ──
  { x: 27, y: 84 }, // home-row-1
  { x: 21, y: 70 }, // home-row-2
  { x: 17, y: 58 }, // home-row-3
  { x: 22, y: 48 }, // home-row-boss
  { x: 31, y: 42 }, // reach-keys-1
  { x: 43, y: 38 }, // reach-keys-2
  { x: 55, y: 34 }, // reach-keys-3
  { x: 60, y: 26 }, // reach-keys-boss

  // ── Future locked lanterns (decorative path — unlocked in future updates) ──
  { x: 29, y: 88 }, { x: 24, y: 80 }, { x: 19, y: 74 },
  { x: 16, y: 64 }, { x: 15, y: 54 }, { x: 18, y: 44 },
  { x: 25, y: 38 }, { x: 33, y: 35 }, { x: 40, y: 34 },
  { x: 47, y: 35 }, { x: 52, y: 32 }, { x: 57, y: 29 },
  { x: 63, y: 23 }, { x: 66, y: 18 }, { x: 64, y: 13 },
  { x: 59, y: 10 }, { x: 53, y: 9  }, { x: 47, y: 11 },
  { x: 42, y: 14 }, { x: 37, y: 18 }, { x: 35, y: 24 },
  { x: 36, y: 30 }, { x: 39, y: 36 }, { x: 45, y: 42 },
  { x: 50, y: 47 }, { x: 55, y: 44 }, { x: 60, y: 41 },
  { x: 65, y: 37 }, { x: 68, y: 31 }, { x: 70, y: 25 },
  { x: 69, y: 19 }, { x: 66, y: 14 }, { x: 61, y: 11 },
  { x: 56, y: 8  }, { x: 50, y: 7  }, { x: 44, y: 8  },
  { x: 38, y: 11 }, { x: 33, y: 15 }, { x: 29, y: 20 },
  { x: 27, y: 26 }, { x: 28, y: 32 }, { x: 31, y: 37 },
  { x: 37, y: 41 }, { x: 44, y: 45 }, { x: 52, y: 49 },
  { x: 58, y: 52 }, { x: 62, y: 48 }, { x: 65, y: 43 },
]

export default async function MapPage() {
  const sessionUser = await getSessionUser()
  if (!sessionUser) redirect('/login')

  const progress = await readRpgProgress(sessionUser.id)

  // Flatten lesson/boss nodes in definition order
  const nodes = chapterDefinitions.flatMap((chapter) => {
    const chapterUnlocked = isChapterUnlocked(chapter.buildingUnlockKey, progress.buildingLevels)
    const bossUnlocked = chapterUnlocked && isBossUnlocked(chapter, progress.clearedNodeIds)
    return chapter.nodes.map((node) => ({
      ...node,
      chapterId: chapter.id,
      cleared:   progress.clearedNodeIds.has(node.id),
      locked:    !chapterUnlocked || (node.type === 'boss' && !bossUnlocked),
      href: node.type === 'boss'
        ? `/map/${chapter.id}/boss`
        : `/map/${chapter.id}/lesson/${node.id}`,
    }))
  })

  // The first un-cleared, unlocked node is "next"
  const nextIdx = nodes.findIndex((n) => !n.cleared && !n.locked)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      <MapTopBar
        gold={progress.gold}
        rareMaterials={progress.rareMaterials as Record<string, number>}
      />

      <div style={{ position: 'relative', flex: 1, overflow: 'hidden' }}>
        {/* Island background */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/MAP_ISLAND_ONE.png"
          alt="Island adventure map"
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%',
            objectFit: 'cover', objectPosition: 'center 35%',
            userSelect: 'none', pointerEvents: 'none',
          }}
        />

        {/* All lantern hotspots */}
        {LANTERN_POSITIONS.map((pos, i) => {
          const node = nodes[i]   // undefined for future lanterns

          // Determine visual state
          const isNext    = node && i === nextIdx
          const isCleared = node?.cleared
          const isBossNode = node?.type === 'boss'
          const isLocked  = !node || node.locked

          if (isNext) {
            // Bright pulsing — the one to do next
            return (
              <div key={i} style={{ position: 'absolute', left: `${pos.x}%`, top: `${pos.y}%`, transform: 'translate(-50%,-50%)', zIndex: 10 }}>
                <Link
                  href={node.href}
                  className={isBossNode ? 'map-hotspot map-hotspot--boss map-hotspot--next' : 'map-hotspot map-hotspot--next'}
                  data-label={node.title}
                />
              </div>
            )
          }

          if (isCleared) {
            // Muted dim ring — already done
            return (
              <div key={i} style={{ position: 'absolute', left: `${pos.x}%`, top: `${pos.y}%`, transform: 'translate(-50%,-50%)', zIndex: 10 }}>
                <Link
                  href={node.href}
                  className={isBossNode ? 'map-hotspot map-hotspot--boss map-hotspot--cleared-boss' : 'map-hotspot map-hotspot--cleared'}
                  data-label={node.title}
                />
              </div>
            )
          }

          // Future / locked — no visible indicator, no link
          return (
            <div key={i} style={{ position: 'absolute', left: `${pos.x}%`, top: `${pos.y}%`, transform: 'translate(-50%,-50%)', zIndex: 5 }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%' }} />
            </div>
          )
        })}
      </div>
    </div>
  )
}
