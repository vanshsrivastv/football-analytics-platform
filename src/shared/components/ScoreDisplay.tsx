type ScoreDisplayProps = {
  homeScore?: number | null;
  awayScore?: number | null;
};

export function ScoreDisplay({ homeScore, awayScore }: ScoreDisplayProps) {
  const hasScore = homeScore !== null && homeScore !== undefined;

  return (
    <div className="font-mono text-2xl text-[var(--color-text-primary)]">
      {hasScore ? `${homeScore} – ${awayScore}` : "vs"}
    </div>
  );
}