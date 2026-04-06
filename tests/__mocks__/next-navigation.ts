export const usePathname = () => '/'
export const useRouter = () => ({
  push: () => undefined,
  replace: () => undefined,
  back: () => undefined,
})
export const useSearchParams = () => new URLSearchParams()
