export function TZLogo({ size = 40, className = '' }: { size?: number, className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="tzGlow" x1="20" y1="0" x2="20" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor="#3b82f6" stopOpacity="0.8" />
          <stop offset="1" stopColor="#1d4ed8" stopOpacity="0.9" />
        </linearGradient>
        <filter id="glowEffect" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
      
      {/* Dark rounded square background */}
      <rect width="40" height="40" rx="10" fill="#0b1329" />
      
      {/* Outer subtle glow/border */}
      <rect width="38" height="38" x="1" y="1" rx="9" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />

      {/* Styled Circuit / Lightning symbol */}
      <path
        d="M27 8L16 22H23L15 32L30 17H22L27 8Z"
        fill="url(#tzGlow)"
        filter="url(#glowEffect)"
      />

      {/* TZ letters */}
      <text
        x="6"
        y="26"
        fontFamily="'Poppins', sans-serif"
        fontWeight="700"
        fontSize="16"
        fill="white"
        letterSpacing="-0.5"
      >
        TZ
      </text>
    </svg>
  );
}
