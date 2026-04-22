import { auth } from '@/auth'
import type { ChapterId } from '@/lib/map/chapter-definitions'
import { computeBossScore, isBossWon } from '@/lib/map/boss-rules'
import { computeBossGold, computeRareDrop } from '@/lib/resources/resource-rules'
import { applySkillsToBossScore } from '@/lib/skills/skill-effects'
import { recordBossAttempt, readRpgProgress } from '@/lib/storage/rpg-progress'

export const POST = auth(async (request) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userId = (request as any).auth?.user?.id
  if (!userId) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json() as {
    chapterId: ChapterId
    nodeId: string
    wpm: number
    accuracy: number
  }

  const { chapterId, nodeId, wpm, accuracy } = body
  if (!chapterId || !nodeId || wpm == null || accuracy == null) {
    return Response.json({ error: 'Missing fields' }, { status: 400 })
  }

  const progress = await readRpgProgress(userId)

  const score = applySkillsToBossScore(wpm, accuracy, progress.unlockedSkills)
  const won = isBossWon(score, chapterId)

  const goldEarned = computeBossGold(won)
  const rareDrop = computeRareDrop(won, chapterId)

  const isFirstChapterClear = won && !progress.clearedChapterIds.has(chapterId)
  const skillPointsEarned = isFirstChapterClear ? 1 : 0

  await recordBossAttempt(userId, chapterId, nodeId, won, goldEarned, rareDrop, score, skillPointsEarned)

  return Response.json({ won, score, goldEarned, rareDrop, skillPointsEarned })
})
