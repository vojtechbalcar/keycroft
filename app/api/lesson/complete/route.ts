import { auth } from '@/auth'
import { getChapterDefinition, type ChapterId } from '@/lib/map/chapter-definitions'
import { computeLessonGold } from '@/lib/resources/resource-rules'
import { applySkillsToLessonGold } from '@/lib/skills/skill-effects'
import { awardLessonGold, readRpgProgress } from '@/lib/storage/rpg-progress'

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

  getChapterDefinition(chapterId) // throws if invalid chapter

  const progress = await readRpgProgress(userId)
  const isFirstClear = !progress.clearedNodeIds.has(nodeId)

  const baseGold = computeLessonGold(wpm, accuracy, isFirstClear)
  const goldEarned = applySkillsToLessonGold(baseGold, progress.unlockedSkills)

  await awardLessonGold(userId, nodeId, chapterId, goldEarned)

  return Response.json({ goldEarned, isFirstClear })
})
