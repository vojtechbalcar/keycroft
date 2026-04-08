import { vi } from 'vitest'

export const routerSpies = {
  push: vi.fn(),
  replace: vi.fn(),
  back: vi.fn(),
}

let pathname = '/'
let params: Record<string, string> = {}

export function resetNavigationMocks() {
  routerSpies.push.mockReset()
  routerSpies.replace.mockReset()
  routerSpies.back.mockReset()
  pathname = '/'
  params = {}
}

export function setMockPathname(value: string) {
  pathname = value
}

export function setMockParams(value: Record<string, string>) {
  params = value
}

export const usePathname = () => pathname
export const useRouter = () => routerSpies
export const useSearchParams = () => new URLSearchParams()
export const useParams = () => params
