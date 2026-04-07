import Link from 'next/link'

import { VillageScene } from '@/components/village/village-scene'

export default function AppHomePage() {
  return (
    <div className="relative flex h-screen flex-col overflow-hidden" style={{ background: '#0a0703' }}>
      {/* Village map — fills entire content column */}
      <div className="absolute inset-0">
        <VillageScene />
      </div>

      {/* Cinematic edge vignette */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 80% 70% at 50% 50%, transparent 35%, rgba(6,4,1,0.65) 68%, rgba(4,2,0,0.92) 100%)',
        }}
      />

      {/* Top bar */}
      <div className="relative z-10 flex items-center justify-between px-8 pt-6">
        <div>
          <p className="text-[10px] uppercase tracking-[0.28em]" style={{ color: 'var(--kc-warm)' }}>
            Chapter I
          </p>
          <h1
            className="mt-0.5 text-2xl font-semibold leading-tight tracking-tight text-white"
            style={{ textShadow: '0 2px 20px rgba(212,168,80,0.25)' }}
          >
            The Hamlet
          </h1>
        </div>

        {/* XP pill */}
        <div
          className="flex items-center gap-3 rounded-full px-4 py-2 text-sm"
          style={{
            background: 'rgba(10,7,3,0.75)',
            border: '1px solid rgba(212,168,80,0.2)',
            backdropFilter: 'blur(12px)',
          }}
        >
          <span style={{ color: 'var(--kc-gold)' }}>✦</span>
          <span className="text-[11px] uppercase tracking-[0.16em]" style={{ color: 'var(--kc-warm)' }}>
            0 XP
          </span>
          <span className="h-3 w-px" style={{ background: 'rgba(212,168,80,0.2)' }} />
          <span className="text-[11px] uppercase tracking-[0.16em]" style={{ color: 'var(--kc-muted)' }}>
            Apprentice
          </span>
        </div>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Bottom chapter panel */}
      <div className="relative z-10 flex justify-center pb-10">
        <div
          className="flex min-w-[300px] flex-col items-center gap-4 rounded-2xl px-10 py-7 text-center"
          style={{
            background: 'rgba(8,5,2,0.88)',
            border: '1px solid rgba(212,168,80,0.2)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 24px 64px rgba(0,0,0,0.65), inset 0 1px 0 rgba(245,200,66,0.07)',
          }}
        >
          <p
            className="text-[10px] uppercase tracking-[0.3em]"
            style={{ color: 'var(--kc-warm)' }}
          >
            Your next step
          </p>

          <h2
            className="text-[24px] font-semibold tracking-tight text-white"
            style={{ textShadow: '0 2px 18px rgba(212,168,80,0.15)' }}
          >
            Chapter I · Arrival
          </h2>

          <p className="max-w-[200px] text-[13px] leading-6" style={{ color: 'var(--kc-muted)' }}>
            A short placement session to find your level.
          </p>

          <Link
            href="/play"
            className="mt-1 inline-flex items-center justify-center rounded-full px-8 py-3 text-sm font-semibold text-white transition hover:opacity-90"
            style={{
              background: 'var(--kc-accent)',
              boxShadow: '0 4px 20px rgba(74,140,58,0.4)',
            }}
          >
            Start Your Harvest
          </Link>
        </div>
      </div>
    </div>
  )
}
