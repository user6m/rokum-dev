import { signIn, signOut, useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import Head from "next/head";

const Kanban = dynamic(() => import("../src/components/Kanban"), {
  ssr: false,
});

export default function Home() {
  const { data: session } = useSession();

  return (
    <div style={{ fontFamily: "sans-serif", padding: 20 }}>
      <Head>
        <title>rokum.dev — Kanban</title>
      </Head>
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1>rokum.dev</h1>
        <div>
          {session ? (
            <>
              <span style={{ marginRight: 12 }}>{session.user?.email}</span>
              <button onClick={() => signOut()}>Sign out</button>
            </>
          ) : (
            <button onClick={() => signIn("google")}>
              Sign in with Google
            </button>
          )}
        </div>
      </header>

      <main style={{ marginTop: 20 }}>
        {session ? (
          <Kanban session={session} />
        ) : (
          <p>
            Please sign in with an allowed Google account to access your kanban.
          </p>
        )}
      </main>
    </div>
  );
}

