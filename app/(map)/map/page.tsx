import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getSessionUser } from '@/lib/auth/get-session-user'
import { readRpgProgress } from '@/lib/storage/rpg-progress'
import { chapterDefinitions } from '@/lib/map/chapter-definitions'
import { isChapterUnlocked, isBossUnlocked } from '@/lib/map/map-rules'
import { MapTopBar } from '@/components/map/MapTopBar'

// Winding path coordinates (left=100, center=240, right=380 in a 480px canvas)
const NODE_POSITIONS: Record<string, { x: number; y: number }> = {
  'home-row-1':      { x: 240, y: 860 },
  'home-row-2':      { x: 100, y: 740 },
  'home-row-3':      { x: 380, y: 620 },
  'home-row-boss':   { x: 240, y: 500 },
  'reach-keys-1':    { x: 100, y: 380 },
  'reach-keys-2':    { x: 380, y: 260 },
  'reach-keys-3':    { x: 100, y: 140 },
  'reach-keys-boss': { x: 240, y: 40 },
}

// Bezier path connecting all nodes bottom → top
const PATH_D = `
  M 240 860
  C 185 830, 115 795, 100 740
  C 85  705, 215 665, 380 620
  C 415 600, 320 555, 240 500
  C 180 465, 110 430, 100 380
  C 88  345, 220 305, 380 260
  C 415 238, 195 188, 100 140
  C 82  110, 175 65,  240 40
`

// Stars scattered across the canvas
const STARS = [
  { x: 30,  y: 80,  r: 1.5 }, { x: 430, y: 50,  r: 1 },
  { x: 460, y: 180, r: 1.5 }, { x: 15,  y: 260, r: 1 },
  { x: 450, y: 340, r: 1 },   { x: 35,  y: 420, r: 1.5 },
  { x: 460, y: 480, r: 1 },   { x: 20,  y: 550, r: 1 },
  { x: 445, y: 620, r: 1.5 }, { x: 25,  y: 700, r: 1 },
  { x: 455, y: 760, r: 1 },   { x: 18,  y: 820, r: 1.5 },
  { x: 470, y: 900, r: 1 },
]

export default async function MapPage() {
  const sessionUser = await getSessionUser()
  if (!sessionUser) redirect('/login')

  const progress = await readRpgProgress(sessionUser.id)

  // Flatten all nodes with computed state
  const allNodes = chapterDefinitions.flatMap((chapter) => {
    const chapterUnlocked = isChapterUnlocked(chapter.buildingUnlockKey, progress.buildingLevels)
    const bossUnlocked = chapterUnlocked && isBossUnlocked(chapter, progress.clearedNodeIds)

    return chapter.nodes.map((node) => ({
      ...node,
      chapterId: chapter.id,
      chapterName: chapter.name,
      cleared: progress.clearedNodeIds.has(node.id),
      locked: !chapterUnlocked || (node.type === 'boss' && !bossUnlocked),
      pos: NODE_POSITIONS[node.id] ?? { x: 240, y: 480 },
      href: node.type === 'boss'
        ? `/map/${chapter.id}/boss`
        : `/map/${chapter.id}#${node.id}`,
    }))
  })

  const totalNodes = allNodes.length
  const clearedCount = allNodes.filter((n) => n.cleared).length

  return (
    <>
      <MapTopBar
        gold={progress.gold}
        rareMaterials={progress.rareMaterials as Record<string, number>}
      />

      {/* Completion counter (top right of map) */}
      <div style={{
        textAlign: 'center',
        padding: '12px 0 0',
        fontSize: 11,
        color: 'rgba(196,154,58,0.6)',
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
      }}>
        {clearedCount} / {totalNodes} completed
      </div>

      {/* Map canvas */}
      <div style={{ display: 'flex', justifyContent: 'center', padding: '8px 16px 100px' }}>
        <div style={{ position: 'relative', width: 480, height: 920 }}>

          {/* SVG: stars + path */}
          <svg
            width={480}
            height={920}
            style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
            aria-hidden="true"
          >
            {/* Stars */}
            {STARS.map((s, i) => (
              <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="white" opacity={0.35} />
            ))}

            {/* Moon */}
            <circle cx={440} cy={100} r={22} fill="#f0e6c8" opacity={0.18} />
            <circle cx={452} cy={93}  r={18} fill="#05091a"  opacity={0.9} />

            {/* Path shadow */}
            <path
              d={PATH_D}
              fill="none"
              stroke="rgba(0,0,0,0.55)"
              strokeWidth={20}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Dirt road */}
            <path
              d={PATH_D}
              fill="none"
              stroke="#5a3a10"
              strokeWidth={15}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Road edge highlight */}
            <path
              d={PATH_D}
              fill="none"
              stroke="rgba(196,154,58,0.15)"
              strokeWidth={4}
              strokeLinecap="round"
              strokeDasharray="6 18"
            />
          </svg>

          {/* Nodes */}
          {allNodes.map((node) => {
            const isBoss = node.type === 'boss'
            const size = isBoss ? 74 : 58

            // Visual state colours
            let bg: string
            let border: string
            let glow: string
            let iconOpacity = 1

            if (node.cleared) {
              bg     = isBoss ? '#2d1a4a' : '#2a1a06'
              border = isBoss ? '#a855f7' : '#f59e0b'
              glow   = isBoss
                ? '0 0 0 3px rgba(168,85,247,0.35), 0 0 18px 6px rgba(168,85,247,0.3), 0 0 36px 14px rgba(168,85,247,0.12)'
                : '0 0 0 3px rgba(245,158,11,0.35), 0 0 18px 6px rgba(245,158,11,0.3), 0 0 36px 14px rgba(245,158,11,0.12)'
            } else if (node.locked) {
              bg     = '#0e1220'
              border = '#1e2535'
              glow   = 'none'
              iconOpacity = 0.35
            } else {
              // available
              bg     = isBoss ? '#1a0d28' : '#160e02'
              border = isBoss ? '#7c3aed' : '#92400e'
              glow   = isBoss
                ? '0 0 0 2px rgba(124,58,237,0.2), 0 0 10px 3px rgba(124,58,237,0.15)'
                : '0 0 0 2px rgba(196,154,58,0.2), 0 0 10px 3px rgba(196,154,58,0.12)'
            }

            const icon = node.locked
              ? '🔒'
              : node.cleared
                ? (isBoss ? '⚔️' : '🪔')
                : (isBoss ? '💀' : '🪔')

            const labelColor = node.locked
              ? 'rgba(255,255,255,0.2)'
              : node.cleared
                ? (isBoss ? '#c084fc' : '#fbbf24')
                : (isBoss ? '#a78bfa' : 'rgba(255,255,255,0.7)')

            const glowClass = node.cleared ? 'kc-lamp-lit' : (!node.locked ? 'kc-lamp-available' : '')

            const circleStyle: React.CSSProperties = {
              width: size,
              height: size,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: isBoss ? 28 : 22,
              background: bg,
              border: `2px solid ${border}`,
              boxShadow: glow,
              cursor: node.locked ? 'not-allowed' : 'pointer',
              textDecoration: 'none',
              opacity: iconOpacity,
              transition: 'transform 120ms ease, box-shadow 120ms ease',
              flexShrink: 0,
            }

            return (
              <div
                key={node.id}
                style={{
                  position: 'absolute',
                  left: node.pos.x - size / 2,
                  top: node.pos.y - size / 2,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 7,
                  width: size,
                }}
              >
                {/* Outer glow ring for cleared nodes */}
                {node.cleared && (
                  <div
                    className={glowClass}
                    style={{
                      position: 'absolute',
                      top: -10,
                      left: -10,
                      width: size + 20,
                      height: size + 20,
                      borderRadius: '50%',
                      background: isBoss
                        ? 'radial-gradient(circle, rgba(168,85,247,0.2) 0%, transparent 70%)'
                        : 'radial-gradient(circle, rgba(245,158,11,0.2) 0%, transparent 70%)',
                      pointerEvents: 'none',
                    }}
                  />
                )}

                {node.locked ? (
                  <div style={circleStyle}>{icon}</div>
                ) : (
                  <Link href={node.href} className={glowClass} style={circleStyle}>
                    {icon}
                  </Link>
                )}

                {/* Label below node */}
                <span style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: labelColor,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  textAlign: 'center',
                  whiteSpace: 'nowrap',
                  pointerEvents: 'none',
                  textShadow: '0 1px 4px rgba(0,0,0,0.8)',
                }}>
                  {node.title}
                </span>

                {/* Cleared badge */}
                {node.cleared && (
                  <span style={{
                    fontSize: 9,
                    color: isBoss ? '#a855f7' : '#f59e0b',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    opacity: 0.8,
                  }}>
                    ✓ done
                  </span>
                )}
              </div>
            )
          })}

          {/* Chapter name labels */}
          <div style={{
            position: 'absolute',
            left: 0, right: 0,
            top: 460,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            pointerEvents: 'none',
          }}>
            <div style={{
              padding: '4px 14px',
              borderRadius: 20,
              background: 'rgba(196,154,58,0.08)',
              border: '1px solid rgba(196,154,58,0.15)',
              fontSize: 9,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: 'rgba(196,154,58,0.5)',
            }}>
              Chapter 2 unlocks above
            </div>
          </div>

        </div>
      </div>
    </>
  )
}
