import type { VillageId } from '@/lib/world/village-definitions'
import { getVillageStageArt } from '@/lib/world/village-stage-art'

type VillageStageBackdropProps = {
  villageId: VillageId
  mastery: number
}

export function VillageStageBackdrop({
  villageId,
  mastery,
}: VillageStageBackdropProps) {
  const art = getVillageStageArt(villageId, mastery)

  if (!art) {
    return null
  }

  return (
    <img
      alt=""
      aria-hidden="true"
      draggable={false}
      src={art.imagePath}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        objectPosition: 'center',
        imageRendering: 'pixelated',
        pointerEvents: 'none',
        userSelect: 'none',
        WebkitUserDrag: 'none',
      }}
    />
  )
}
