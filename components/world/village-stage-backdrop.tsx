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
    <>
      <img
        alt=""
        aria-hidden="true"
        src={art.imagePath}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center',
          imageRendering: 'pixelated',
        }}
      />

      <div
        style={{
          position: 'absolute',
          left: `${art.labelPosition.x}%`,
          top: `${art.labelPosition.y}%`,
          zIndex: 18,
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
        }}
      >
        <div
          style={{
            background: 'rgba(42,52,58,0.94)',
            border: '1px solid rgba(84,103,109,0.92)',
            boxShadow:
              '0 1px 0 rgba(255,255,255,0.08) inset, 0 4px 0 rgba(0,0,0,0.35)',
            color: '#f8fbff',
            fontSize: '0.78rem',
            fontWeight: 700,
            letterSpacing: '0.03em',
            lineHeight: 1,
            padding: '0.38rem 0.7rem 0.42rem',
            whiteSpace: 'nowrap',
          }}
        >
          {art.label}
        </div>
      </div>
    </>
  )
}
