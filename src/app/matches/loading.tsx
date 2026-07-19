export default function MatchesLoading() {
  return (
    <main className="min-h-screen p-8">
      <div className="h-5 w-24 bg-white/10 rounded animate-pulse mb-4" />
      <div className="flex gap-5 mb-6">
        <div className="h-4 w-12 bg-white/10 rounded animate-pulse" />
        <div className="h-4 w-16 bg-white/10 rounded animate-pulse" />
        <div className="h-4 w-16 bg-white/10 rounded animate-pulse" />
      </div>
      <div className="flex flex-wrap gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="glass p-4 w-full max-w-sm h-40 animate-pulse" />
        ))}
      </div>
    </main>
  );
}