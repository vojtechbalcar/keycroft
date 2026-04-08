import type { GuestProgress } from '@/lib/storage/guest-progress'
import {
  hasMeaningfulProgress,
  mergeProgressSnapshots,
  type PersistedProgressSnapshot,
} from '@/lib/storage/server-progress'

export type GuestUpgradeStore = {
  getLinkedUserId: (guestProfileId: string) => Promise<string | null>
  readUserProgress: (userId: string) => Promise<PersistedProgressSnapshot | null>
  writeUserProgress: (input: {
    userId: string
    guestProfileId: string
    progress: PersistedProgressSnapshot
  }) => Promise<PersistedProgressSnapshot>
}

export type GuestUpgradeResult =
  | {
      status: 'upgraded'
      progress: PersistedProgressSnapshot
    }
  | {
      status: 'already-linked'
      progress: PersistedProgressSnapshot | null
    }
  | {
      status: 'skipped-empty'
      progress: PersistedProgressSnapshot | null
    }

type UpgradeGuestToAccountInput = {
  store: GuestUpgradeStore
  userId: string
  guestProfileId: string
  guestProgress: GuestProgress
}

export async function upgradeGuestToAccount({
  store,
  userId,
  guestProfileId,
  guestProgress,
}: UpgradeGuestToAccountInput): Promise<GuestUpgradeResult> {
  const linkedUserId = await store.getLinkedUserId(guestProfileId)

  if (linkedUserId !== null) {
    if (linkedUserId !== userId) {
      throw new Error('Guest profile is already linked to a different account.')
    }

    return {
      status: 'already-linked',
      progress: await store.readUserProgress(userId),
    }
  }

  if (!hasMeaningfulProgress(guestProgress)) {
    return {
      status: 'skipped-empty',
      progress: await store.readUserProgress(userId),
    }
  }

  const existingProgress = await store.readUserProgress(userId)
  const mergedProgress = mergeProgressSnapshots(existingProgress, guestProgress)

  return {
    status: 'upgraded',
    progress: await store.writeUserProgress({
      userId,
      guestProfileId,
      progress: mergedProgress,
    }),
  }
}
