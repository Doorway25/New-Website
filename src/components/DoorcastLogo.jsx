/** Doorcast wordmark — single-line DOORCAST with headphones in the OO. */
export default function DoorcastLogo({ className = "", light = true }) {
  const fill = light ? "#ffffff" : "#0d157b";
  const accent = "#3b9eff";
  return (
    <div className={`inline-block overflow-visible ${className}`}>
      <svg
        viewBox="0 0 560 110"
        className="h-auto w-full"
        aria-label="DOORCAST"
        role="img"
        preserveAspectRatio="xMidYMid meet"
      >
        <text
          x="4"
          y="82"
          fill={fill}
          fontFamily="Georgia, 'Times New Roman', serif"
          fontSize="86"
          fontWeight="700"
          letterSpacing="2"
        >
          D
        </text>
        <g transform="translate(72,6)">
          <circle cx="46" cy="50" r="34" fill="none" stroke={fill} strokeWidth="9" />
          <circle cx="128" cy="50" r="34" fill="none" stroke={fill} strokeWidth="9" />
          <path
            d="M46 16 C46 2 128 2 128 16"
            fill="none"
            stroke={fill}
            strokeWidth="7"
            strokeLinecap="round"
          />
          <rect x="26" y="28" width="18" height="34" rx="6" fill={accent} />
          <rect x="130" y="28" width="18" height="34" rx="6" fill={accent} />
          <path
            d="M52 48 C70 38 104 38 122 48"
            fill="none"
            stroke={accent}
            strokeWidth="3.5"
            strokeLinecap="round"
          />
        </g>
        <text
          x="250"
          y="82"
          fill={fill}
          fontFamily="Georgia, 'Times New Roman', serif"
          fontSize="86"
          fontWeight="700"
          letterSpacing="2"
        >
          RCAST
        </text>
      </svg>
    </div>
  );
}
