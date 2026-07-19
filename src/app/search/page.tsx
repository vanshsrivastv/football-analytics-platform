"use client";
 
import { useState, useEffect } from "react";
import Link from "next/link";
import { TeamCrest } from "@/shared/components/TeamCrest";
 
type Team = { id: string; name: string; crestUrl: string | null };
 
export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [teams, setTeams] = useState<Team[]>([]);
 
  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (query.trim().length < 2) {
        setTeams([]);
        return;
      }
 
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      const result = await response.json();
      setTeams(result.data.teams);
    }, 300);
 
    return () => clearTimeout(timeoutId);
  }, [query]);
 
  return (
    <main className="min-h-screen p-8 max-w-md mx-auto">
      <input
        autoFocus
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search teams..."
        className="glass w-full p-3 text-sm text-[var(--color-text-primary)] mb-4 outline-none"
      />
 
      <div className="flex flex-col gap-2">
        {teams.map((team) => (
          <Link
            key={team.id}
            href={`/matches?team=${team.id}`}
            className="glass p-3 flex items-center gap-3"
          >
            <TeamCrest crestUrl={team.crestUrl} size="sm" />
            <span className="text-sm text-[var(--color-text-primary)]">{team.name}</span>
          </Link>
        ))}
      </div>
    </main>
  );
}
 