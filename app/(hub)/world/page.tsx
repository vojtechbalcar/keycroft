'use client'

import Link from 'next/link'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { WorldMap } from '@/components/world/world-map'
import { useResolvedProgress } from '@/lib/storage/use-resolved-progress'
import { projectWorld } from '@/lib/world/project-world'
import { getVillageDefinition } from '@/lib/world/village-definitions'

export default function WorldPage() {
  const router = useRouter()
  const { progress } = useResolvedProgress()

  useEffect(() => {
    if (progress === null) return
    if (progress.placement === null) {
      router.replace('/onboarding')
    }
  }, [progress, router])

  if (!progress) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p style={{ color: 'var(--kc-muted)' }}>Loading your world…</p>
      </div>
    )
  }

  const worldState = projectWorld(progress)
  const currentDef = getVillageDefinition(worldState.currentVillageId)

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        background: 'var(--kc-background)',
      }}
    >
      {/* Header */}
      <header
        style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid var(--kc-line)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0,
        }}
      >
        <div>
          <p
            style={{
              fontSize: '0.65rem',
              textTransform: 'uppercase',
              letterSpacing: '0.2em',
              color: 'var(--kc-muted)',
              marginBottom: 4,
            }}
          >
            World Map
          </p>
          <h1 style={{ color: '#f4efe4', fontWeight: 700, fontSize: '1.25rem', margin: 0 }}>
            The Keycroft World
          </h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              background: 'rgba(245,200,66,0.1)',
              border: '1px solid rgba(245,200,66,0.3)',
              borderRadius: 8,
              padding: '6px 12px',
              fontSize: '0.75rem',
              color: '#f5c842',
            }}
          >
            {worldState.totalMastery}% world mastery
          </div>
        </div>
      </header>

      {/* Map */}
      <div style={{ flex: 1, padding: '1.5rem', minHeight: 0 }}>
        <WorldMap worldState={worldState} />
      </div>

      {/* Bottom bar — current village CTA */}
      <div
        style={{
          padding: '1rem 1.5rem',
          borderTop: '1px solid var(--kc-line)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(0,0,0,0.2)',
          flexShrink: 0,
        }}
      >
        <div>
          <p style={{ color: 'var(--kc-muted)', fontSize: '0.7rem', margin: 0, marginBottom: 2 }}>
            Current destination
          </p>
          <p style={{ color: '#f4efe4', fontWeight: 700, margin: 0 }}>
            {currentDef.emoji} {currentDef.name}
          </p>
          <p style={{ color: 'var(--kc-muted)', fontSize: '0.75rem', margin: 0, marginTop: 2 }}>
            {currentDef.tagline}
          </p>
        </div>
        <Link
          href={`/world/${worldState.currentVillageId}`}
          style={{
            background: 'var(--kc-accent)',
            color: '#fff',
            fontWeight: 700,
            padding: '0.6rem 1.5rem',
            borderRadius: 8,
            textDecoration: 'none',
            fontSize: '0.9rem',
          }}
        >
          Enter village →
        </Link>
      </div>
    </div>
  )
}
