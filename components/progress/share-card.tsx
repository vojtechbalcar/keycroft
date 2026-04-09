'use client'

import { useState } from 'react'

import type { ShareCardModel } from '@/lib/analytics/build-share-card'

type ShareCardProps = {
  card: ShareCardModel
}

function formatShareText(card: ShareCardModel) {
  return [
    card.headline,
    card.subheadline,
    ...card.highlights.map((highlight) => `${highlight.label}: ${highlight.value}`),
    card.footer,
  ].join('\n')
}

export function ShareCard({ card }: ShareCardProps) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(formatShareText(card))
      setCopied(true)
      window.setTimeout(() => {
        setCopied(false)
      }, 1600)
    } catch {
      setCopied(false)
    }
  }

  return (
    <section
      className="rounded-[var(--kc-radius-card)] border p-5"
      style={{ borderColor: 'var(--kc-line-light)', background: 'var(--kc-surface)' }}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p
            className="text-[10px] uppercase tracking-[0.2em]"
            style={{ color: 'var(--kc-on-surface-muted)' }}
          >
            Shareable Progress Card
          </p>
          <h2 className="mt-1 text-xl font-semibold" style={{ color: 'var(--kc-on-surface)' }}>
            A compact story you can reuse elsewhere
          </h2>
        </div>

        <button
          type="button"
          className="rounded-full border px-4 py-2 text-sm font-medium"
          style={{
            borderColor: 'var(--kc-line-light)',
            color: 'var(--kc-on-surface)',
            background: 'rgba(255,255,255,0.55)',
          }}
          onClick={handleCopy}
        >
          Copy progress blurb
        </button>
      </div>

      <article
        className="mt-5 overflow-hidden rounded-[24px] border"
        style={{
          borderColor: 'rgba(58,114,48,0.18)',
          background:
            'radial-gradient(circle at top left, rgba(196,155,60,0.18), transparent 30%), linear-gradient(180deg, #214328 0%, #19321f 100%)',
          color: '#fffaf0',
        }}
      >
        <div className="p-6">
          <p className="text-[10px] uppercase tracking-[0.2em]" style={{ color: 'rgba(255,250,240,0.68)' }}>
            Keycroft Progress
          </p>
          <h3 className="mt-3 max-w-lg text-2xl font-semibold leading-tight">
            {card.headline}
          </h3>
          <p className="mt-3 max-w-xl text-sm leading-6" style={{ color: 'rgba(255,250,240,0.82)' }}>
            {card.subheadline}
          </p>

          <dl className="mt-5 grid gap-3 md:grid-cols-3">
            {card.highlights.map((highlight) => (
              <div
                key={highlight.label}
                className="rounded-[18px] border px-4 py-4"
                style={{
                  borderColor: 'rgba(255,250,240,0.12)',
                  background: 'rgba(255,250,240,0.08)',
                }}
              >
                <dt className="text-[10px] uppercase tracking-[0.16em]" style={{ color: 'rgba(255,250,240,0.68)' }}>
                  {highlight.label}
                </dt>
                <dd className="mt-2 text-xl font-semibold">{highlight.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <footer
          className="flex items-center justify-between gap-4 border-t px-6 py-4"
          style={{
            borderTopColor: 'rgba(255,250,240,0.12)',
            background: 'rgba(0,0,0,0.12)',
          }}
        >
          <p className="text-sm" style={{ color: 'rgba(255,250,240,0.82)' }}>
            {card.footer}
          </p>
          <p
            aria-live="polite"
            className="text-sm"
            style={{ color: copied ? '#dcefcf' : 'rgba(255,250,240,0.68)' }}
          >
            {copied ? 'Copied' : 'Ready to reuse'}
          </p>
        </footer>
      </article>
    </section>
  )
}
