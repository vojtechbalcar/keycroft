import Link from 'next/link'

import { VillageScene } from '@/components/village/village-scene'

export default function AppHomePage() {
  return (
    <>
      {/* Full-viewport map — escapes AppShell grid */}
      <div className="fixed inset-0 z-0 bg-[#ede3cc]">
        <VillageScene />
      </div>

      {/* HUD layer */}
      <div className="fixed inset-0 z-10 pointer-events-none">
        {/* Top-left: logo / world name */}
        <div className="absolute left-6 top-6 pointer-events-auto">
          <p className="text-[11px] uppercase tracking-[0.22em] text-[rgba(58,45,30,0.52)]">
            Keycroft
          </p>
          <h1 className="text-xl font-medium tracking-tight text-[rgba(58,45,30,0.88)]">
            The Village
          </h1>
        </div>

        {/* Top-right: minimal stats pill */}
        <div className="absolute right-6 top-6 flex items-center gap-3 pointer-events-auto">
          <div className="flex items-center gap-4 rounded-full border border-[rgba(58,45,30,0.14)] bg-[rgba(245,239,223,0.72)] px-4 py-2 backdrop-blur-sm">
            <span className="text-[11px] uppercase tracking-[0.16em] text-[rgba(58,45,30,0.44)]">
              WPM
            </span>
            <span className="text-sm text-[rgba(58,45,30,0.82)]">—</span>
            <span className="h-3 w-px bg-[rgba(58,45,30,0.16)]" />
            <span className="text-[11px] uppercase tracking-[0.16em] text-[rgba(58,45,30,0.44)]">
              Sessions
            </span>
            <span className="text-sm text-[rgba(58,45,30,0.82)]">0</span>
          </div>
        </div>

        {/* Bottom-center: chapter CTA panel */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 pointer-events-auto">
          <div className="flex flex-col items-center gap-4 rounded-[28px] border border-[rgba(58,45,30,0.12)] bg-[rgba(245,239,223,0.82)] px-10 py-7 text-center shadow-[0_24px_64px_rgba(58,45,30,0.18)] backdrop-blur-md">
            <p className="text-[11px] uppercase tracking-[0.2em] text-[rgba(58,45,30,0.48)]">
              Your next step
            </p>
            <h2 className="text-2xl tracking-tight text-[rgba(58,45,30,0.9)]">
              Chapter 1 · Arrival
            </h2>
            <p className="max-w-[240px] text-sm leading-6 text-[rgba(58,45,30,0.56)]">
              A short placement session to find your level.
            </p>
            <Link
              href="/play"
              className="mt-1 inline-flex items-center justify-center rounded-full bg-[var(--kc-accent)] px-6 py-3 text-sm font-medium text-white shadow-[0_4px_16px_rgba(94,116,72,0.35)] transition hover:bg-[var(--kc-accent-strong)]"
            >
              Begin the journey
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
