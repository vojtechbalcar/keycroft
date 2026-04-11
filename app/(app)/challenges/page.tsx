export const metadata = {
  title: 'Challenges — Keycroft',
  description: 'Asynchronous typing challenges with friends.',
}

export default function ChallengesPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <div
        className="rounded-2xl px-8 py-14 text-center"
        style={{
          background: '#faf7f0',
          border: '1px solid #d8cfbc',
        }}
      >
        <div
          className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full text-2xl"
          style={{
            background: '#e8f0e4',
            border: '2px solid #c8b890',
          }}
        >
          📜
        </div>

        <p
          className="mb-1 text-[10px] uppercase tracking-[0.3em]"
          style={{ color: '#8a7a5a' }}
        >
          Coming soon
        </p>

        <h1 className="mb-3 text-2xl font-bold" style={{ color: '#1c2e1e' }}>
          Challenges
        </h1>

        <p
          className="mx-auto max-w-md text-sm leading-7"
          style={{ color: '#5a6a5e' }}
        >
          Asynchronous challenges are on the horizon. You will be able to send
          a challenge to a friend, let them complete it in their own time, and
          compare results — no scheduling, no live pressure.
        </p>

        <p
          className="mt-6 text-xs"
          style={{ color: '#8a7a5a' }}
        >
          Focus on your own craft for now. The leaderboard will be waiting.
        </p>
      </div>
    </main>
  )
}
