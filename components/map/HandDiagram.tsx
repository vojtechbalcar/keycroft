// Static hand-position diagram — highlights which fingers to use for this lesson's keyFocus

const KEY_TO_FINGER: Record<string, { hand: 'L' | 'R'; finger: 'pinky' | 'ring' | 'mid' | 'idx' }> = {
  // Left hand
  q: { hand: 'L', finger: 'pinky' }, a: { hand: 'L', finger: 'pinky' }, z: { hand: 'L', finger: 'pinky' },
  w: { hand: 'L', finger: 'ring'  }, s: { hand: 'L', finger: 'ring'  }, x: { hand: 'L', finger: 'ring'  },
  e: { hand: 'L', finger: 'mid'  }, d: { hand: 'L', finger: 'mid'   }, c: { hand: 'L', finger: 'mid'   },
  r: { hand: 'L', finger: 'idx'  }, f: { hand: 'L', finger: 'idx'   }, v: { hand: 'L', finger: 'idx'   },
  t: { hand: 'L', finger: 'idx'  }, g: { hand: 'L', finger: 'idx'   }, b: { hand: 'L', finger: 'idx'   },
  // Right hand
  y: { hand: 'R', finger: 'idx'  }, h: { hand: 'R', finger: 'idx'   }, n: { hand: 'R', finger: 'idx'   },
  u: { hand: 'R', finger: 'idx'  }, j: { hand: 'R', finger: 'idx'   }, m: { hand: 'R', finger: 'idx'   },
  i: { hand: 'R', finger: 'mid'  }, k: { hand: 'R', finger: 'mid'   },
  o: { hand: 'R', finger: 'ring' }, l: { hand: 'R', finger: 'ring'  },
  p: { hand: 'R', finger: 'pinky'}, ';': { hand: 'R', finger: 'pinky' },
}

const FINGER_COLORS = {
  pinky: '#f97316',
  ring:  '#60a5fa',
  mid:   '#4ade80',
  idx:   '#f87171',
} as const

type Props = { keyFocus: string[] }

export function HandDiagram({ keyFocus: rawFocus }: Props) {
  // Parse keyFocus into individual chars
  const focusKeys = new Set(
    rawFocus
      .join(' ')
      .toLowerCase()
      .split(/[\s+,;]+/)
      .filter((k) => k.length === 1),
  )

  // Which fingers are active on each hand?
  const activeL = new Set<string>()
  const activeR = new Set<string>()
  for (const k of focusKeys) {
    const m = KEY_TO_FINGER[k]
    if (!m) continue
    if (m.hand === 'L') activeL.add(m.finger)
    else activeR.add(m.finger)
  }

  function fingerColor(hand: 'L' | 'R', finger: string): string {
    const active = hand === 'L' ? activeL : activeR
    if (active.has(finger)) return FINGER_COLORS[finger as keyof typeof FINGER_COLORS] ?? '#e6edf3'
    return 'rgba(255,255,255,0.1)'
  }

  function fingerGlow(hand: 'L' | 'R', finger: string): string {
    const active = hand === 'L' ? activeL : activeR
    if (!active.has(finger)) return 'none'
    const c = FINGER_COLORS[finger as keyof typeof FINGER_COLORS] ?? '#e6edf3'
    return `drop-shadow(0 0 5px ${c})`
  }

  const PALM = 'rgba(255,255,255,0.07)'
  const PALM_STROKE = 'rgba(255,255,255,0.12)'

  // Left hand finger rects: [x, y, w, h, finger]
  const leftFingers: [number, number, number, number, string][] = [
    [6,  14, 13, 54, 'pinky'],
    [23,  9, 14, 59, 'ring' ],
    [41,  5, 14, 63, 'mid'  ],
    [59, 11, 14, 57, 'idx'  ],
  ]

  // Right hand finger rects (mirrored): [x, y, w, h, finger]
  const rightFingers: [number, number, number, number, string][] = [
    [127, 11, 14, 57, 'idx'  ],
    [145,  5, 14, 63, 'mid'  ],
    [163,  9, 14, 59, 'ring' ],
    [181, 14, 13, 54, 'pinky'],
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
      <svg
        viewBox="0 0 210 100"
        width={210}
        height={100}
        aria-label="Hand position diagram"
        style={{ overflow: 'visible' }}
      >
        {/* ── Left hand ── */}
        {/* Palm */}
        <rect x={4} y={65} width={78} height={26} rx={8}
          fill={PALM} stroke={PALM_STROKE} strokeWidth={1} />

        {/* Fingers */}
        {leftFingers.map(([x, y, w, h, f]) => (
          <rect key={f} x={x} y={y} width={w} height={h} rx={5}
            fill={fingerColor('L', f)}
            stroke={activeL.has(f) ? FINGER_COLORS[f as keyof typeof FINGER_COLORS] : PALM_STROKE}
            strokeWidth={activeL.has(f) ? 1.5 : 1}
            style={{ filter: fingerGlow('L', f) }}
          />
        ))}

        {/* Home row dots — tiny markers on f and j */}
        <circle cx={66} cy={55} r={2.5} fill="rgba(255,255,255,0.35)" />

        {/* ── Right hand ── */}
        {/* Palm */}
        <rect x={128} y={65} width={78} height={26} rx={8}
          fill={PALM} stroke={PALM_STROKE} strokeWidth={1} />

        {/* Fingers */}
        {rightFingers.map(([x, y, w, h, f]) => (
          <rect key={f} x={x} y={y} width={w} height={h} rx={5}
            fill={fingerColor('R', f)}
            stroke={activeR.has(f) ? FINGER_COLORS[f as keyof typeof FINGER_COLORS] : PALM_STROKE}
            strokeWidth={activeR.has(f) ? 1.5 : 1}
            style={{ filter: fingerGlow('R', f) }}
          />
        ))}

        {/* Home row dot on j */}
        <circle cx={134} cy={55} r={2.5} fill="rgba(255,255,255,0.35)" />

        {/* Space bar */}
        <rect x={82} y={80} width={46} height={10} rx={4}
          fill="rgba(255,255,255,0.06)" stroke={PALM_STROKE} strokeWidth={1} />
      </svg>

      {/* Legend */}
      {(activeL.size > 0 || activeR.size > 0) && (
        <div style={{
          display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center',
          fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase',
        }}>
          {([
            ['pinky', 'Pinky'], ['ring', 'Ring'], ['mid', 'Middle'], ['idx', 'Index'],
          ] as [string, string][]).map(([key, label]) => {
            const anyActive = activeL.has(key) || activeR.has(key)
            if (!anyActive) return null
            return (
              <span key={key} style={{
                display: 'flex', alignItems: 'center', gap: 4,
                color: FINGER_COLORS[key as keyof typeof FINGER_COLORS],
              }}>
                <span style={{
                  width: 8, height: 8, borderRadius: 2,
                  background: FINGER_COLORS[key as keyof typeof FINGER_COLORS],
                  display: 'inline-block',
                }} />
                {label}
              </span>
            )
          })}
        </div>
      )}
    </div>
  )
}
