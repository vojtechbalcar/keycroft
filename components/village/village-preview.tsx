export function VillagePreview() {
  return (
    <figure
      aria-label="Village preview — your world grows as you practice"
      className="h-full w-full"
      role="img"
    >
      <svg
        aria-hidden="true"
        className="h-full w-full"
        fill="none"
        viewBox="0 0 400 300"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="vp-fade-left" x1="0%" x2="100%" y1="0%" y2="0%">
            <stop offset="0%" stopColor="#f3e8d0" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#f3e8d0" stopOpacity="0" />
          </linearGradient>
          <linearGradient
            id="vp-fade-right"
            x1="0%"
            x2="100%"
            y1="0%"
            y2="0%"
          >
            <stop offset="0%" stopColor="#f3e8d0" stopOpacity="0" />
            <stop offset="100%" stopColor="#f3e8d0" stopOpacity="0.9" />
          </linearGradient>
          <linearGradient
            id="vp-fade-bottom"
            x1="0%"
            x2="0%"
            y1="0%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#ebe0c8" stopOpacity="0" />
            <stop offset="100%" stopColor="#ebe0c8" stopOpacity="0.65" />
          </linearGradient>
          <linearGradient
            id="vp-fade-top"
            x1="0%"
            x2="0%"
            y1="0%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#f3e8d0" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#f3e8d0" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* ── Distant hill ── */}
        <path
          d="M 0 92 Q 100 58 200 84 Q 300 110 400 74 L 400 300 L 0 300 Z"
          fill="#d0c0a0"
          opacity="0.58"
        />

        {/* ── Mid hill ── */}
        <path
          d="M 0 152 Q 100 120 200 144 Q 300 168 400 136 L 400 300 L 0 300 Z"
          fill="#c4b490"
        />

        {/* ── Ground ── */}
        <path
          d="M 0 212 Q 200 196 400 205 L 400 300 L 0 300 Z"
          fill="#dfd0b4"
        />

        {/* ── Stone path ── */}
        <path d="M 174 300 L 185 216 L 203 216 L 213 300 Z" fill="#c8b890" />
        <ellipse
          cx="196"
          cy="270"
          fill="#bfac7e"
          opacity="0.48"
          rx="7"
          ry="3"
        />
        <ellipse
          cx="194"
          cy="248"
          fill="#bfac7e"
          opacity="0.44"
          rx="5"
          ry="2"
        />

        {/* ── Cottage ── */}
        {/* Walls */}
        <rect fill="#ede2cc" height="64" rx="3" width="78" x="158" y="152" />
        {/* Right shadow */}
        <rect
          fill="#d8cdb0"
          height="64"
          opacity="0.3"
          rx="0"
          width="14"
          x="222"
          y="152"
        />
        {/* Left window */}
        <rect
          fill="#c8d4c0"
          height="17"
          opacity="0.88"
          rx="2"
          width="20"
          x="165"
          y="163"
        />
        <line
          stroke="#b0c4a8"
          strokeWidth="1"
          x1="175"
          x2="175"
          y1="163"
          y2="180"
        />
        <line
          stroke="#b0c4a8"
          strokeWidth="1"
          x1="165"
          x2="185"
          y1="171"
          y2="171"
        />
        {/* Right window */}
        <rect
          fill="#c8d4c0"
          height="17"
          opacity="0.88"
          rx="2"
          width="20"
          x="209"
          y="163"
        />
        <line
          stroke="#b0c4a8"
          strokeWidth="1"
          x1="219"
          x2="219"
          y1="163"
          y2="180"
        />
        <line
          stroke="#b0c4a8"
          strokeWidth="1"
          x1="209"
          x2="229"
          y1="171"
          y2="171"
        />
        {/* Door */}
        <rect fill="#8b7355" height="37" rx="2" width="18" x="188" y="179" />
        <circle cx="202" cy="199" fill="#c89b6d" r="2" />
        {/* Roof */}
        <path d="M 147 155 L 197 116 L 247 155 Z" fill="#7a6248" />
        {/* Ridge */}
        <line
          stroke="#6b5540"
          strokeWidth="1.2"
          x1="197"
          x2="197"
          y1="116"
          y2="124"
        />
        {/* Chimney */}
        <rect fill="#8b7355" height="24" rx="2" width="13" x="215" y="124" />
        <rect fill="#7a6248" height="5" rx="1.5" width="19" x="212" y="122" />

        {/* ── Smoke ── */}
        <circle
          className="kc-smoke-1"
          cx="221"
          cy="118"
          fill="#d8cfc4"
          r="4"
        />
        <circle
          className="kc-smoke-2"
          cx="224"
          cy="111"
          fill="#d0c8bc"
          r="3.2"
        />
        <circle
          className="kc-smoke-3"
          cx="220"
          cy="104"
          fill="#cac1b4"
          r="2.5"
        />

        {/* ── Lantern post ── */}
        <rect fill="#7a6248" height="4" rx="1" width="13" x="146" y="218" />
        <rect fill="#7a6248" height="26" rx="1.5" width="4" x="150" y="194" />
        <rect fill="#c89b6d" height="20" rx="5" width="20" x="141" y="184" />
        <rect
          fill="#f0c878"
          height="13"
          opacity="0.7"
          rx="3"
          width="13"
          x="144"
          y="187"
        />
        <ellipse
          className="kc-glow"
          cx="151"
          cy="194"
          fill="#f0c878"
          opacity="0.28"
          rx="18"
          ry="14"
        />

        {/* ── Tree (left) ── */}
        <ellipse
          cx="88"
          cy="210"
          fill="#8b7355"
          opacity="0.35"
          rx="10"
          ry="4"
        />
        <rect fill="#8b7355" height="38" rx="3" width="8" x="84" y="176" />
        <ellipse cx="74" cy="174" fill="#8fa06c" rx="20" ry="24" />
        <ellipse cx="92" cy="170" fill="#9aad78" rx="26" ry="30" />
        <ellipse
          cx="78"
          cy="162"
          fill="#a8bc84"
          opacity="0.45"
          rx="16"
          ry="16"
        />

        {/* ── Birds ── */}
        <path
          d="M 298 68 Q 304 62 310 68"
          fill="none"
          stroke="#a09080"
          strokeLinecap="round"
          strokeWidth="1.2"
        />
        <path
          d="M 315 62 Q 321 56 327 62"
          fill="none"
          stroke="#a09080"
          strokeLinecap="round"
          strokeWidth="1.2"
        />

        {/* ── Edge vignettes ── */}
        <rect fill="url(#vp-fade-left)" height="300" width="90" x="0" y="0" />
        <rect
          fill="url(#vp-fade-right)"
          height="300"
          width="90"
          x="310"
          y="0"
        />
        <rect
          fill="url(#vp-fade-bottom)"
          height="90"
          width="400"
          x="0"
          y="210"
        />
        <rect fill="url(#vp-fade-top)" height="50" width="400" x="0" y="0" />
      </svg>
    </figure>
  )
}
