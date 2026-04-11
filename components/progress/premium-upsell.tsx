type PremiumUpsellProps = {
  /** Short description of what the user is missing. */
  feature: string
  /** Optional longer explanation shown below the feature name. */
  description?: string
}

/**
 * A minimal, non-aggressive upsell banner shown when a free user tries
 * to access a premium feature. Uses the Keycroft cream/amber palette.
 */
export function PremiumUpsell({ feature, description }: PremiumUpsellProps) {
  return (
    <aside
      role="complementary"
      aria-label="Premium feature"
      className="rounded-xl p-5"
      style={{
        background: '#faf7f0',
        border: '1px solid #d4a850',
      }}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p
            className="mb-0.5 text-[10px] uppercase tracking-[0.25em]"
            style={{ color: '#8a7a5a' }}
          >
            Premium feature
          </p>
          <p className="font-semibold" style={{ color: '#1c2e1e' }}>
            {feature}
          </p>
          {description && (
            <p className="mt-1 text-sm leading-6" style={{ color: '#5a6a5e' }}>
              {description}
            </p>
          )}
        </div>

        <a
          href="/settings"
          className="inline-block shrink-0 self-start rounded-lg px-4 py-2 text-xs font-bold uppercase tracking-wider text-white transition hover:opacity-90"
          style={{
            background: '#d4a850',
          }}
        >
          Upgrade
        </a>
      </div>
    </aside>
  )
}
