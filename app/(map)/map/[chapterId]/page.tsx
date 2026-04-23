import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { getSessionUser } from '@/lib/auth/get-session-user'
import { readRpgProgress } from '@/lib/storage/rpg-progress'
import { getChapterDefinition, type ChapterId } from '@/lib/map/chapter-definitions'
import { isChapterUnlocked, isBossUnlocked } from '@/lib/map/map-rules'
import { MapTopBar } from '@/components/map/MapTopBar'

type Props = { params: Promise<{ chapterId: string }> }

const BG   = '#05091a'
const CARD = 'rgba(255,255,255,0.04)'
const BORDER = 'rgba(255,255,255,0.08)'
const GOLD = '#c49a3a'
const TEXT = '#e6edf3'
const MUTED = 'rgba(255,255,255,0.4)'

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
  const bossNode    = chapter.nodes.find((n)  => n.type === 'boss')
  const bossUnlocked = isBossUnlocked(chapter, progress.clearedNodeIds)

  return (
    <>
      <MapTopBar
        gold={progress.gold}
        rareMaterials={progress.rareMaterials as Record<string, number>}
      />

      <div style={{
        maxWidth: 520,
        margin: '0 auto',
        padding: '32px 20px 80px',
        fontFamily: 'var(--font-mono, monospace)',
      }}>
        {/* Back */}
        <Link href="/map" style={{ fontSize: 12, color: GOLD, letterSpacing: '0.06em', textDecoration: 'none' }}>
          ← Map
        </Link>

        {/* Chapter header */}
        <div style={{ marginTop: 16, marginBottom: 28 }}>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: TEXT }}>
            {chapter.name}
          </h1>
          <p style={{ margin: '6px 0 0', fontSize: 13, color: MUTED }}>
            {chapter.tagline}
          </p>
        </div>

        {/* Lesson nodes */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {lessonNodes.map((node) => {
            const cleared = progress.clearedNodeIds.has(node.id)
            return (
              <div
                key={node.id}
                id={node.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '14px 18px',
                  borderRadius: 10,
                  background: cleared ? 'rgba(245,158,11,0.07)' : CARD,
                  border: `1px solid ${cleared ? 'rgba(245,158,11,0.3)' : BORDER}`,
                  transition: 'border-color 150ms',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: 20 }}>{cleared ? '🪔' : '🕯️'}</span>
                  <div>
                    <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: cleared ? '#fbbf24' : TEXT }}>
                      {node.title}
                    </p>
                    <p style={{ margin: '3px 0 0', fontSize: 11, color: MUTED }}>
                      {node.keyFocus}
                    </p>
                  </div>
                </div>
                <span style={{
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: cleared ? '#f59e0b' : MUTED,
                  padding: '4px 10px',
                  borderRadius: 6,
                  background: cleared ? 'rgba(245,158,11,0.1)' : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${cleared ? 'rgba(245,158,11,0.25)' : BORDER}`,
                }}>
                  {cleared ? 'Replay' : 'Start'}
                </span>
              </div>
            )
          })}
        </div>

        {/* Boss node */}
        {bossNode && (
          <div style={{ marginTop: 20 }}>
            {bossUnlocked ? (
              <Link
                href={`/map/${chapter.id}/boss`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '16px 18px',
                  borderRadius: 10,
                  background: 'rgba(168,85,247,0.07)',
                  border: '1px solid rgba(168,85,247,0.35)',
                  textDecoration: 'none',
                  transition: 'background 150ms',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: 28 }}>💀</span>
                  <div>
                    <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#c084fc' }}>
                      {bossNode.title}
                    </p>
                    <p style={{ margin: '3px 0 0', fontSize: 11, color: 'rgba(192,132,252,0.6)' }}>
                      Boss fight — 60 second sprint
                    </p>
                  </div>
                </div>
                <span style={{
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: '#a855f7',
                  padding: '4px 10px',
                  borderRadius: 6,
                  background: 'rgba(168,85,247,0.12)',
                  border: '1px solid rgba(168,85,247,0.3)',
                }}>
                  Fight →
                </span>
              </Link>
            ) : (
              <div style={{
                padding: '16px 18px',
                borderRadius: 10,
                background: CARD,
                border: `1px solid ${BORDER}`,
                opacity: 0.4,
                display: 'flex',
                alignItems: 'center',
                gap: 12,
              }}>
                <span style={{ fontSize: 28 }}>🔒</span>
                <div>
                  <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: TEXT }}>
                    {bossNode.title}
                  </p>
                  <p style={{ margin: '3px 0 0', fontSize: 11, color: MUTED }}>
                    Complete all lessons to unlock
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  )
}
