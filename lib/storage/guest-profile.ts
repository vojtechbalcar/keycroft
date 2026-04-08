export type StorageLike = {
  getItem: (key: string) => string | null
  setItem: (key: string, value: string) => void
  removeItem: (key: string) => void
}

export type GuestProfile = {
  id: string
  createdAt: string
  updatedAt: string
}

type EnsureGuestProfileOptions = {
  now?: () => string
  createId?: () => string
}

export const guestProfileStorageKey = 'keycroft.guest.profile'

export function readGuestProfile(storage: StorageLike): GuestProfile | null {
  const raw = storage.getItem(guestProfileStorageKey)
  if (!raw) return null
  return JSON.parse(raw) as GuestProfile
}

export function saveGuestProfile(storage: StorageLike, profile: GuestProfile): void {
  storage.setItem(guestProfileStorageKey, JSON.stringify(profile))
}

export function ensureGuestProfile(
  storage: StorageLike,
  options: EnsureGuestProfileOptions = {},
): GuestProfile {
  const existing = readGuestProfile(storage)
  if (existing) return existing

  const now = options.now?.() ?? new Date().toISOString()
  const id =
    options.createId?.() ??
    (typeof crypto !== 'undefined' ? crypto.randomUUID() : `guest-${now}`)

  const profile: GuestProfile = { id, createdAt: now, updatedAt: now }
  saveGuestProfile(storage, profile)
  return profile
}
