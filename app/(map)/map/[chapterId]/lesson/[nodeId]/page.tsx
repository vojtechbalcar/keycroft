import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { getSessionUser } from '@/lib/auth/get-session-user'
import { readRpgProgress } from '@/lib/storage/rpg-progress'
import { getChapterDefinition, type ChapterId } from '@/lib/map/chapter-definitions'
import { isChapterUnlocked } from '@/lib/map/map-rules'
import { LessonSession } from '@/components/map/LessonSession'

type Props = { params: Promise<{ chapterId: string; nodeId: string }> }

export default async function LessonPage({ params }: Props) {
  const { chapterId, nodeId } = await params
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

  const node = chapter.nodes.find((n) => n.id === nodeId && n.type === 'lesson')
  if (!node) notFound()

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #05091a 0%, #080e20 100%)',
      fontFamily: 'var(--font-mono, monospace)',
      color: '#e6edf3',
    }}>
      <div style={{ maxWidth: 540, margin: '0 auto', padding: '32px 20px 80px' }}>

        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <Link
            href="/map"
            style={{ fontSize: 12, color: '#c49a3a', letterSpacing: '0.06em', textDecoration: 'none' }}
          >
            ← Map
          </Link>
          <h1 style={{ margin: '12px 0 4px', fontSize: 20, fontWeight: 700, color: '#e6edf3' }}>
            {node.title}
          </h1>
          <p style={{ margin: 0, fontSize: 12, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.06em' }}>
            {chapter.name} · {node.keyFocus}
          </p>
        </div>

        <LessonSession
          chapterId={chapterId as ChapterId}
          nodeId={nodeId}
          wordBank={node.wordBank}
          title={node.title}
        />
      </div>
    </div>
  )
}
