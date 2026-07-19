type ProbabilityBarProps = {
  home: number;
  draw: number;
  away: number;
};

export function ProbabilityBar({ home, draw, away }: ProbabilityBarProps) {
  return (
    <div>
      <div className="flex justify-between font-mono text-[10px] text-[var(--color-text-secondary)] mb-1.5">
        <span>HOME {home}%</span>
        <span>DRAW {draw}%</span>
        <span>AWAY {away}%</span>
      </div>
      <div className="flex h-1.5 rounded-full overflow-hidden bg-white/10">
        <div style={{ width: `${home}%` }} className="bg-gradient-to-r from-[var(--color-accent-deep)] to-[var(--color-accent)]" />
        <div style={{ width: `${draw}%` }} className="bg-white/20" />
        <div style={{ width: `${away}%` }} className="bg-white/10" />
      </div>
    </div>
  );
}