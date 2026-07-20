interface TZLogoProps {
  size?: number;
  className?: string;
}

export function TZLogo({ size = 40, className = '' }: TZLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Dark rounded square background */}
      <rect width="40" height="40" rx="9" fill="#0f2044" />

      {/* Blue lightning bolt accent — top-right corner */}
      <polygon
        points="26,5 18,20 23,20 15,35 30,17 24,17"
        fill="#3b82f6"
        opacity="0.9"
      />

      {/* TZ letters */}
      <text
        x="5"
        y="27"
        fontFamily="'Inter', 'Arial', sans-serif"
        fontWeight="800"
        fontSize="16"
        fill="white"
        letterSpacing="-0.5"
      >
        TZ
      </text>
    </svg>
  );
}
