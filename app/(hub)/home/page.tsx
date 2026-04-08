import Link from 'next/link'

import { AppShell } from '@/components/layout/app-shell'

const buildings = [
  { name: 'Windmill', x: '52%', y: '28%', icon: '☘' },
  { name: 'Cottage Lvl 4', x: '38%', y: '42%', icon: '🏠' },
  { name: 'Grand Market', x: '62%', y: '58%', icon: '🏪' },
]

export default function HubHomePage() {
  return (
    <AppShell>
      <div className="flex flex-col">
        {/* ── Top nav bar ── */}
        <header
          className="flex items-center justify-between px-6 py-3"
          style={{
            background: 'rgba(255,250,240,0.95)',
            borderBottom: '1px solid #d8cfbc',
          }}
        >
          <h1
            className="text-lg font-bold italic"
            style={{ color: '#1c2e1e' }}
          >
            The Digital Homestead
          </h1>
          <div className="flex items-center gap-3">
            {[
              { icon: '🪙', value: '1,240', label: '' },
              { icon: '🌲', value: '84', label: '' },
              { icon: '🏅', value: 'Rank 3', label: '' },
            ].map((r) => (
              <div
                key={r.value}
                className="flex items-center gap-1.5 rounded-lg px-3 py-1.5"
                style={{
                  background: '#faf7f0',
                  border: '1px solid #d8cfbc',
                }}
              >
                <span>{r.icon}</span>
                <span
                  className="text-sm font-bold"
                  style={{ color: '#1c2e1e' }}
                >
                  {r.value}
                </span>
              </div>
            ))}
          </div>
        </header>

        {/* ── Village scene ── */}
        <div className="relative">
          <div
            className="relative h-[420px] w-full"
            style={{
              backgroundImage: 'url(/village-bg.png)',
              backgroundSize: 'cover',
              backgroundPosition: 'center 30%',
            }}
          >
            {/* Building labels */}
            {buildings.map((b) => (
              <div
                key={b.name}
                className="absolute flex items-center gap-1.5 rounded-md px-2.5 py-1"
                style={{
                  left: b.x,
                  top: b.y,
                  transform: 'translate(-50%, -50%)',
                  background: 'rgba(20,30,20,0.82)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  backdropFilter: 'blur(4px)',
                }}
              >
                <span className="text-xs">{b.icon}</span>
                <span className="text-xs font-semibold text-white">
                  {b.name}
                </span>
              </div>
            ))}

            {/* Active task card */}
            <div
              className="absolute right-4 top-4 w-[220px] rounded-xl p-4"
              style={{
                background: 'rgba(255,250,240,0.94)',
                border: '1px solid #d8cfbc',
                boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
              }}
            >
              <div className="flex items-center justify-between">
                <p
                  className="text-[9px] uppercase tracking-[0.2em]"
                  style={{ color: '#d4a850' }}
                >
                  Active Task
                </p>
                <span style={{ color: '#d4a850' }}>!</span>
              </div>
              <p
                className="mt-2 text-sm font-bold leading-snug"
                style={{ color: '#1c2e1e' }}
              >
                Gather 100 Wood for the Winter Solstice Bonfire
              </p>
              <div className="mt-3">
                <div className="flex items-baseline justify-between">
                  <span
                    className="text-xs"
                    style={{ color: '#6a7a5e' }}
                  >
                    84/100
                  </span>
                </div>
                <div
                  className="mt-1 h-2 overflow-hidden rounded-full"
                  style={{ background: '#d8cfbc' }}
                >
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: '84%',
                      background: '#4a8c3a',
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Bottom panel ── */}
        <div
          className="grid grid-cols-[1fr_1fr_auto] gap-4 px-6 py-5"
          style={{ background: '#f4efe4' }}
        >
          {/* Village Status */}
          <div
            className="rounded-xl p-5"
            style={{
              background: '#faf7f0',
              border: '1px solid #d8cfbc',
            }}
          >
            <div className="flex items-center gap-2">
              <span>🏘</span>
              <h3
                className="text-xs font-bold uppercase tracking-[0.18em]"
                style={{ color: '#4a8c3a' }}
              >
                Village Status
              </h3>
            </div>
            <dl className="mt-4 space-y-3">
              {[
                { label: 'Population', value: '42 Residents' },
                { label: 'Happiness', value: 'Joyful (88%)' },
                { label: 'Tax Rate', value: '12% / Day' },
              ].map((s) => (
                <div
                  key={s.label}
                  className="flex items-baseline justify-between"
                >
                  <dt
                    className="text-xs"
                    style={{ color: '#6a7a5e' }}
                  >
                    {s.label}
                  </dt>
                  <dd
                    className="text-sm font-bold"
                    style={{ color: '#1c2e1e' }}
                  >
                    {s.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Queued */}
          <div
            className="rounded-xl p-5"
            style={{
              background: '#faf7f0',
              border: '1px solid #d8cfbc',
            }}
          >
            <div className="flex items-center gap-2">
              <span>⚒</span>
              <h3
                className="text-xs font-bold uppercase tracking-[0.18em]"
                style={{ color: '#6a7a5e' }}
              >
                Queued
              </h3>
            </div>
            <div className="mt-4 flex items-center gap-3">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-lg text-xl"
                style={{
                  background: '#e8f0e4',
                  border: '1px solid #d8cfbc',
                }}
              >
                💧
              </div>
              <div>
                <p
                  className="text-[9px] uppercase tracking-[0.18em]"
                  style={{ color: '#8a7a5a' }}
                >
                  Upgrading
                </p>
                <p
                  className="text-sm font-bold"
                  style={{ color: '#1c2e1e' }}
                >
                  Well House
                </p>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col gap-3">
            <Link
              href="/play"
              className="flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-bold uppercase tracking-wider text-white transition hover:opacity-90"
              style={{ background: '#4a8c3a' }}
            >
              <span>🏗</span>
              Construct
            </Link>
            <button
              className="flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-bold uppercase tracking-wider transition hover:opacity-90"
              style={{
                background: '#f0c878',
                color: '#1c2e1e',
              }}
            >
              <span>🔍</span>
              Inspect
            </button>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
