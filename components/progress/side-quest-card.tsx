import Link from 'next/link'

import type { SideQuestRecommendation } from '@/lib/progression/recommend-side-quest'

type SideQuestCardProps = {
  recommendation: SideQuestRecommendation | null
}

export function SideQuestCard({ recommendation }: SideQuestCardProps) {
  return (
    <section
      className="rounded-[var(--kc-radius-card)] border p-5"
      style={{ borderColor: 'var(--kc-line-light)', background: 'var(--kc-surface)' }}
    >
      <p
        className="text-[10px] uppercase tracking-[0.2em]"
        style={{ color: 'var(--kc-on-surface-muted)' }}
      >
        Adaptive Side Quest
      </p>

      {recommendation === null ? (
        <>
          <h2 className="mt-2 text-lg font-semibold" style={{ color: 'var(--kc-on-surface)' }}>
            No recovery quest needed right now
          </h2>
          <p className="mt-2 text-sm leading-6" style={{ color: 'var(--kc-on-surface-muted)' }}>
            Your recent sessions are steady enough to stay on the main chapter path.
          </p>
        </>
      ) : (
        <>
          <h2 className="mt-2 text-lg font-semibold" style={{ color: 'var(--kc-on-surface)' }}>
            {recommendation.title}
          </h2>
          <p className="mt-2 text-sm leading-6" style={{ color: 'var(--kc-on-surface-muted)' }}>
            {recommendation.reason}
          </p>
          <p className="mt-3 text-sm font-medium" style={{ color: 'var(--kc-accent-on-surface)' }}>
            {recommendation.skillFocus}
          </p>
          <Link
            href={`/chapters/${recommendation.chapterId}`}
            className="mt-4 inline-flex rounded-full px-4 py-2 text-sm font-medium text-white"
            style={{ background: 'var(--kc-accent)' }}
          >
            Open side quest
          </Link>
        </>
      )}
    </section>
  )
}
