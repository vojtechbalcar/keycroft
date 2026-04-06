export function VillageScene() {
  return (
    <figure
      aria-label="Your village — dormant, waiting for you to begin"
      className="h-full w-full"
      role="img"
    >
      <svg
        aria-hidden="true"
        className="h-full w-full"
        fill="none"
        viewBox="0 0 900 420"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="vs-fade-left" x1="0%" x2="100%" y1="0%" y2="0%">
            <stop offset="0%" stopColor="#f5efdf" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#f5efdf" stopOpacity="0" />
          </linearGradient>
          <linearGradient
            id="vs-fade-right"
            x1="0%"
            x2="100%"
            y1="0%"
            y2="0%"
          >
            <stop offset="0%" stopColor="#f5efdf" stopOpacity="0" />
            <stop offset="100%" stopColor="#f5efdf" stopOpacity="0.85" />
          </linearGradient>
          <linearGradient
            id="vs-fade-bottom"
            x1="0%"
            x2="0%"
            y1="0%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#f5efdf" stopOpacity="0" />
            <stop offset="100%" stopColor="#f5efdf" stopOpacity="0.6" />
          </linearGradient>
          <linearGradient
            id="vs-fade-top"
            x1="0%"
            x2="0%"
            y1="0%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#f5efdf" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#f5efdf" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* ── Layer 1: distant hills ── */}
        <path
          d="M 0 145 Q 150 90 300 128 Q 450 166 600 112 Q 750 68 900 115 L 900 420 L 0 420 Z"
          fill="#d0c0a0"
          opacity="0.62"
        />

        {/* ── Layer 2: mid hills ── */}
        <path
          d="M 0 222 Q 130 186 280 210 Q 430 234 580 196 Q 730 162 900 200 L 900 420 L 0 420 Z"
          fill="#c4b490"
        />

        {/* ── Distant building silhouette (far left background) ── */}
        <rect
          fill="#cfc0a0"
          height="34"
          opacity="0.38"
          rx="2"
          width="54"
          x="108"
          y="232"
        />
        <path
          d="M 100 235 L 135 212 L 170 235 Z"
          fill="#b8a888"
          opacity="0.38"
        />

        {/* ── Layer 3: ground ── */}
        <path
          d="M 0 300 Q 220 278 450 288 Q 680 298 900 280 L 900 420 L 0 420 Z"
          fill="#dfd0b4"
        />

        {/* ── Stone path (tapered for perspective) ── */}
        <path d="M 416 420 L 432 304 L 452 304 L 468 420 Z" fill="#c8b890" />
        {/* Path texture — stone ovals */}
        <ellipse
          cx="441"
          cy="378"
          fill="#bfac7e"
          opacity="0.5"
          rx="10"
          ry="4"
        />
        <ellipse
          cx="438"
          cy="352"
          fill="#bfac7e"
          opacity="0.48"
          rx="8"
          ry="3"
        />
        <ellipse
          cx="444"
          cy="328"
          fill="#bfac7e"
          opacity="0.44"
          rx="6"
          ry="2.5"
        />

        {/* ── Well ── */}
        {/* Shadow */}
        <ellipse
          cx="550"
          cy="323"
          fill="#c4b48a"
          opacity="0.38"
          rx="26"
          ry="10"
        />
        {/* Stone base */}
        <rect fill="#d4c4a2" height="26" rx="7" width="44" x="528" y="297" />
        {/* Stone top ring */}
        <rect fill="#c8b590" height="9" rx="7" width="44" x="528" y="297" />
        {/* Roof */}
        <path d="M 521 300 L 550 276 L 579 300 Z" fill="#8b7355" />
        {/* Posts */}
        <rect fill="#7a6248" height="20" rx="1.5" width="5" x="527" y="281" />
        <rect fill="#7a6248" height="20" rx="1.5" width="5" x="562" y="281" />
        {/* Rope */}
        <line
          stroke="#8b7355"
          strokeWidth="2"
          x1="532"
          x2="567"
          y1="291"
          y2="291"
        />

        {/* ── Cottage ── */}
        {/* Walls */}
        <rect fill="#ede2cc" height="84" rx="4" width="122" x="380" y="218" />
        {/* Right-side wall shadow */}
        <rect
          fill="#d8cdb0"
          height="84"
          opacity="0.35"
          rx="0"
          width="18"
          x="484"
          y="218"
        />
        {/* Left window */}
        <rect
          fill="#c8d4c0"
          height="24"
          opacity="0.88"
          rx="3"
          width="28"
          x="390"
          y="232"
        />
        <line
          stroke="#b0c4a8"
          strokeWidth="1"
          x1="404"
          x2="404"
          y1="232"
          y2="256"
        />
        <line
          stroke="#b0c4a8"
          strokeWidth="1"
          x1="390"
          x2="418"
          y1="244"
          y2="244"
        />
        {/* Right window */}
        <rect
          fill="#c8d4c0"
          height="24"
          opacity="0.88"
          rx="3"
          width="28"
          x="464"
          y="232"
        />
        <line
          stroke="#b0c4a8"
          strokeWidth="1"
          x1="478"
          x2="478"
          y1="232"
          y2="256"
        />
        <line
          stroke="#b0c4a8"
          strokeWidth="1"
          x1="464"
          x2="492"
          y1="244"
          y2="244"
        />
        {/* Door */}
        <rect fill="#8b7355" height="44" rx="3" width="28" x="427" y="258" />
        {/* Door handle */}
        <circle cx="449" cy="281" fill="#c89b6d" r="2.5" />
        {/* Roof */}
        <path d="M 368 221 L 441 162 L 514 221 Z" fill="#7a6248" />
        {/* Ridge */}
        <line
          stroke="#6b5540"
          strokeWidth="1.5"
          x1="441"
          x2="441"
          y1="162"
          y2="172"
        />
        {/* Chimney */}
        <rect fill="#8b7355" height="32" rx="2" width="18" x="470" y="174" />
        {/* Chimney cap */}
        <rect fill="#7a6248" height="6" rx="2" width="24" x="467" y="172" />

        {/* ── Chimney smoke (animated via CSS) ── */}
        <circle
          className="kc-smoke-1"
          cx="479"
          cy="165"
          fill="#d8cfc4"
          r="5.5"
        />
        <circle
          className="kc-smoke-2"
          cx="482"
          cy="157"
          fill="#d0c8bc"
          r="4.5"
        />
        <circle
          className="kc-smoke-3"
          cx="478"
          cy="149"
          fill="#cac1b4"
          r="3.5"
        />

        {/* ── Lantern post (left of path) ── */}
        {/* Base */}
        <rect fill="#7a6248" height="5" rx="1.5" width="15" x="396" y="302" />
        {/* Post */}
        <rect fill="#7a6248" height="37" rx="2" width="5" x="401" y="267" />
        {/* Lantern body */}
        <rect fill="#c89b6d" height="26" rx="6" width="25" x="389" y="253" />
        {/* Inner warm glow */}
        <rect
          fill="#f0c878"
          height="18"
          opacity="0.72"
          rx="4"
          width="17"
          x="393"
          y="257"
        />
        {/* Glow halo — animated */}
        <ellipse
          className="kc-glow"
          cx="401"
          cy="266"
          fill="#f0c878"
          opacity="0.3"
          rx="26"
          ry="21"
        />

        {/* ── Large oak tree (left) ── */}
        {/* Root flare */}
        <ellipse
          cx="254"
          cy="300"
          fill="#8b7355"
          opacity="0.4"
          rx="14"
          ry="5"
        />
        {/* Trunk */}
        <rect fill="#8b7355" height="52" rx="4" width="12" x="248" y="252" />
        {/* Foliage — layered blobs */}
        <ellipse cx="240" cy="241" fill="#8fa06c" rx="28" ry="33" />
        <ellipse cx="268" cy="237" fill="#8fa06c" rx="26" ry="31" />
        <ellipse cx="254" cy="220" fill="#9aad78" rx="40" ry="46" />
        <ellipse cx="236" cy="252" fill="#9aad78" opacity="0.65" rx="22" ry="26" />
        {/* Highlight */}
        <ellipse
          cx="248"
          cy="208"
          fill="#a8bc84"
          opacity="0.45"
          rx="22"
          ry="20"
        />

        {/* ── Smaller tree (right) ── */}
        <rect fill="#8b7355" height="40" rx="3" width="8" x="644" y="264" />
        <ellipse cx="648" cy="248" fill="#8fa06c" rx="26" ry="32" />
        <ellipse
          cx="658"
          cy="258"
          fill="#96a872"
          opacity="0.65"
          rx="18"
          ry="22"
        />
        <ellipse
          cx="640"
          cy="242"
          fill="#9aad78"
          opacity="0.5"
          rx="18"
          ry="22"
        />

        {/* ── Birds (subtle V shapes in sky) ── */}
        <path
          d="M 198 82 Q 204 76 210 82"
          fill="none"
          stroke="#a09080"
          strokeLinecap="round"
          strokeWidth="1.5"
        />
        <path
          d="M 215 76 Q 222 70 229 76"
          fill="none"
          stroke="#a09080"
          strokeLinecap="round"
          strokeWidth="1.5"
        />
        <path
          d="M 668 98 Q 675 92 682 98"
          fill="none"
          stroke="#a09080"
          strokeLinecap="round"
          strokeWidth="1.5"
        />

        {/* ── Edge vignettes ── */}
        <rect fill="url(#vs-fade-left)" height="420" width="130" x="0" y="0" />
        <rect
          fill="url(#vs-fade-right)"
          height="420"
          width="130"
          x="770"
          y="0"
        />
        <rect
          fill="url(#vs-fade-bottom)"
          height="110"
          width="900"
          x="0"
          y="310"
        />
        <rect fill="url(#vs-fade-top)" height="60" width="900" x="0" y="0" />
      </svg>
    </figure>
  )
}
