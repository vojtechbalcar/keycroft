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

        {/* Nodes */}
        {allNodes.map((node) => {
          const isBoss = node.type === 'boss'
          const size = isBoss ? 52 : 42

          let borderColor: string
          let bg: string
          let glow: string

          if (node.cleared) {
            borderColor = isBoss ? '#c084fc' : '#fbbf24'
            bg          = isBoss ? 'rgba(45,26,74,0.85)' : 'rgba(42,26,6,0.85)'
            glow        = isBoss
              ? '0 0 14px 5px rgba(168,85,247,0.55), 0 0 4px 2px rgba(168,85,247,0.8)'
              : '0 0 14px 5px rgba(245,158,11,0.55), 0 0 4px 2px rgba(245,158,11,0.8)'
          } else if (node.locked) {
            borderColor = 'rgba(255,255,255,0.12)'
            bg          = 'rgba(10,14,30,0.7)'
            glow        = 'none'
          } else {
            borderColor = isBoss ? 'rgba(168,85,247,0.7)' : 'rgba(196,154,58,0.7)'
            bg          = isBoss ? 'rgba(30,15,50,0.8)' : 'rgba(20,14,4,0.8)'
            glow        = isBoss
              ? '0 0 8px 3px rgba(124,58,237,0.4)'
              : '0 0 8px 3px rgba(196,154,58,0.35)'
          }

          const icon = node.locked
            ? '🔒'
            : node.cleared
              ? (isBoss ? '⚔️' : '🪔')
              : (isBoss ? '💀' : '🪔')

          const animClass = node.cleared
            ? 'kc-lamp-lit'
            : (!node.locked ? 'kc-lamp-available' : '')

          const circleStyle: React.CSSProperties = {
            width: size,
            height: size,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: isBoss ? 22 : 18,
            background: bg,
            border: `2px solid ${borderColor}`,
            boxShadow: glow,
            cursor: node.locked ? 'default' : 'pointer',
            textDecoration: 'none',
            backdropFilter: 'blur(4px)',
            opacity: node.locked ? 0.45 : 1,
          }

          return (
            <div
              key={node.id}
              style={{
                position: 'absolute',
                left: `${node.pos.x}%`,
                top: `${node.pos.y}%`,
                transform: 'translate(-50%, -50%)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 5,
                zIndex: 10,
              }}
            >
              {node.locked ? (
                <div style={circleStyle}>{icon}</div>
              ) : (
                <Link href={node.href} className={animClass} style={circleStyle}>
                  {icon}
                </Link>
              )}

              <span style={{
                fontSize: 9,
                fontWeight: 700,
                letterSpacing: '0.07em',
                textTransform: 'uppercase',
                color: node.cleared
                  ? (isBoss ? '#c084fc' : '#fbbf24')
                  : node.locked ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.75)',
                textShadow: '0 1px 6px rgba(0,0,0,0.9), 0 0 12px rgba(0,0,0,0.7)',
                textAlign: 'center',
                whiteSpace: 'nowrap',
                maxWidth: 80,
                pointerEvents: 'none',
              }}>
                {node.title}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
