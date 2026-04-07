import Link from 'next/link'

import { VillageScene } from '@/components/village/village-scene'

export default function AppHomePage() {
  return (
    <>
      {/* Full-viewport map — covers AppShell entirely */}
      <div className="fixed inset-0 z-40 bg-[#0a0703]">
        <VillageScene />
      </div>

      {/* Cinematic vignette ring */}
      <div
        aria-hidden
        className="fixed inset-0 z-[41] pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 75% 75% at 50% 52%, transparent 38%, rgba(8,5,2,0.72) 72%, rgba(5,3,1,0.95) 100%)',
        }}
      />

      {/* HUD layer */}
      <div className="fixed inset-0 z-50 pointer-events-none">

        {/* Top-left: title */}
        <div className="absolute left-8 top-8 pointer-events-auto select-none">
          <p className="text-[10px] uppercase tracking-[0.32em] text-[var(--kc-warm)]">
            Keycroft
          </p>
          <h1
            className="mt-0.5 text-[28px] font-medium leading-none tracking-tight text-[var(--kc-text)]"
            style={{ textShadow: '0 2px 24px rgba(212,168,80,0.28)' }}
          >
            The Village
          </h1>
        </div>

        {/* Top-right: stats chip */}
        <div className="absolute right-8 top-8 pointer-events-auto">
          <div className="flex items-center gap-3.5 rounded-full border border-[rgba(212,168,80,0.18)] bg-[rgba(12,9,4,0.76)] px-5 py-2.5 backdrop-blur-md">
            <span className="text-[10px] uppercase tracking-[0.2em] text-[var(--kc-muted)]">
              WPM
            </span>
            <span className="text-sm text-[var(--kc-text)]">—</span>
            <span className="h-3 w-px bg-[rgba(212,168,80,0.2)]" />
            <span className="text-[10px] uppercase tracking-[0.2em] text-[var(--kc-muted)]">
              Sessions
            </span>
            <span className="text-sm text-[var(--kc-text)]">0</span>
          </div>
        </div>

        {/* Bottom-center: chapter panel */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 pointer-events-auto">
          <div
            className="flex min-w-[320px] flex-col items-center gap-4 rounded-[18px] border border-[rgba(212,168,80,0.22)] bg-[rgba(10,7,3,0.88)] px-12 py-8 text-center backdrop-blur-xl"
            style={{ boxShadow: '0 32px 80px rgba(0,0,0,0.7), inset 0 1px 0 rgba(245,200,66,0.08)' }}
          >
            <p className="text-[10px] uppercase tracking-[0.32em] text-[var(--kc-warm)]">
              Your next step
            </p>
            <h2
              className="text-[26px] font-medium tracking-tight text-[var(--kc-text)]"
              style={{ textShadow: '0 2px 20px rgba(212,168,80,0.18)' }}
            >
              Chapter I · Arrival
            </h2>
            <p className="max-w-[210px] text-sm leading-6 text-[var(--kc-muted)]">
              A short placement session to find your level.
            </p>
            <Link
              href="/play"
              className="mt-2 inline-flex items-center justify-center rounded-full bg-[var(--kc-accent)] px-8 py-3.5 text-sm font-medium tracking-wide text-[#0f0a05] transition hover:bg-[var(--kc-accent-strong)]"
              style={{ boxShadow: '0 4px 24px rgba(150,186,94,0.38)' }}
            >
              Begin the journey
            </Link>
          </div>
        </div>

      </div>
    </>
  )
}
