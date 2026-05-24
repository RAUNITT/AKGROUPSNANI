interface SectionDividerProps {
  accentLine?: boolean;
}

export function SectionDivider({ accentLine = false }: SectionDividerProps) {
  if (!accentLine) return null;
  return (
    <div className="w-full h-px bg-white/[0.05]" />
  );
}
