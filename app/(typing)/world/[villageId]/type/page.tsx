'use client'

import Link from 'next/link'
import { use, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'

import { desertMarket } from '@/content/villages/desert-market'
import { fishingDocks } from '@/content/villages/fishing-docks'
import { forestWatch } from '@/content/villages/forest-watch'
import type { VillageContent } from '@/content/villages/meadow-farm'
import { meadowFarm } from '@/content/villages/meadow-farm'
import { mountainMine } from '@/content/villages/mountain-mine'
import { volcanoForge } from '@/content/villages/volcano-forge'
import { buildVillageLessonGallery } from '@/lib/content/build-village-lesson-gallery'
import { readCompletedLessons } from '@/lib/storage/lesson-progress'
import { useResolvedProgress } from '@/lib/storage/use-resolved-progress'
import { villageDefinitions, type VillageId } from '@/lib/world/village-definitions'

const VILLAGE_CONTENT: Record<VillageId, VillageContent> = {
  'meadow-farm': meadowFarm,
  'fishing-docks': fishingDocks,
  'mountain-mine': mountainMine,
  'forest-watch': forestWatch,
  'desert-market': desertMarket,
  'volcano-forge': volcanoForge,
}

const BG      = '#0d1117'
const CARD    = '#161b22'
const BORDER  = '#21262d'
const TEXT    = '#e6edf3'
const MUTED   = '#7d8590'
const GOLD    = '#c49a3a'
const GREEN   = '#3fb950'

type Props = { params: Promise<{ villageId: string }> }

export default function LessonGalleryPage({ params }: Props) {
  const { villageId } = use(params)
  const router = useRouter()
  const { progress } = useResolvedProgress()
  const [completedIds, setCompletedIds] = useState<string[]>([])

  useEffect(() => {
    setCompletedIds(readCompletedLessons())
  }, [])

  useEffect(() => {
    if (progress === null) return
    if (progress.placement === null) router.replace('/onboarding')
  }, [progress, router])

  const definition = useMemo(
    () => villageDefinitions.find((v) => v.id === villageId),
    [villageId],
  )

  const lessons = useMemo(() => {
    if (!definition) return []
    const content = VILLAGE_CONTENT[villageId as VillageId]
    if (!content) return []
    return buildVillageLessonGallery(content, definition)
  }, [definition, villageId])

  if (!definition || !progress) {
    return (
      <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', background: BG }}>
        <p style={{ color: MUTED, fontFamily: 'var(--font-mono,monospace)', fontSize: '0.78rem' }}>Loading…</p>
      </div>
    )
  }

  const completedCount = lessons.filter((l) => completedIds.includes(l.id)).length
  const nextIndex = lessons.findIndex((l) => !completedIds.includes(l.id))

  // Group lessons by kind for section headers
  const sections: { title: string; lessons: typeof lessons }[] = []
  const kindOrder = ['foundation', 'authored', 'story', 'combo', 'capstone'] as const
  const kindLabel: Record<string, string> = {
    foundation: 'Foundation',
    authored: 'Village Lessons',
    story: 'Story Drills',
    combo: 'Full Home Row',
    capstone: 'Capstone',
  }
  for (const kind of kindOrder) {
    const group = lessons.filter((l) => l.kind === kind)
    if (group.length > 0) sections.push({ title: kindLabel[kind], lessons: group })
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: BG,
      fontFamily: 'var(--font-mono, monospace)',
      color: TEXT,
    }}>
      {/* ── Header ─────────────────────────────────────────────── */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 20,
        background: 'rgba(13,17,23,0.97)',
        borderBottom: `1px solid ${BORDER}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.7rem 1.5rem',
        backdropFilter: 'blur(8px)',
      }}>
        <Link href={`/world/${villageId}`} style={{
          color: MUTED,
          fontSize: '0.7rem',
          textDecoration: 'none',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
        }}>
          ← {definition.name}
        </Link>

        <div style={{
          fontFamily: 'var(--font-display, monospace)',
          fontSize: '1.1rem',
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          color: TEXT,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}>
          <span>{definition.emoji}</span>
          <span>Lessons</span>
        </div>

        <span style={{
          fontSize: '0.68rem',
          color: GOLD,
          letterSpacing: '0.1em',
        }}>
          {completedCount} / {lessons.length}
        </span>
      </header>

      {/* ── Progress bar ───────────────────────────────────────── */}
      <div style={{ height: 2, background: BORDER }}>
        <div style={{
          height: '100%',
          width: `${lessons.length > 0 ? (completedCount / lessons.length) * 100 : 0}%`,
          background: `linear-gradient(90deg, ${GOLD}, ${GREEN})`,
          transition: 'width 400ms ease',
        }} />
      </div>

      {/* ── Gallery ────────────────────────────────────────────── */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '2rem 1.5rem 4rem' }}>
        {sections.map(({ title, lessons: sectionLessons }) => (
          <div key={title} style={{ marginBottom: '2.5rem' }}>
            {/* Section header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              marginBottom: '1rem',
            }}>
              <span style={{
                fontSize: '0.6rem',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: MUTED,
              }}>
                {title}
              </span>
              <div style={{ flex: 1, height: 1, background: BORDER }} />
              <span style={{ fontSize: '0.6rem', color: MUTED }}>{sectionLessons.length}</span>
            </div>

            {/* Card grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
              gap: '0.75rem',
            }}>
              {sectionLessons.map((lesson) => {
                const isCompleted = completedIds.includes(lesson.id)
                const isNext = lesson.order - 1 === nextIndex

                return (
                  <LessonCard
                    key={lesson.id}
                    href={`/world/${villageId}/type/${lesson.id}`}
                    number={lesson.order}
                    title={lesson.label}
                    keys={lesson.keyFocus}
                    isCompleted={isCompleted}
                    isNext={isNext}
                  />
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function LessonCard({
  href,
  number,
  title,
  keys,
  isCompleted,
  isNext,
}: {
  href: string
  number: number
  title: string
  keys: string[]
  isCompleted: boolean
  isNext: boolean
}) {
  const [hovered, setHovered] = useState(false)

  const borderColor = isNext
    ? GOLD
    : isCompleted
      ? 'rgba(63,185,80,0.35)'
      : hovered
        ? '#30363d'
        : BORDER

  const bgColor = isNext
    ? 'rgba(196,154,58,0.07)'
    : isCompleted
      ? 'rgba(63,185,80,0.05)'
      : hovered
        ? 'rgba(255,255,255,0.03)'
        : CARD

  const numberColor = isNext ? GOLD : isCompleted ? GREEN : MUTED

  return (
    <Link
      href={href}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        padding: '0.9rem',
        background: bgColor,
        border: `1px solid ${borderColor}`,
        borderRadius: 6,
        textDecoration: 'none',
        cursor: 'pointer',
        transition: 'all 150ms ease',
        transform: hovered ? 'translateY(-1px)' : 'none',
        boxShadow: isNext
          ? '0 4px 20px rgba(196,154,58,0.18)'
          : hovered
            ? '0 4px 16px rgba(0,0,0,0.3)'
            : 'none',
        minHeight: 130,
        position: 'relative',
      }}
    >
      {/* Number */}
      <div style={{
        fontFamily: 'var(--font-display, monospace)',
        fontSize: '2rem',
        lineHeight: 1,
        color: numberColor,
        letterSpacing: '0.02em',
      }}>
        {number}
      </div>

      {/* Status badge */}
      <div style={{ position: 'absolute', top: '0.9rem', right: '0.9rem' }}>
        {isCompleted ? (
          <div style={{
            width: 20, height: 20,
            borderRadius: '50%',
            background: 'rgba(63,185,80,0.15)',
            border: `1px solid rgba(63,185,80,0.4)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.6rem',
            color: GREEN,
          }}>
            ✓
          </div>
        ) : isNext ? (
          <div style={{
            width: 20, height: 20,
            borderRadius: '50%',
            background: 'rgba(196,154,58,0.15)',
            border: `1px solid rgba(196,154,58,0.5)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.5rem',
            color: GOLD,
          }}>
            →
          </div>
        ) : null}
      </div>

      {/* Key badges */}
      {keys.length > 0 && (
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 3,
          margin: 'auto 0 0.5rem',
        }}>
          {keys.slice(0, 4).map((k) => (
            <div key={k} style={{
              padding: '1px 5px',
              background: isNext ? 'rgba(196,154,58,0.12)' : 'rgba(255,255,255,0.05)',
              border: `1px solid ${isNext ? 'rgba(196,154,58,0.3)' : BORDER}`,
              borderRadius: 3,
              fontSize: '0.55rem',
              fontWeight: 700,
              color: isNext ? GOLD : MUTED,
              letterSpacing: '0.06em',
            }}>
              {k.toUpperCase()}
            </div>
          ))}
          {keys.length > 4 && (
            <div style={{ fontSize: '0.55rem', color: MUTED, alignSelf: 'center' }}>
              +{keys.length - 4}
            </div>
          )}
        </div>
      )}

      {/* Title */}
      <div style={{
        fontSize: '0.68rem',
        color: isNext ? TEXT : isCompleted ? 'rgba(230,237,243,0.7)' : MUTED,
        letterSpacing: '0.04em',
        lineHeight: 1.4,
        marginTop: 2,
      }}>
        {title}
      </div>
    </Link>
  )
}
