import Link from 'next/link'

type Props = {
  gold: number
  rareMaterials: Record<string, number>
}

const RARE_ICONS: Record<string, string> = {
  stone: '🪨',
  timber: '🪵',
}

export function MapTopBar({ gold, rareMaterials }: Props) {
  const rares = Object.entries(rareMaterials).filter(([, v]) => v > 0)

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 20px',
      height: 52,
      background: 'rgba(5, 9, 26, 0.92)',
      borderBottom: '1px solid rgba(196,154,58,0.18)',
      backdropFilter: 'blur(12px)',
      fontFamily: 'var(--font-mono, monospace)',
    }}>

      {/* Left — Village */}
      <Link
        href="/village"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: '5px 14px',
          borderRadius: 8,
          border: '1px solid rgba(196,154,58,0.3)',
          background: 'rgba(196,154,58,0.08)',
          color: '#c49a3a',
          fontSize: 13,
          fontWeight: 700,
          letterSpacing: '0.04em',
          textDecoration: 'none',
        }}
      >
        🏘 Village
      </Link>

      {/* Center — Title */}
      <span style={{
        fontSize: 14,
        fontWeight: 700,
        color: '#e6edf3',
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
      }}>
        🗺 Lesson Map
      </span>

      {/* Right — Resources + Icons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ fontSize: 13, color: '#c49a3a', fontWeight: 700 }}>
          🪙 {gold}
        </span>

        {rares.map(([key, val]) => (
          <span key={key} style={{ fontSize: 13, color: '#9ca3af' }}>
            {RARE_ICONS[key] ?? '✨'} {val}
          </span>
        ))}

        <Link
          href="/progress"
          title="Inventory"
          style={{
            width: 34, height: 34,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            borderRadius: 8,
            border: '1px solid rgba(255,255,255,0.1)',
            background: 'rgba(255,255,255,0.05)',
            fontSize: 16,
            textDecoration: 'none',
          }}
        >
          🎒
        </Link>

        <Link
          href="/skills"
          title="Skill Tree"
          style={{
            width: 34, height: 34,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            borderRadius: 8,
            border: '1px solid rgba(255,255,255,0.1)',
            background: 'rgba(255,255,255,0.05)',
            fontSize: 16,
            textDecoration: 'none',
          }}
        >
          ⚡
        </Link>
      </div>
    </header>
  )
}
