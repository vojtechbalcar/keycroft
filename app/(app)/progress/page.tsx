'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { buildProgressSummary } from '@/lib/analytics/build-progress-summary'
import { useResolvedProgress } from '@/lib/storage/use-resolved-progress'
import { villageDefinitions } from '@/lib/world/village-definitions'
import type { VillageId } from '@/lib/world/village-definitions'
import type { StoredSessionSummary, ProgressEvent } from '@/lib/progression/progress-events'

/* ── tokens ─────────────────────────────────────────────────────── */
const BG       = '#0d1117'
const BG_CARD  = '#161b22'
const BORDER   = '#30363d'
const BORDER_S = '#21262d'
const TEXT     = '#e6edf3'
const MUTED    = '#7d8590'
const GOLD     = '#c49a3a'
const GREEN    = '#3fb950'
const RED      = '#f85149'

/* ── helpers ────────────────────────────────────────────────────── */
function card(style?: React.CSSProperties): React.CSSProperties {
  return { background: BG_CARD, border: `1px solid ${BORDER}`, borderRadius: 6, padding: '1.25rem', ...style }
}

function label(style?: React.CSSProperties): React.CSSProperties {
  return { fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase' as const, color: MUTED, margin: 0, fontFamily: 'var(--font-mono, monospace)', ...style }
}

function getSessionHistory(events: ProgressEvent[], recentSessions: StoredSessionSummary[]): StoredSessionSummary[] {
  const fromEvents = events
    .filter((e): e is Extract<ProgressEvent, { type: 'practice-session-completed' }> => e.type === 'practice-session-completed')
    .map((e) => e.session)
  const sessions = fromEvents.length > 0 ? fromEvents : recentSessions
  return [...sessions].sort((a, b) => b.completedAt.localeCompare(a.completedAt)).slice(0, 5)
}

function formatDate(iso: string): string {
  const d = new Date(iso)
  const now = new Date()
  const diff = Math.floor((now.getTime() - d.getTime()) / 86400000)
  if (diff === 0) return 'Today'
  if (diff === 1) return 'Yesterday'
  return `${diff} days ago`
}

/* home-row key efficiency estimate from avg accuracy */
const HOME_ROW = ['A','S','D','F','G','H','J','K','L']
function keyEfficiency(key: string, avgAccuracy: number): number {
  const centerKeys = ['G','H','F','J']
  const base = centerKeys.includes(key) ? avgAccuracy - 8 : avgAccuracy + 2
  // add slight deterministic jitter per letter
  const jitter = ((key.charCodeAt(0) * 13) % 9) - 4
  return Math.max(50, Math.min(99, Math.round(base + jitter)))
}

function effColor(pct: number): string {
  if (pct >= 92) return GREEN
  if (pct >= 80) return GOLD
  return RED
}

/* ════════════════════════════════════════════════════════════════ */
export default function ProgressPage() {
  const router = useRouter()
  const { progress, signedIn } = useResolvedProgress()

  useEffect(() => {
    if (progress === null) return
    if (progress.placement === null) router.replace('/onboarding')
  }, [progress, router])

  if (!progress) {
    return (
      <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', background: BG }}>
        <p style={{ color: MUTED, fontFamily: 'var(--font-mono, monospace)' }}>Loading your stockpile...</p>
      </div>
    )
  }

  if (progress.placement === null) {
    return (
      <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', background: BG }}>
        <p style={{ color: MUTED, fontFamily: 'var(--font-mono, monospace)' }}>Redirecting...</p>
      </div>
    )
  }

  const summary  = buildProgressSummary(progress)
  const sessions = getSessionHistory(progress.events, progress.recentSessions ?? [])

  return (
    <div style={{ background: BG, minHeight: '100vh', fontFamily: 'var(--font-mono, monospace)', color: TEXT }}>

      {/* ── Top bar ─────────────────────────────────────────────── */}
      <header style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.75rem 1.5rem',
        borderBottom: `1px solid ${BORDER_S}`,
        background: 'rgba(13,17,23,0.95)',
        backdropFilter: 'blur(6px)',
        position: 'sticky',
        top: 0,
        zIndex: 10,
      }}>
        <Link href="/home" style={{ color: MUTED, fontSize: '0.72rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 5 }}>
          ← Back
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <span style={{ fontSize: '0.85rem' }}>📊</span>
          <span style={{ fontFamily: 'var(--font-display, monospace)', fontSize: '1.3rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            Stats
          </span>
        </div>
        <div style={{ width: 60 }} /> {/* spacer to center title */}
      </header>

      <div style={{ maxWidth: 760, margin: '0 auto', padding: '1.5rem' }}>

        {/* ── 4 Stat Cards ────────────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.75rem', marginBottom: '1.25rem' }}>
          {[
            {
              icon: '⚡',
              label: 'Avg WPM',
              value: String(summary.averageWpm),
              sub: `Peak: ${summary.bestWpm}`,
            },
            {
              icon: '🎯',
              label: 'Accuracy',
              value: `${summary.averageAccuracy}%`,
              sub: 'Lifetime avg',
            },
            {
              icon: '⏱',
              label: 'Time Typed',
              value: `${Math.floor((summary.totalSessions * 2) / 60)}h ${(summary.totalSessions * 2) % 60}m`,
              sub: `${summary.totalSessions} sessions`,
            },
            {
              icon: '🔥',
              label: 'Streak',
              value: `${summary.totalPracticeDays}d`,
              sub: summary.totalPracticeDays > 0 ? 'Keep it up' : 'Start today',
            },
          ].map((stat) => (
            <div key={stat.label} style={card()}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.8rem' }}>{stat.icon}</span>
                <span style={label()}>{stat.label}</span>
              </div>
              <p style={{ fontFamily: 'var(--font-display, monospace)', fontSize: '2.2rem', color: TEXT, margin: 0, lineHeight: 1 }}>
                {stat.value}
              </p>
              <p style={{ fontSize: '0.62rem', color: MUTED, margin: '0.3rem 0 0' }}>{stat.sub}</p>
            </div>
          ))}
        </div>

        {/* ── Key Efficiency ──────────────────────────────────── */}
        <div style={{ ...card(), marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: '1rem' }}>
            <span style={{ fontSize: '0.8rem' }}>⌨</span>
            <span style={label({ letterSpacing: '0.2em' })}>Key Efficiency</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${HOME_ROW.length}, 1fr)`, gap: '0.5rem' }}>
            {HOME_ROW.map((key) => {
              const pct = keyEfficiency(key, summary.averageAccuracy)
              const col = effColor(pct)
              return (
                <div key={key} style={{ textAlign: 'center' }}>
                  <div style={{
                    background: `${col}22`,
                    border: `1px solid ${col}44`,
                    borderRadius: 4,
                    padding: '0.5rem 0.25rem',
                    marginBottom: '0.35rem',
                  }}>
                    <span style={{ fontFamily: 'var(--font-display, monospace)', fontSize: '1.3rem', color: col }}>
                      {key}
                    </span>
                  </div>
                  <div style={{ height: 3, background: BORDER_S, borderRadius: 2, overflow: 'hidden', marginBottom: '0.25rem' }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: col, borderRadius: 2 }} />
                  </div>
                  <span style={{ fontSize: '0.58rem', color: col }}>{pct}%</span>
                </div>
              )
            })}
          </div>

          <p style={{ fontSize: '0.62rem', color: MUTED, margin: '0.875rem 0 0' }}>
            {summary.totalCorrectedErrors.toLocaleString()} corrected errors across {summary.totalSessions} sessions
          </p>
        </div>

        {/* ── Recent Sessions ─────────────────────────────────── */}
        <div style={{ ...card(), marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: '0.875rem' }}>
            <span style={{ fontSize: '0.8rem' }}>📅</span>
            <span style={label({ letterSpacing: '0.2em' })}>Recent Sessions</span>
          </div>

          {sessions.length === 0 ? (
            <p style={{ fontSize: '0.74rem', color: MUTED }}>No sessions logged yet. Start typing to see your history here.</p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {['Date', 'WPM', 'Accuracy', 'Errors'].map((h) => (
                    <th key={h} style={{ ...label(), padding: '0 0 0.6rem', textAlign: 'left' as const }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sessions.map((s, i) => (
                  <tr key={i} style={{ borderTop: `1px solid ${BORDER_S}` }}>
                    <td style={{ padding: '0.6rem 0', fontSize: '0.72rem', color: MUTED }}>{formatDate(s.completedAt)}</td>
                    <td style={{ padding: '0.6rem 0', fontSize: '0.72rem', color: TEXT, fontWeight: 700 }}>{s.wpm}</td>
                    <td style={{ padding: '0.6rem 0', fontSize: '0.72rem', color: s.accuracy >= 95 ? GREEN : s.accuracy >= 85 ? GOLD : RED }}>
                      {s.accuracy}%
                    </td>
                    <td style={{ padding: '0.6rem 0', fontSize: '0.72rem', color: MUTED }}>{s.correctedErrors}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* ── Village Mastery ─────────────────────────────────── */}
        <div style={card()}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: '0.875rem' }}>
            <span style={{ fontSize: '0.8rem' }}>🏡</span>
            <span style={label({ letterSpacing: '0.2em' })}>Village Mastery</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
            {villageDefinitions.map((v) => {
              const pct = progress.villageMastery[v.id as VillageId] ?? 0
              return (
                <div key={v.id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                    <span style={{ fontSize: '0.72rem', color: pct > 0 ? TEXT : MUTED }}>{v.name}</span>
                    <span style={{ fontSize: '0.62rem', color: pct > 0 ? GOLD : MUTED }}>{pct}%</span>
                  </div>
                  <div style={{ height: 4, background: BORDER_S, borderRadius: 2, overflow: 'hidden' }}>
                    <div style={{
                      height: '100%',
                      width: `${pct}%`,
                      background: pct > 0 ? GOLD : 'transparent',
                      borderRadius: 2,
                      transition: 'width 600ms ease',
                    }} />
                  </div>
                </div>
              )
            })}
          </div>

          <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: `1px solid ${BORDER_S}`, display: 'flex', gap: '0.75rem' }}>
            <Link href="/play" style={{
              display: 'inline-block',
              padding: '0.5rem 1.25rem',
              background: '#238636',
              color: '#fff',
              fontSize: '0.72rem',
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              borderRadius: 4,
            }}>
              Log Session
            </Link>
            <Link href="/home" style={{
              display: 'inline-block',
              padding: '0.5rem 1.25rem',
              background: 'transparent',
              color: MUTED,
              fontSize: '0.72rem',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              border: `1px solid ${BORDER}`,
              borderRadius: 4,
            }}>
              Back to Village
            </Link>
          </div>
        </div>

      </div>
    </div>
  )
}
