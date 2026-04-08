import Link from 'next/link'

import type { ChapterContent } from '@/lib/content/chapter-schema'
import type { PhaseId } from '@/lib/placement/phase-definitions'
import { isChapterUnlocked } from '@/lib/progression/chapter-progress'

type ChapterListProps = {
  chapters: ChapterContent[]
  completedChapterIds: string[]
  currentPhaseId: PhaseId | null
  recommendedChapterId: string | null
}

function getStatusLabel({
  chapterId,
  completedChapterIds,
  currentPhaseId,
  phaseId,
  recommendedChapterId,
}: {
  chapterId: string
  completedChapterIds: string[]
  currentPhaseId: PhaseId | null
  phaseId: PhaseId
  recommendedChapterId: string | null
}) {
  if (completedChapterIds.includes(chapterId)) {
    return { label: 'Completed', tone: 'success' as const }
  }
  if (!isChapterUnlocked(currentPhaseId, phaseId)) {
    return { label: 'Locked', tone: 'muted' as const }
  }
  if (recommendedChapterId === chapterId) {
    return { label: 'Recommended', tone: 'accent' as const }
  }
  return { label: 'Available', tone: 'neutral' as const }
}

const badgeStyles = {
  success: {
    background: 'rgba(58,114,48,0.12)',
    border: '1px solid rgba(58,114,48,0.20)',
    color: 'var(--kc-accent-on-surface)',
  },
  accent: {
    background: 'rgba(196,155,60,0.14)',
    border: '1px solid rgba(196,155,60,0.22)',
    color: '#8b6d1d',
  },
  neutral: {
    background: 'rgba(28,46,30,0.06)',
    border: '1px solid rgba(28,46,30,0.08)',
    color: 'var(--kc-on-surface-muted)',
  },
  muted: {
    background: 'rgba(154,142,124,0.12)',
    border: '1px solid rgba(154,142,124,0.18)',
    color: 'var(--kc-on-surface-faint)',
  },
}

export function ChapterList({
  chapters,
  completedChapterIds,
  currentPhaseId,
  recommendedChapterId,
}: ChapterListProps) {
  return (
    <section
      className="rounded-[var(--kc-radius-card)] border p-5"
      style={{ borderColor: 'var(--kc-line-light)', background: 'var(--kc-surface)' }}
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <p
            className="text-[10px] uppercase tracking-[0.2em]"
            style={{ color: 'var(--kc-on-surface-muted)' }}
          >
            Guided Chapters
          </p>
          <h2 className="mt-1 text-xl font-semibold" style={{ color: 'var(--kc-on-surface)' }}>
            Keep the village growing one route at a time
          </h2>
        </div>
      </div>

      <div className="mt-5 space-y-3">
        {chapters.map((chapter) => {
          const status = getStatusLabel({
            chapterId: chapter.id,
            completedChapterIds,
            currentPhaseId,
            phaseId: chapter.phaseId,
            recommendedChapterId,
          })
          const unlocked = status.label !== 'Locked'

          return (
            <article
              key={chapter.id}
              className="rounded-[var(--kc-radius-inner)] border px-4 py-4"
              style={{ borderColor: 'var(--kc-line-light)', background: 'rgba(255,255,255,0.55)' }}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold" style={{ color: 'var(--kc-on-surface-muted)' }}>
                    Chapter {chapter.order.toString().padStart(2, '0')}
                  </p>
                  {unlocked ? (
                    <Link
                      href={`/chapters/${chapter.id}`}
                      className="mt-1 inline-block text-lg font-semibold underline-offset-4 hover:underline"
                      style={{ color: 'var(--kc-on-surface)' }}
                    >
                      {chapter.title}
                    </Link>
                  ) : (
                    <p className="mt-1 text-lg font-semibold" style={{ color: 'var(--kc-on-surface)' }}>
                      {chapter.title}
                    </p>
                  )}
                  <p className="mt-2 text-sm leading-6" style={{ color: 'var(--kc-on-surface-muted)' }}>
                    {chapter.summary}
                  </p>
                </div>
                <span
                  className="shrink-0 rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em]"
                  style={badgeStyles[status.tone]}
                >
                  {status.label}
                </span>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
