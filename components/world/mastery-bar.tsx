type MasteryBarProps = {
  mastery: number   // 0–100
  accent: string    // CSS colour for the fill
  showLabel?: boolean
}

export function MasteryBar({ mastery, accent, showLabel = false }: MasteryBarProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, width: '100%' }}>
      {showLabel && (
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'rgba(255,255,255,0.6)' }}>
          <span>Mastery</span>
          <span>{mastery}/100</span>
        </div>
      )}
      <div
        style={{
          width: '100%',
          height: 6,
          background: 'rgba(255,255,255,0.12)',
          borderRadius: 3,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${mastery}%`,
            height: '100%',
            background: accent,
            borderRadius: 3,
            transition: 'width 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        />
      </div>
    </div>
  )
}
