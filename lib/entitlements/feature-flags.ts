/**
 * Feature flag system for gating premium and experimental features.
 * All flags default to false (disabled) unless explicitly enabled.
 */

export type FeatureFlag =
  | 'premium-history-chart'
  | 'premium-keyboard-heatmap'
  | 'premium-monthly-reflection'
  | 'premium-share-card'
  | 'social-friends'
  | 'social-challenges'
  | 'extended-chapter-path'

export type Plan = 'free' | 'premium'

export type FeatureFlagContext = {
  plan: Plan
  /** Overrides applied in tests or preview environments. */
  overrides?: Partial<Record<FeatureFlag, boolean>>
}

const PREMIUM_FLAGS: ReadonlySet<FeatureFlag> = new Set([
  'premium-history-chart',
  'premium-keyboard-heatmap',
  'premium-monthly-reflection',
  'premium-share-card',
  'social-friends',
  'social-challenges',
  'extended-chapter-path',
])

/**
 * Returns true if the given feature flag is enabled for the provided context.
 *
 * @example
 * const enabled = isEnabled('premium-share-card', { plan: 'free' })
 * // → false
 *
 * const enabled = isEnabled('premium-share-card', { plan: 'premium' })
 * // → true
 */
export function isEnabled(flag: FeatureFlag, ctx: FeatureFlagContext): boolean {
  if (ctx.overrides && Object.prototype.hasOwnProperty.call(ctx.overrides, flag)) {
    return ctx.overrides[flag] ?? false
  }

  if (PREMIUM_FLAGS.has(flag) && ctx.plan !== 'premium') {
    return false
  }

  return true
}

/**
 * Returns a record of all flags and their resolved state for a given context.
 * Useful for passing resolved flags into client components as props.
 */
export function resolveAllFlags(ctx: FeatureFlagContext): Record<FeatureFlag, boolean> {
  const allFlags: FeatureFlag[] = [
    'premium-history-chart',
    'premium-keyboard-heatmap',
    'premium-monthly-reflection',
    'premium-share-card',
    'social-friends',
    'social-challenges',
    'extended-chapter-path',
  ]

  return Object.fromEntries(
    allFlags.map((flag) => [flag, isEnabled(flag, ctx)]),
  ) as Record<FeatureFlag, boolean>
}
