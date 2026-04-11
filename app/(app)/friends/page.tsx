export const metadata = {
  title: 'Friends — Keycroft',
  description: 'Connect with friends and compare your typing progress.',
}

export default function FriendsPage() {
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
          🌿
        </div>

        <p
          className="mb-1 text-[10px] uppercase tracking-[0.3em]"
          style={{ color: '#8a7a5a' }}
        >
          Coming soon
        </p>

        <h1 className="mb-3 text-2xl font-bold" style={{ color: '#1c2e1e' }}>
          Friends
        </h1>

        <p
          className="mx-auto max-w-md text-sm leading-7"
          style={{ color: '#5a6a5e' }}
        >
          The friend system is on its way. Soon you will be able to see how your
          village compares to the scribes in your circle — and issue quiet,
          asynchronous typing challenges.
        </p>

        <p
          className="mt-6 text-xs"
          style={{ color: '#8a7a5a' }}
        >
          For now, keep building. Your village remembers every session.
        </p>
      </div>
    </main>
  )
}
