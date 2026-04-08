'use client'

import {
  ensureGuestProfile,
  readGuestProfile,
  type StorageLike,
} from '@/lib/storage/guest-profile'
import {
  readGuestProgress,
  saveGuestProgress,
  type GuestProgress,
} from '@/lib/storage/guest-progress'

function hasLocalProgress(progress: GuestProgress): boolean {
  return (
    progress.placement !== null ||
    progress.completedChapterIds.length > 0 ||
    progress.recentSessions.length > 0 ||
    progress.events.length > 0
  )
}

async function readServerProgress(): Promise<GuestProgress | null> {
  const response = await fetch('/api/progress', {
    cache: 'no-store',
  })

  if (!response.ok) {
    return null
  }

  const data = (await response.json()) as { progress?: GuestProgress | null }
  return data.progress ?? null
}

export async function resolveProgressSnapshot(
  storage: StorageLike,
  signedIn: boolean,
): Promise<GuestProgress> {
  ensureGuestProfile(storage)
  const localProgress = readGuestProgress(storage)

  if (!signedIn) {
    return localProgress
  }

  if (hasLocalProgress(localProgress)) {
    const guestProfile = readGuestProfile(storage)

    if (guestProfile !== null) {
      const response = await fetch('/api/progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          guestProfileId: guestProfile.id,
          progress: localProgress,
        }),
      })

      if (response.ok) {
        const data = (await response.json()) as { progress?: GuestProgress | null }

        if (data.progress) {
          saveGuestProgress(storage, data.progress)
          return data.progress
        }
      }
    }
  }

  const serverProgress = await readServerProgress()

  if (serverProgress !== null) {
    saveGuestProgress(storage, serverProgress)
    return serverProgress
  }

  return localProgress
}

export async function syncProgressAfterLocalWrite(
  storage: StorageLike,
  signedIn: boolean,
): Promise<GuestProgress | null> {
  if (!signedIn) {
    return null
  }

  const guestProfile = readGuestProfile(storage)

  if (guestProfile === null) {
    return null
  }

  const progress = readGuestProgress(storage)
  const response = await fetch('/api/progress', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      guestProfileId: guestProfile.id,
      progress,
    }),
  })

  if (!response.ok) {
    return null
  }

  const data = (await response.json()) as { progress?: GuestProgress | null }

  if (data.progress) {
    saveGuestProgress(storage, data.progress)
    return data.progress
  }

  return null
}
