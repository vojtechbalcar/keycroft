export function VillageScene() {
  return (
    <figure
      aria-label="Village map — your world grows as you practice"
      className="h-full w-full"
      role="img"
    >
      <svg
        aria-hidden="true"
        className="h-full w-full"
        fill="none"
        viewBox="0 0 900 500"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Fog of war — transparent at hub, heavy at edges */}
          <radialGradient cx="50%" cy="57%" id="vs-fog" r="50%">
            <stop offset="0%" stopColor="#ede3cc" stopOpacity="0" />
            <stop offset="50%" stopColor="#ede3cc" stopOpacity="0" />
            <stop offset="72%" stopColor="#ede3cc" stopOpacity="0.38" />
            <stop offset="100%" stopColor="#ede3cc" stopOpacity="0.90" />
          </radialGradient>

          {/* River water */}
          <linearGradient id="vs-water" x1="0%" x2="0%" y1="0%" y2="100%">
            <stop offset="0%" stopColor="#a4bfbc" />
            <stop offset="100%" stopColor="#8aacaa" />
          </linearGradient>

          {/* Central clearing glow */}
          <radialGradient cx="50%" cy="57%" id="vs-clearing" r="28%">
            <stop offset="0%" stopColor="#d8eab4" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#d8eab4" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* ── Base terrain ── */}
        <rect fill="#ede3cc" height="500" width="900" x="0" y="0" />

        {/* ── Terrain variation patches ── */}
        <ellipse
          cx="450"
          cy="285"
          fill="#ccd8a4"
          opacity="0.65"
          rx="210"
          ry="175"
        />
        <ellipse
          cx="175"
          cy="325"
          fill="#c8d4a0"
          opacity="0.48"
          rx="148"
          ry="105"
        />
        <ellipse
          cx="725"
          cy="325"
          fill="#c8d4a0"
          opacity="0.48"
          rx="140"
          ry="100"
        />
        <ellipse
          cx="168"
          cy="188"
          fill="#c4d09c"
          opacity="0.4"
          rx="162"
          ry="108"
        />
        <ellipse
          cx="732"
          cy="188"
          fill="#c4d09c"
          opacity="0.4"
          rx="152"
          ry="104"
        />
        <ellipse
          cx="450"
          cy="82"
          fill="#c4d09c"
          opacity="0.34"
          rx="138"
          ry="78"
        />

        {/* ── River ── */}
        <path
          d="M 0 152 C 180 144 380 162 450 155 C 520 148 720 166 900 158 L 900 180 C 720 188 520 172 450 179 C 380 186 180 170 0 178 Z"
          fill="url(#vs-water)"
        />
        {/* River edge lines */}
        <path
          d="M 0 152 C 180 144 380 162 450 155 C 520 148 720 166 900 158"
          fill="none"
          opacity="0.4"
          stroke="#7aa4a0"
          strokeWidth="1.5"
        />
        <path
          d="M 0 178 C 180 186 380 170 450 179 C 520 188 720 172 900 180"
          fill="none"
          opacity="0.4"
          stroke="#7aa4a0"
          strokeWidth="1.5"
        />

        {/* ── Main north–south path ── */}
        <path
          d="M 450 500 L 450 178"
          fill="none"
          stroke="#d4c09c"
          strokeLinecap="round"
          strokeWidth="22"
        />
        {/* Path north of river (fades) */}
        <path
          d="M 450 152 L 450 24"
          fill="none"
          opacity="0.62"
          stroke="#d4c09c"
          strokeLinecap="round"
          strokeWidth="18"
        />

        {/* ── Bridge ── */}
        <rect fill="#c8b890" height="30" rx="2" width="32" x="434" y="148" />
        {/* Planks */}
        <line
          stroke="#b8a878"
          strokeWidth="1.5"
          x1="434"
          x2="466"
          y1="157"
          y2="157"
        />
        <line
          stroke="#b8a878"
          strokeWidth="1.5"
          x1="434"
          x2="466"
          y1="164"
          y2="164"
        />
        <line
          stroke="#b8a878"
          strokeWidth="1.5"
          x1="434"
          x2="466"
          y1="171"
          y2="171"
        />
        {/* Railings */}
        <line
          stroke="#a89878"
          strokeWidth="2"
          x1="434"
          x2="434"
          y1="148"
          y2="178"
        />
        <line
          stroke="#a89878"
          strokeWidth="2"
          x1="466"
          x2="466"
          y1="148"
          y2="178"
        />

        {/* ── Branch paths (from hub outward) ── */}
        {/* West */}
        <path
          d="M 450 285 C 385 265 285 248 68 192"
          fill="none"
          opacity="0.82"
          stroke="#d4c09c"
          strokeLinecap="round"
          strokeWidth="18"
        />
        {/* East */}
        <path
          d="M 450 285 C 515 265 615 248 832 192"
          fill="none"
          opacity="0.82"
          stroke="#d4c09c"
          strokeLinecap="round"
          strokeWidth="18"
        />
        {/* NW beyond bridge */}
        <path
          d="M 450 148 C 395 124 318 96 152 42"
          fill="none"
          opacity="0.52"
          stroke="#d4c09c"
          strokeLinecap="round"
          strokeWidth="15"
        />
        {/* NE beyond bridge */}
        <path
          d="M 450 148 C 505 124 582 96 748 42"
          fill="none"
          opacity="0.52"
          stroke="#d4c09c"
          strokeLinecap="round"
          strokeWidth="15"
        />

        {/* ── Locked zone: distant building silhouettes ── */}
        {/* West */}
        <path d="M 60 208 L 78 195 L 96 208 Z" fill="#b0986c" opacity="0.26" />
        <rect
          fill="#bca888"
          height="16"
          opacity="0.26"
          rx="2"
          width="22"
          x="63"
          y="208"
        />
        <rect
          fill="#bca888"
          height="12"
          opacity="0.2"
          rx="2"
          width="16"
          x="40"
          y="218"
        />
        {/* East */}
        <path
          d="M 804 208 L 822 195 L 840 208 Z"
          fill="#b0986c"
          opacity="0.26"
        />
        <rect
          fill="#bca888"
          height="16"
          opacity="0.26"
          rx="2"
          width="22"
          x="815"
          y="208"
        />
        {/* North mountains */}
        <path
          d="M 355 52 L 400 18 L 445 52 Z"
          fill="#c4b8a8"
          opacity="0.22"
        />
        <path
          d="M 420 52 L 470 14 L 520 52 Z"
          fill="#c4b8a8"
          opacity="0.18"
        />
        <path
          d="M 490 52 L 530 24 L 570 52 Z"
          fill="#c4b8a8"
          opacity="0.15"
        />

        {/* ── Gate / archway markers ── */}
        {/* West gate */}
        <line
          stroke="#c0a880"
          strokeWidth="2.5"
          x1="96"
          x2="96"
          y1="200"
          y2="212"
        />
        <line
          stroke="#c0a880"
          strokeWidth="2.5"
          x1="112"
          x2="112"
          y1="200"
          y2="212"
        />
        <path
          d="M 93 200 Q 104 192 115 200"
          fill="none"
          stroke="#c0a880"
          strokeWidth="2.5"
        />
        {/* East gate */}
        <line
          stroke="#c0a880"
          strokeWidth="2.5"
          x1="788"
          x2="788"
          y1="200"
          y2="212"
        />
        <line
          stroke="#c0a880"
          strokeWidth="2.5"
          x1="804"
          x2="804"
          y1="200"
          y2="212"
        />
        <path
          d="M 785 200 Q 796 192 807 200"
          fill="none"
          stroke="#c0a880"
          strokeWidth="2.5"
        />
        {/* North gate (above bridge) */}
        <line
          stroke="#c0a880"
          strokeWidth="2"
          x1="442"
          x2="442"
          y1="35"
          y2="45"
        />
        <line
          stroke="#c0a880"
          strokeWidth="2"
          x1="458"
          x2="458"
          y1="35"
          y2="45"
        />
        <path
          d="M 439 35 Q 450 27 461 35"
          fill="none"
          stroke="#c0a880"
          strokeWidth="2"
        />

        {/* ── Tree clusters (top-down canopy circles) ── */}

        {/* Left main cluster */}
        <circle cx="292" cy="318" fill="#8fa06c" r="30" />
        <circle cx="270" cy="300" fill="#9aad78" r="24" />
        <circle cx="316" cy="304" fill="#8fa06c" r="21" />
        <circle cx="284" cy="342" fill="#749060" r="17" />
        {/* Shadow depth */}
        <circle cx="292" cy="326" fill="#749060" opacity="0.32" r="14" />
        <circle cx="272" cy="308" fill="#749060" opacity="0.28" r="10" />

        {/* Right main cluster */}
        <circle cx="608" cy="318" fill="#8fa06c" r="28" />
        <circle cx="630" cy="302" fill="#9aad78" r="22" />
        <circle cx="585" cy="305" fill="#8fa06c" r="20" />
        <circle cx="618" cy="342" fill="#749060" r="16" />
        <circle cx="608" cy="326" fill="#749060" opacity="0.3" r="13" />

        {/* North-west forest (in fog) */}
        <circle cx="158" cy="195" fill="#8fa06c" opacity="0.58" r="30" />
        <circle cx="134" cy="178" fill="#9aad78" opacity="0.52" r="24" />
        <circle cx="182" cy="180" fill="#8fa06c" opacity="0.52" r="21" />
        <circle cx="150" cy="218" fill="#749060" opacity="0.48" r="18" />
        <circle cx="112" cy="205" fill="#8fa06c" opacity="0.44" r="16" />
        <circle cx="172" cy="210" fill="#9aad78" opacity="0.44" r="13" />

        {/* North-east forest (in fog) */}
        <circle cx="742" cy="195" fill="#8fa06c" opacity="0.58" r="28" />
        <circle cx="766" cy="178" fill="#9aad78" opacity="0.52" r="22" />
        <circle cx="718" cy="182" fill="#8fa06c" opacity="0.52" r="20" />
        <circle cx="754" cy="218" fill="#749060" opacity="0.48" r="17" />
        <circle cx="790" cy="205" fill="#8fa06c" opacity="0.44" r="15" />

        {/* Small trees flanking south path */}
        <circle cx="392" cy="385" fill="#9aad78" r="13" />
        <circle cx="380" cy="398" fill="#8fa06c" r="9" />
        <circle cx="508" cy="385" fill="#9aad78" r="12" />
        <circle cx="520" cy="399" fill="#8fa06c" r="9" />
        <circle cx="388" cy="440" fill="#9aad78" r="10" />
        <circle cx="512" cy="440" fill="#9aad78" r="11" />

        {/* ── Central hub structures ── */}

        {/* Cottage shadow */}
        <rect
          fill="#b8a080"
          height="10"
          opacity="0.28"
          rx="3"
          width="38"
          x="437"
          y="294"
        />

        {/* Cottage rooftop (top-down) */}
        <rect fill="#c0aa88" height="34" rx="3" width="38" x="431" y="262" />
        {/* Roof ridge (divides two slopes) */}
        <line
          stroke="#9c8860"
          strokeLinecap="round"
          strokeWidth="2.5"
          x1="450"
          x2="450"
          y1="263"
          y2="295"
        />
        {/* Eave shadow lines */}
        <rect
          fill="#a89070"
          height="2"
          opacity="0.35"
          rx="1"
          width="38"
          x="431"
          y="262"
        />
        <rect
          fill="#a89070"
          height="2"
          opacity="0.25"
          rx="1"
          width="38"
          x="431"
          y="294"
        />
        {/* Chimney dot */}
        <circle cx="462" cy="268" fill="#8b7355" r="4.5" />

        {/* Chimney smoke (top-down: drifts northward / upward on map) */}
        <circle
          className="kc-smoke-1"
          cx="463"
          cy="260"
          fill="#d8cfc4"
          r="5"
        />
        <circle
          className="kc-smoke-2"
          cx="466"
          cy="251"
          fill="#d0c8bc"
          r="4"
        />
        <circle
          className="kc-smoke-3"
          cx="463"
          cy="243"
          fill="#cac1b4"
          r="3.2"
        />

        {/* Well shadow */}
        <circle cx="508" cy="300" fill="#b8a078" opacity="0.22" r="15" />
        {/* Well base */}
        <circle cx="506" cy="298" fill="#d4c4a2" r="14" />
        {/* Stone ring */}
        <circle
          cx="506"
          cy="298"
          fill="none"
          r="10"
          stroke="#b8a888"
          strokeWidth="2.5"
        />
        {/* Water */}
        <circle cx="506" cy="298" fill="#8ab4b0" r="6" />
        {/* Rope mechanism */}
        <line
          stroke="#8b7355"
          strokeLinecap="round"
          strokeWidth="1.5"
          x1="498"
          x2="514"
          y1="298"
          y2="298"
        />

        {/* ── Lanterns along path (top-down: glow halo + post dot) ── */}
        {/* Near cottage */}
        <circle
          className="kc-glow"
          cx="422"
          cy="314"
          fill="#f0c878"
          opacity="0.35"
          r="19"
        />
        <circle cx="422" cy="314" fill="#c89b6d" r="4" />

        {/* Mid path */}
        <circle
          className="kc-glow"
          cx="421"
          cy="368"
          fill="#f0c878"
          opacity="0.28"
          r="15"
        />
        <circle cx="421" cy="368" fill="#c89b6d" r="3.5" />

        {/* Lower path */}
        <circle
          className="kc-glow"
          cx="420"
          cy="425"
          fill="#f0c878"
          opacity="0.22"
          r="12"
        />
        <circle cx="420" cy="425" fill="#c89b6d" r="3" />

        {/* ── Central clearing glow (subtle bloom at hub) ── */}
        <ellipse
          cx="450"
          cy="285"
          fill="url(#vs-clearing)"
          height="350"
          rx="185"
          ry="150"
        />

        {/* ── Fog of war overlay ── */}
        <rect fill="url(#vs-fog)" height="500" width="900" x="0" y="0" />
      </svg>
    </figure>
  )
}
