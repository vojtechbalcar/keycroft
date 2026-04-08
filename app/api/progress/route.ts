import { auth } from '@/auth'
import { upgradeGuestToAccount } from '@/lib/auth/guest-upgrade'
import {
  getLinkedUserId,
  readUserProgress,
  writeUserProgress,
} from '@/lib/storage/server-progress'
import type { GuestProgress } from '@/lib/storage/guest-progress'

export const dynamic = 'force-dynamic'

export const GET = auth(async (request) => {
  const userId = request.auth?.user?.id

  if (!userId) {
    return Response.json({ progress: null }, { status: 401 })
  }

  const progress = await readUserProgress(userId)

  return Response.json({ progress })
})

export const POST = auth(async (request) => {
  const userId = request.auth?.user?.id

  if (!userId) {
    return Response.json({ progress: null }, { status: 401 })
  }

  const body = (await request.json()) as {
    guestProfileId?: unknown
    progress?: GuestProgress
  }

  if (typeof body.guestProfileId !== 'string' || !body.progress) {
    return Response.json(
      { message: 'guestProfileId and progress are required.' },
      { status: 400 },
    )
  }

  const result = await upgradeGuestToAccount({
    store: {
      getLinkedUserId,
      readUserProgress,
      writeUserProgress,
    },
    userId,
    guestProfileId: body.guestProfileId,
    guestProgress: body.progress,
  })

  return Response.json(result)
})
