import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { VillageStageBackdrop } from '@/components/world/village-stage-backdrop'

describe('VillageStageBackdrop', () => {
  it('renders the active village stage as a non-interactive backdrop', () => {
    const { container } = render(
      <VillageStageBackdrop villageId="meadow-farm" mastery={85} />,
    )

    const image = container.querySelector('img')

    expect(image).not.toBeNull()
    expect(image).toHaveAttribute('src', '/images/village_1/village_1_stage_6.png')
    expect(image).toHaveAttribute('draggable', 'false')
    expect(image).toHaveStyle({
      pointerEvents: 'none',
      userSelect: 'none',
    })

    const dragStart = new Event('dragstart', { bubbles: true, cancelable: true })
    image?.dispatchEvent(dragStart)

    expect(dragStart.defaultPrevented).toBe(true)
  })
})
