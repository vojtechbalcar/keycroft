import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { getSessionUser } from '@/lib/auth/get-session-user'
import { readRpgProgress } from '@/lib/storage/rpg-progress'
import { getChapterDefinition, type ChapterId } from '@/lib/map/chapter-definitions'
import { isChapterUnlocked } from '@/lib/map/map-rules'
import { LessonPad } from '@/components/map/LessonPad'
import type { PracticeText } from '@/lib/typing/practice-texts'

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
  if (!isChapterUnlocked(chapter.buildingUnlockKey, progress.buildingLevels)) redirect('/map')

  const node = chapter.nodes.find((n) => n.id === nodeId && n.type === 'lesson')
  if (!node) notFound()

  // Build a PracticeText from the lesson's word bank
  const prompt: PracticeText = {
    id: node.id,
    label: node.title,
    focus: node.keyFocus,
    text: [...node.wordBank, ...node.wordBank].slice(0, 20).join(' '),
  }

  // Parse keyFocus into individual keys for the keyboard visualizer
  const keyFocusParsed = node.keyFocus
    .toLowerCase()
    .split(/[\s+,]+/)
    .filter((k) => k.length === 1)

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #05091a 0%, #080e20 100%)',
      fontFamily: 'var(--font-mono, monospace)',
      color: '#e6edf3',
    }}>
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '28px 20px 60px' }}>
        <div style={{ marginBottom: 20 }}>
          <Link href="/map" style={{ fontSize: 12, color: '#c49a3a', letterSpacing: '0.06em', textDecoration: 'none' }}>
            ← Map
          </Link>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginTop: 10 }}>
            <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: '#e6edf3' }}>
              {node.title}
            </h1>
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.06em' }}>
              {chapter.name} · {node.keyFocus}
            </span>
          </div>
        </div>

        <LessonPad
          chapterId={chapterId as ChapterId}
          nodeId={nodeId}
          prompt={prompt}
          keyFocusParsed={keyFocusParsed}
        />
      </div>
    </div>
  )
}
