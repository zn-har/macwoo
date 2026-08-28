// Viewport helpers.
//
// The pages used to initialise `isMobile` to `false` and only correct it in
// `onMounted`. That meant a phone was served the full desktop markup (400vh
// scroll tracks, sticky pins, every scroll-driven inline style) and then
// re-rendered the whole page tree immediately after hydration — a large VDOM
// patch plus relayout plus CLS, on the slowest devices.
//
// Seeding the state from the request User-Agent means phones get mobile markup
// straight out of SSR. The client still verifies against the real viewport
// width on mount, so the value is never wrong, only occasionally corrected on
// odd form factors (Android tablets).
const PHONE_UA = /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini|Windows Phone/i
const TABLET_UA = /iPad|Tablet|PlayBook|Silk|Kindle/i

export function useIsMobile(breakpoint = 768) {
  const isMobile = useState<boolean>(`viewport-mobile-${breakpoint}`, () => {
    if (import.meta.client) return window.innerWidth < breakpoint

    const ua = useRequestHeaders(['user-agent'])['user-agent'] || ''
    if (PHONE_UA.test(ua)) return true
    // Tablets sit above 768 but below the 1024 "desktop interaction" gate.
    return breakpoint >= 1024 && TABLET_UA.test(ua)
  })

  if (import.meta.client) {
    const sync = () => {
      isMobile.value = window.innerWidth < breakpoint
    }
    onMounted(() => {
      sync()
      window.addEventListener('resize', sync, { passive: true })
    })
    onBeforeUnmount(() => window.removeEventListener('resize', sync))
  }

  return isMobile
}

// True only for a real mouse on a desktop-sized viewport. Deliberately starts
// `false` (including during SSR) so anything gated on it — the magnifying
// cursor above all — never loads its chunk on a touch device.
export function useDesktopPointer() {
  const isDesktopPointer = ref(false)

  if (import.meta.client) {
    const sync = () => {
      isDesktopPointer.value
        = window.matchMedia('(hover: hover) and (pointer: fine)').matches
          && window.innerWidth >= 1024
    }
    onMounted(() => {
      sync()
      window.addEventListener('resize', sync, { passive: true })
    })
    onBeforeUnmount(() => window.removeEventListener('resize', sync))
  }

  return isDesktopPointer
}
