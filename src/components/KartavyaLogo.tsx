import React from 'react';

interface KartavyaLogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
  textSize?: 'sm' | 'md' | 'lg';
}

/**
 * Kartavya Civic Action Logo
 * Recreates the tricolor mandala motif with central Ashoka Chakra
 * and 6 surrounding stylized citizen figures in alternating saffron and emerald green.
 */
export const KartavyaLogo: React.FC<KartavyaLogoProps> = ({
  className = '',
  size = 40,
  showText = false,
  textSize = 'md'
}) => {
  // 6 citizen figures: 3 Saffron (#F97316), 3 Emerald Green (#047857)
  // Each figure is rotated around the center (100, 100)
  const figures = [
    { angle: 0, color: '#047857' },    // Top Green
    { angle: 60, color: '#F97316' },   // Top-Right Saffron
    { angle: 120, color: '#047857' },  // Bottom-Right Green
    { angle: 180, color: '#F97316' },  // Bottom Saffron
    { angle: 240, color: '#047857' },  // Bottom-Left Green
    { angle: 300, color: '#F97316' },  // Top-Left Saffron
  ];

  // 24 spokes for Ashoka Chakra
  const spokes = Array.from({ length: 24 }, (_, i) => i * 15);

  const emblem = (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 transition-transform duration-300 hover:rotate-12"
      aria-label="Kartavya Civic Emblem"
    >
      {/* 6 Rotating Citizen Figures */}
      {figures.map((fig, idx) => (
        <g key={idx} transform={`rotate(${fig.angle} 100 100)`}>
          {/* Head */}
          <circle cx="83" cy="42" r="14" fill={fig.color} />
          {/* Curved Dynamic Body / Arm */}
          <path
            d="M105 18 C145 18 178 48 162 88 C153 72 135 63 118 64 C94 66 75 82 72 104 C64 88 72 58 105 18 Z"
            fill={fig.color}
          />
        </g>
      ))}

      {/* Center Ashoka Chakra in Navy Blue */}
      <g transform="translate(100, 100)">
        {/* Outer Ring */}
        <circle cx="0" cy="0" r="28" stroke="#1E3A8A" strokeWidth="4.5" fill="#FFFFFF" />
        
        {/* 24 Radial Spokes */}
        {spokes.map((deg) => (
          <line
            key={deg}
            x1="0"
            y1="0"
            x2={26 * Math.cos((deg * Math.PI) / 180)}
            y2={26 * Math.sin((deg * Math.PI) / 180)}
            stroke="#1E3A8A"
            strokeWidth="1.2"
          />
        ))}

        {/* Small serrated inner border dots */}
        {spokes.map((deg) => (
          <circle
            key={`dot-${deg}`}
            cx={24 * Math.cos(((deg + 7.5) * Math.PI) / 180)}
            cy={24 * Math.sin(((deg + 7.5) * Math.PI) / 180)}
            r="0.8"
            fill="#1E3A8A"
          />
        ))}

        {/* Central Hub */}
        <circle cx="0" cy="0" r="6" fill="#1E3A8A" />
        <circle cx="0" cy="0" r="2.5" fill="#FFFFFF" />
      </g>
    </svg>
  );

  if (!showText) {
    return <div className={`inline-flex items-center ${className}`}>{emblem}</div>;
  }

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      {emblem}
      <div className="flex flex-col text-left">
        <div className="flex items-center gap-2">
          <span
            className={`font-extrabold tracking-tight text-[#047857] ${
              textSize === 'lg' ? 'text-2xl' : textSize === 'md' ? 'text-lg' : 'text-base'
            }`}
          >
            KARTAVYA
          </span>
          <span className="text-[10px] font-bold tracking-wider px-1.5 py-0.5 border border-[#047857] text-[#047857] rounded uppercase">
            CIVIC ACTION
          </span>
        </div>
        <span className="text-[11px] text-[#047857]/70 font-medium">
          See the issue. Be the change.
        </span>
      </div>
    </div>
  );
};

export default KartavyaLogo;
