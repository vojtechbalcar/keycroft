import { PrimaryButton } from '@/components/shared/primary-button'

type OpeningSceneProps = {
  onBegin: () => void
}

export function OpeningScene({ onBegin }: OpeningSceneProps) {
  return (
    <section className="space-y-6 rounded-[36px] border border-[var(--kc-line)] bg-[var(--kc-surface)] p-8 shadow-[0_18px_50px_rgba(58,45,30,0.10)] md:p-10">
      <div className="space-y-2">
        <p className="text-sm uppercase tracking-[0.18em] text-[var(--kc-muted-dark)]">
          First arrival
        </p>
        <h1 className="text-4xl tracking-tight text-[var(--kc-text-dark)]">
          We will place you from one short typing sample.
        </h1>
        <p className="max-w-2xl text-base leading-7 text-[var(--kc-muted-dark)]">
          This opening pass should take less than a minute. Type one line,
          choose how familiar touch typing already feels, and Keycroft will
          place you into a starting path.
        </p>
      </div>
      <PrimaryButton onClick={onBegin}>Begin placement</PrimaryButton>
    </section>
  )
}
