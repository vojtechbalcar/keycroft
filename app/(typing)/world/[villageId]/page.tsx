'use client'

import Link from 'next/link'
import { use, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { villageDefinitions, type VillageId } from '@/lib/world/village-definitions'
import { useResolvedProgress } from '@/lib/storage/use-resolved-progress'
import { projectWorld } from '@/lib/world/project-world'

const TEXT  = '#e6edf3'
const MUTED = '#7d8590'
const GOLD  = '#c49a3a'
const BG    = '#0d1117'

type Props = { params: Promise<{ villageId: string }> }

export default function VillageLandingPage({ params }: Props) {
  const { villageId } = use(params)
  const router = useRouter()
  const { progress } = useResolvedProgress()

  useEffect(() => {
    if (progress === null) return
    if (progress.placement === null) router.replace('/onboarding')
  }, [progress, router])

  const definition = useMemo(
    () => villageDefinitions.find((v) => v.id === villageId),
    [villageId],
  )

  if (!definition) {
    return (
      <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', background: BG }}>
        <p style={{ color: MUTED, fontFamily: 'var(--font-mono,monospace)' }}>Village not found.</p>
      </div>
    )
  }

  if (!progress) {
    return (
      <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', background: BG }}>
        <p style={{ color: MUTED, fontFamily: 'var(--font-mono,monospace)' }}>Loading…</p>
      </div>
    )
  }

  const worldState   = projectWorld(progress)
  const projection   = worldState.villages.find((v) => v.definition.id === villageId)
  const mastery      = projection?.mastery ?? 0
  const isLocked     = projection?.state === 'locked'

  return (
    <div style={{
      position: 'relative',
      height: '100vh',
      width: '100%',
      overflow: 'hidden',
      fontFamily: 'var(--font-mono, monospace)',
      backgroundImage: 'url(/images/village-image.png)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundColor: '#1a1008',
    }}>

      {/* Dark gradient overlay — heavier at top & bottom, lighter in middle */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.35) 40%, rgba(0,0,0,0.55) 70%, rgba(0,0,0,0.85) 100%)',
        pointerEvents: 'none',
      }} />

      {/* ── Back link ──────────────────────────────────────────── */}
      <div style={{ position: 'absolute', top: '1.25rem', left: '1.5rem', zIndex: 10 }}>
        <Link href="/world" style={{
          color: 'rgba(230,237,243,0.7)',
          fontSize: '0.72rem',
          textDecoration: 'none',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
        }}>
          ← Back to Map
        </Link>
      </div>

      {/* ── Center content ─────────────────────────────────────── */}
      <div style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingBottom: '4rem',
        zIndex: 10,
      }}>

        {/* Village info card */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.75rem',
          textAlign: 'center',
          maxWidth: 480,
          width: '100%',
          padding: '0 1.5rem',
        }}>

          {/* Emoji */}
          <div style={{ fontSize: '3rem', lineHeight: 1, marginBottom: '0.25rem' }}>
            {isLocked ? '🔒' : definition.emoji}
          </div>

          {/* Village name */}
          <h1 style={{
            fontFamily: 'var(--font-display, monospace)',
            fontSize: 'clamp(2.8rem, 7vw, 4.5rem)',
            color: TEXT,
            margin: 0,
            lineHeight: 1,
            letterSpacing: '0.06em',
            textShadow: '0 2px 20px rgba(0,0,0,0.8)',
          }}>
            {definition.name}
          </h1>

          {/* Tagline */}
          <p style={{
            fontSize: '0.78rem',
            color: 'rgba(230,237,243,0.65)',
            margin: 0,
            letterSpacing: '0.08em',
            lineHeight: 1.7,
          }}>
            {definition.tagline}
          </p>

          {/* Key focus */}
          {!isLocked && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              marginTop: '0.25rem',
            }}>
              <span style={{ fontSize: '0.6rem', color: MUTED, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                Keys:
              </span>
              <div style={{ display: 'flex', gap: 4 }}>
                {definition.keyFocus.map((k) => (
                  <div key={k} style={{
                    width: 24,
                    height: 24,
                    borderRadius: 3,
                    border: `1px solid rgba(196,154,58,0.5)`,
                    background: 'rgba(196,154,58,0.12)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.6rem',
                    fontWeight: 700,
                    color: GOLD,
                    letterSpacing: '0.06em',
                  }}>
                    {k.toUpperCase()}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Mastery bar */}
          {!isLocked && (
            <div style={{ width: '100%', marginTop: '0.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                <span style={{ fontSize: '0.58rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: MUTED }}>
                  Mastery
                </span>
                <span style={{ fontSize: '0.58rem', color: GOLD }}>{mastery}%</span>
              </div>
              <div style={{ height: 3, background: 'rgba(255,255,255,0.12)', borderRadius: 2, overflow: 'hidden' }}>
                <div style={{
                  height: '100%',
                  width: `${mastery}%`,
                  background: mastery > 0 ? '#3fb950' : 'transparent',
                  borderRadius: 2,
                  transition: 'width 300ms ease',
                }} />
              </div>
            </div>
          )}

          {/* CTA button */}
          {isLocked ? (
            <div style={{
              marginTop: '1rem',
              padding: '0.7rem 2rem',
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 4,
              fontSize: '0.72rem',
              color: MUTED,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
            }}>
              🔒 Complete previous village to unlock
            </div>
          ) : (
            <Link
              href={`/world/${villageId}/type`}
              style={{
                marginTop: '1rem',
                display: 'inline-block',
                padding: '0.85rem 2.5rem',
                background: GOLD,
                color: BG,
                fontSize: '0.78rem',
                fontWeight: 700,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                textDecoration: 'none',
                borderRadius: 4,
                boxShadow: '0 4px 24px rgba(196,154,58,0.35)',
              }}
            >
              Start Typing →
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
