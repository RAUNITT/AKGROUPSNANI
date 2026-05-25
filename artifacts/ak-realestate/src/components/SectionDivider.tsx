interface SectionDividerProps {
  flip?: boolean;
  accentLine?: boolean;
}

export function SectionDivider({ flip = false, accentLine = false }: SectionDividerProps) {
  return (
    <div className={`relative w-full h-20 sm:h-28 overflow-hidden pointer-events-none ${flip ? "rotate-180" : ""}`}>
      {/* Main gradient morph */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-[#0d0d0d] to-[#0a0a0a]" />

      {/* Sweeping horizontal glow line */}
      {accentLine && (
        <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      )}

      {/* Radial ambient */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-full bg-primary/5 blur-[60px] rounded-full" />

      {/* SVG morph wave */}
      <svg
        viewBox="0 0 1440 80"
        preserveAspectRatio="none"
        className="absolute inset-0 w-full h-full opacity-40"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0,40 C240,70 480,10 720,40 C960,70 1200,10 1440,40 L1440,80 L0,80 Z"
          fill="url(#divGrad)"
        />
        <defs>
          <linearGradient id="divGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#0a0a0a" />
            <stop offset="30%" stopColor="#111111" />
            <stop offset="50%" stopColor="#0d0d0d" />
            <stop offset="70%" stopColor="#111111" />
            <stop offset="100%" stopColor="#0a0a0a" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
