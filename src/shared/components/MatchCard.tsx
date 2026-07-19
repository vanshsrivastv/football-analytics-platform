import { TeamCrest } from "./TeamCrest";
import { ScoreDisplay } from "./ScoreDisplay";
import { ProbabilityBar } from "./ProbabilityBar";

type MatchCardProps = {
  competitionLabel: string;
  homeTeamName: string;
  awayTeamName: string;
  homeCrestUrl?: string | null;
  awayCrestUrl?: string | null;
  homeScore?: number | null;
  awayScore?: number | null;
  probability?: { home: number; draw: number; away: number };
};

export function MatchCard({
  competitionLabel,
  homeTeamName,
  awayTeamName,
  homeCrestUrl,
  awayCrestUrl,
  homeScore,
  awayScore,
  probability,
}: MatchCardProps) {
  return (
    <div className="glass p-4 w-full max-w-sm">
      <div className="text-[10.5px] text-[var(--color-text-muted)] mb-2.5">
        {competitionLabel}
      </div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex flex-col items-center gap-2 w-20">
          <TeamCrest crestUrl={homeCrestUrl} />
          <span className="text-[13px] text-[var(--color-text-primary)]">{homeTeamName}</span>
        </div>
        <ScoreDisplay homeScore={homeScore} awayScore={awayScore} />
        <div className="flex flex-col items-center gap-2 w-20">
          <TeamCrest crestUrl={awayCrestUrl} />
          <span className="text-[13px] text-[var(--color-text-primary)]">{awayTeamName}</span>
        </div>
      </div>
      {probability && <ProbabilityBar {...probability} />}
    </div>
  );
}