'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

import { AppShell } from '@/components/layout/app-shell'
import { getPhaseDefinition } from '@/lib/placement/phase-definitions'
import { readGuestProgress, type GuestProgress } from '@/lib/storage/guest-progress'
import { ensureGuestProfile } from '@/lib/storage/guest-profile'

const buildings = [
  { name: 'Windmill', x: '52%', y: '28%', icon: '☘' },
  { name: 'Cottage Lvl 4', x: '38%', y: '42%', icon: '🏠' },
  { name: 'Grand Market', x: '62%', y: '58%', icon: '🏪' },
]

export default function HubHomePage() {
  const router = useRouter()
  const [progress, setProgress] = useState<GuestProgress | null>(null)

  useEffect(() => {
    const storage = window.localStorage
    ensureGuestProfile(storage)
    const stored = readGuestProgress(storage)
    if (stored.placement === null) {
      router.replace('/onboarding')
      return
    }
    setProgress(stored)
  }, [router])

  if (!progress) {
    return (
      <AppShell>
        <div className="flex h-screen items-center justify-center">
          <p style={{ color: 'var(--kc-muted)' }}>Loading your village...</p>
        </div>
      </AppShell>
    )
  }

  const phase = getPhaseDefinition(progress.currentPhaseId ?? 'lantern')

  return (
    <AppShell>
      <div className="flex flex-col">
        {/* Top nav bar */}
        <header
          className="flex items-center justify-between px-6 py-3"
          style={{ background: 'rgba(255,250,240,0.95)', borderBottom: '1px solid #d8cfbc' }}
        >
          <h1 className="text-lg font-bold italic" style={{ color: '#1c2e1e' }}>
            The Digital Homestead
          </h1>
          <div className="flex items-center gap-3">
            {[
              { icon: '🪙', value: '1,240' },
              { icon: '🌲', value: '84' },
              { icon: '🏅', value: 'Rank 3' },
            ].map((r) => (
              <div
                key={r.value}
                className="flex items-center gap-1.5 rounded-lg px-3 py-1.5"
                style={{ background: '#faf7f0', border: '1px solid #d8cfbc' }}
              >
                <span>{r.icon}</span>
                <span className="text-sm font-bold" style={{ color: '#1c2e1e' }}>{r.value}</span>
              </div>
            ))}
          </div>
        </header>

        {/* Village scene */}
        <div className="relative">
          <div
            className="relative h-[360px] w-full"
            style={{ backgroundImage: 'url(/village-bg.png)', backgroundSize: 'cover', backgroundPosition: 'center 30%', background: '#1e3d22' }}
          >
            {buildings.map((b) => (
              <div
                key={b.name}
                className="absolute flex items-center gap-1.5 rounded-md px-2.5 py-1"
                style={{ left: b.x, top: b.y, transform: 'translate(-50%, -50%)', background: 'rgba(20,30,20,0.82)', border: '1px solid rgba(255,255,255,0.15)', backdropFilter: 'blur(4px)' }}
              >
                <span className="text-xs">{b.icon}</span>
                <span className="text-xs font-semibold text-white">{b.name}</span>
              </div>
            ))}

            {/* Phase card */}
            <div
              className="absolute right-4 top-4 w-[230px] rounded-xl p-4"
              style={{ background: 'rgba(255,250,240,0.94)', border: '1px solid #d8cfbc', boxShadow: '0 8px 24px rgba(0,0,0,0.12)' }}
            >
              <p className="text-[9px] uppercase tracking-[0.2em]" style={{ color: '#d4a850' }}>Current path</p>
              <p className="mt-1 text-sm font-bold leading-snug" style={{ color: '#1c2e1e' }}>{phase.name}</p>
              <p className="mt-1 text-xs leading-4" style={{ color: '#6a7a5e' }}>{phase.recommendedFocus}</p>
            </div>
          </div>
        </div>

        {/* Bottom panel */}
        <div className="grid grid-cols-[1fr_1fr_auto] gap-4 px-6 py-5" style={{ background: '#f4efe4' }}>
          {/* Village Status */}
          <div className="rounded-xl p-5" style={{ background: '#faf7f0', border: '1px solid #d8cfbc' }}>
            <div className="flex items-center gap-2">
              <span>🏘</span>
              <h3 className="text-xs font-bold uppercase tracking-[0.18em]" style={{ color: '#4a8c3a' }}>Village Status</h3>
            </div>
            <dl className="mt-4 space-y-3">
              {[
                { label: 'Population', value: '42 Residents' },
                { label: 'Happiness', value: 'Joyful (88%)' },
                { label: 'Tax Rate', value: '12% / Day' },
              ].map((s) => (
                <div key={s.label} className="flex items-baseline justify-between">
                  <dt className="text-xs" style={{ color: '#6a7a5e' }}>{s.label}</dt>
                  <dd className="text-sm font-bold" style={{ color: '#1c2e1e' }}>{s.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Recent sessions */}
          <div className="rounded-xl p-5" style={{ background: '#faf7f0', border: '1px solid #d8cfbc' }}>
            <div className="flex items-center gap-2">
              <span>📜</span>
              <h3 className="text-xs font-bold uppercase tracking-[0.18em]" style={{ color: '#6a7a5e' }}>Recent History</h3>
            </div>
            {progress.recentSessions.length === 0 ? (
              <p className="mt-3 text-xs" style={{ color: '#8a7a5a' }}>No sessions yet. Finish a practice line first.</p>
            ) : (
              <ul className="mt-3 space-y-2">
                {progress.recentSessions.slice(0, 3).map((s) => (
                  <li key={s.completedAt} className="text-xs" style={{ color: '#1c2e1e' }}>
                    {s.wpm} WPM · {s.accuracy}%
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3">
            <Link
              href="/play"
              className="flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-bold uppercase tracking-wider text-white transition hover:opacity-90"
              style={{ background: '#4a8c3a' }}
            >
              <span>🏗</span> Construct
            </Link>
            <button
              className="flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-bold uppercase tracking-wider transition hover:opacity-90"
              style={{ background: '#f0c878', color: '#1c2e1e' }}
            >
              <span>🔍</span> Inspect
            </button>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
