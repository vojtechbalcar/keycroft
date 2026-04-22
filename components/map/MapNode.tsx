import Link from 'next/link'
import type { NodeDefinition } from '@/lib/map/chapter-definitions'

type Props = {
  node: NodeDefinition
  chapterId: string
  cleared: boolean
  locked: boolean
}

export function MapNode({ node, chapterId, cleared, locked }: Props) {
  const href =
    node.type === 'boss'
      ? `/map/${chapterId}/boss`
      : `/map/${chapterId}#${node.id}`

  const base =
    'flex flex-col items-center gap-1 p-3 rounded-lg border text-sm font-medium transition-colors'
  const style = locked
    ? `${base} border-neutral-700 bg-neutral-900 text-neutral-500 cursor-not-allowed`
    : cleared
      ? `${base} border-emerald-700 bg-emerald-950 text-emerald-300`
      : `${base} border-neutral-600 bg-neutral-800 text-neutral-100 hover:bg-neutral-700`

  if (locked) {
    return (
      <div className={style}>
        <span>{node.type === 'boss' ? '💀' : '📜'}</span>
        <span>{node.title}</span>
        <span className="text-xs text-neutral-600">Locked</span>
      </div>
    )
  }

  return (
    <Link href={href} className={style}>
      <span>{node.type === 'boss' ? '💀' : cleared ? '✓' : '📜'}</span>
      <span>{node.title}</span>
      {cleared && <span className="text-xs">Cleared</span>}
    </Link>
  )
}
