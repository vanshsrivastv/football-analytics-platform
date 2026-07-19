export default function MatchDetailLoading() {
  return (
    <main className="min-h-screen p-8 max-w-md mx-auto">
      <div className="h-3 w-32 bg-white/10 rounded animate-pulse mb-4" />
      <div className="flex items-center justify-between mb-8">
        <div className="w-24 h-24 bg-white/10 rounded-full animate-pulse" />
        <div className="w-16 h-8 bg-white/10 rounded animate-pulse" />
        <div className="w-24 h-24 bg-white/10 rounded-full animate-pulse" />
      </div>
      <div className="glass p-4 h-24 animate-pulse mb-8" />
    </main>
  );
}