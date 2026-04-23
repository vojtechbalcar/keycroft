import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getSessionUser } from '@/lib/auth/get-session-user'
import { readRpgProgress } from '@/lib/storage/rpg-progress'
import { chapterDefinitions } from '@/lib/map/chapter-definitions'
import { isChapterUnlocked, isBossUnlocked } from '@/lib/map/map-rules'
import { MapTopBar } from '@/components/map/MapTopBar'

// Positions as % of the map container (xPct, yPct)
// Roughly follow the lantern path on the island image bottom→top
const NODE_POSITIONS: Record<string, { x: number; y: number }> = {
  'home-row-1':      { x: 29, y: 80 },
  'home-row-2':      { x: 22, y: 63 },
  'home-row-3':      { x: 42, y: 54 },
  'home-row-boss':   { x: 56, y: 44 },
  'reach-keys-1':    { x: 42, y: 36 },
  'reach-keys-2':    { x: 64, y: 27 },
  'reach-keys-3':    { x: 52, y: 19 },
  'reach-keys-boss': { x: 55, y: 10 },
}

export default async function MapPage() {
  const sessionUser = await getSessionUser()
  if (!sessionUser) redirect('/login')

  const progress = await readRpgProgress(sessionUser.id)

  const allNodes = chapterDefinitions.flatMap((chapter) => {
    const chapterUnlocked = isChapterUnlocked(chapter.buildingUnlockKey, progress.buildingLevels)
    const bossUnlocked = chapterUnlocked && isBossUnlocked(chapter, progress.clearedNodeIds)

    return chapter.nodes.map((node) => ({
      ...node,
      chapterId: chapter.id,
      cleared:   progress.clearedNodeIds.has(node.id),
      locked:    !chapterUnlocked || (node.type === 'boss' && !bossUnlocked),
      pos:       NODE_POSITIONS[node.id] ?? { x: 50, y: 50 },
      // Every node goes directly to typing — no intermediate chapter page
      href: node.type === 'boss'
        ? `/map/${chapter.id}/boss`
        : `/map/${chapter.id}/lesson/${node.id}`,
    }))
  })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      <MapTopBar
        gold={progress.gold}
        rareMaterials={progress.rareMaterials as Record<string, number>}
      />

      {/* Map canvas */}
      <div style={{ position: 'relative', flex: 1, overflow: 'hidden' }}>

        {/* Island background */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/MAP_ISLAND_ONE.png"
          alt="Island adventure map"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center 35%',
            userSelect: 'none',
            pointerEvents: 'none',
          }}
        />

        {/* Hotspots — invisible clickable areas over each lantern */}
        {allNodes.map((node) => {
          const isBoss = node.type === 'boss'

          const hotspotClass = [
            'map-hotspot',
            isBoss ? 'map-hotspot--boss' : '',
            node.cleared ? (isBoss ? 'map-hotspot--cleared-boss' : 'map-hotspot--cleared') : '',
          ].filter(Boolean).join(' ')

          return (
            <div
              key={node.id}
              style={{
                position: 'absolute',
                left: `${node.pos.x}%`,
                top: `${node.pos.y}%`,
                transform: 'translate(-50%, -50%)',
                zIndex: 10,
              }}
            >
              {node.locked ? (
                <div style={{ width: 32, height: 32, borderRadius: '50%', cursor: 'default' }} />
              ) : (
                <Link
                  href={node.href}
                  className={hotspotClass}
                  data-label={node.title}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
