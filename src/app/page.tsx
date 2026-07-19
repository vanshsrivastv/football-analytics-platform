import { auth, signIn, signOut } from "@/shared/lib/auth";
import { prisma } from "@/shared/lib/prisma";
import { Hero } from "@/features/marketing/components/Hero";

export default async function HomePage() {
  const session = await auth();
  const predictionCount = await prisma.prediction.count();

  return (
    <main className="min-h-screen">
      <nav className="flex justify-between items-center p-6 max-w-5xl mx-auto">
        <span className="text-sm text-[var(--color-text-primary)] font-medium">matchIQ</span>
        {session ? (
          <form action={async () => { "use server"; await signOut(); }}>
            <button className="text-xs text-[var(--color-text-secondary)]">
              Sign out
            </button>
          </form>
        ) : (
          <form action={async () => { "use server"; await signIn("google"); }}>
            <button className="text-xs text-[var(--color-text-secondary)]">
              Sign in
            </button>
          </form>
        )}
      </nav>

      <Hero predictionCount={predictionCount} />
    </main>
  );
}