import { auth, signIn, signOut } from "@/shared/lib/auth";

export default async function HomePage() {
  const session = await auth();

  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-4">
      <p className="text-[var(--color-text-secondary)] text-sm">
        matchIQ — {session ? `signed in as ${session.user?.name}` : "not signed in"}
      </p>

      {session ? (
        <form
          action={async () => {
            "use server";
            await signOut();
          }}
        >
          <button className="glass px-4 py-2 text-sm text-[var(--color-text-primary)]">
            Sign out
          </button>
        </form>
      ) : (
        <form
          action={async () => {
            "use server";
            await signIn("google");
          }}
        >
          <button className="glass px-4 py-2 text-sm text-[var(--color-text-primary)]">
            Sign in with Google
          </button>
        </form>
      )}
    </main>
  );
}