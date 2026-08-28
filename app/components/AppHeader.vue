<script setup lang="ts">
const isMenuOpen = ref(false)
const isServicesOpen = ref(false)
const isMobileServicesOpen = ref(false)
const scrollProgress = ref(0)

// ── Sliding glass pill state ──
const navLinksRef = ref<HTMLElement | null>(null)
const glassLeft = ref(0)
const glassWidth = ref(0)
const glassOpacity = ref(0)
const isHovering = ref(false)

const services = [
  { label: 'Branding & Design', to: '/services/branding-design' },
  { label: 'Digital Marketing', to: '/services/digital-marketing' },
  { label: 'Video Production', to: '/services/video-production' }
]

const route = useRoute()
const isPathActive = (path: string) => {
  if (path === '/') return route.path === '/'
  if (path.startsWith('/services')) return route.path.startsWith('/services')
  return route.path.startsWith(path)
}

// Move glass pill to hovered element
const moveGlassTo = (event: MouseEvent) => {
  const target = event.currentTarget as HTMLElement
  const container = navLinksRef.value
  if (!target || !container) return

  const containerRect = container.getBoundingClientRect()
  const targetRect = target.getBoundingClientRect()

  glassLeft.value = targetRect.left - containerRect.left
  glassWidth.value = targetRect.width
  glassOpacity.value = 1
  isHovering.value = true
}

// Snap glass pill to the active item or hide
const resetGlass = () => {
  isHovering.value = false
  // Find the active nav item and snap to it
  nextTick(() => {
    const container = navLinksRef.value
    if (!container) return
    const activeEl = container.querySelector('[data-nav-active="true"]') as HTMLElement
    if (activeEl) {
      const containerRect = container.getBoundingClientRect()
      const activeRect = activeEl.getBoundingClientRect()
      glassLeft.value = activeRect.left - containerRect.left
      glassWidth.value = activeRect.width
      glassOpacity.value = 1
    } else {
      glassOpacity.value = 0
    }
  })
}

let rafId = 0
const onScroll = () => {
  if (rafId) return
  rafId = requestAnimationFrame(() => {
    const maxScroll = 500
    const raw = Math.min(Math.max(window.scrollY / maxScroll, 0), 1)
    // Quantise to 1/40ths. The raw value changed on essentially every scroll
    // frame, and each change re-rendered the whole header (and, on desktop,
    // re-ran a max-width layout pass). 40 steps is imperceptible for an
    // opacity/translate fade but cuts the render count by an order of magnitude.
    const stepped = Math.round(raw * 40) / 40
    if (stepped !== scrollProgress.value) scrollProgress.value = stepped
    rafId = 0
  })
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  // Initialize glass position on active item
  nextTick(() => resetGlass())
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  if (rafId) cancelAnimationFrame(rafId)
})

// Re-position on route change
watch(() => route.path, () => {
  nextTick(() => resetGlass())
})
</script>

<template>
  <header class="fixed left-0 right-0 z-50 top-[24px] w-full pointer-events-none">
    <div class="w-full mx-auto px-8 md:px-16 lg:px-20 pointer-events-auto">
      <div class="flex items-center w-full">
        <!-- ── LOGO (fades out on scroll) ── -->
        <NuxtLink
          to="/"
          class="hidden md:block shrink-0 overflow-hidden"
          :style="{
            opacity: 1 - scrollProgress,
            maxWidth: 150 * (1 - scrollProgress) + 'px',
            transform: 'translateX(' + (-12 * scrollProgress) + 'px)',
            pointerEvents: scrollProgress > 0.8 ? 'none' : 'auto'
          }"
        >
          <NavBarLogo />
        </NuxtLink>

        <!-- Left Spacer -->
        <div class="hidden md:block flex-1" />

        <!-- ═══════════════════════ DESKTOP NAV PILL ═══════════════════════ -->
        <nav
          class="hidden md:flex items-center gap-1 px-2.5 h-[46px] rounded-full shrink-0"
          :style="{
            background: 'linear-gradient(90deg, #2094BA 0%, #2AA4C9 50%, #2095BB 100%)',
            border: '1px solid rgba(255,255,255,0.18)',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.20), 0 4px 24px rgba(0,0,0,0.10)'
          }"
        >
          <!-- ── Nav links wrapper (relative for glass pill) ── -->
          <div
            ref="navLinksRef"
            class="relative flex items-center gap-1"
            @mouseleave="resetGlass"
          >
            <!-- ▓▓ SLIDING GLASS PILL ▓▓ -->
            <div
              class="absolute top-0 h-full rounded-full pointer-events-none z-0 overflow-hidden"
              :style="{
                left: glassLeft + 'px',
                width: glassWidth + 'px',
                opacity: glassOpacity,
                transition: isHovering
                  ? 'left 0.35s cubic-bezier(0.4, 0, 0.2, 1), width 0.35s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.25s ease'
                  : 'left 0.4s cubic-bezier(0.4, 0, 0.2, 1), width 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease',
                background: 'rgba(0,0,0,0.18)',
                border: '1px solid rgba(255,255,255,0.20)',
                backdropFilter: 'blur(40px) saturate(160%)',
                WebkitBackdropFilter: 'blur(40px) saturate(160%)',
                boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.25), inset 0 -1px 1px rgba(255,255,255,0.04), 0 0 0 0.5px rgba(255,255,255,0.10), 0 8px 40px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.10)'
              }"
            >
              <!-- top shine — soft diffused highlight -->
              <div
                class="absolute inset-x-0 top-0 h-[6px] rounded-t-full"
                style="background: linear-gradient(180deg, rgba(255,255,255,0.18) 0%, transparent 100%);"
              />
              <!-- inner refraction glow — primary -->
              <div
                class="absolute inset-0 rounded-full"
                style="background: radial-gradient(ellipse at 50% -30%, rgba(255,255,255,0.22) 0%, transparent 55%);"
              />
              <!-- refraction band — side-lit caustic -->
              <div
                class="absolute inset-0 rounded-full"
                style="background: linear-gradient(135deg, rgba(255,255,255,0.10) 0%, transparent 30%, transparent 70%, rgba(255,255,255,0.06) 100%);"
              />
              <!-- prismatic color shift — subtle rainbow refraction -->
              <div
                class="absolute inset-0 rounded-full opacity-[0.07]"
                style="background: linear-gradient(105deg, rgba(120,180,255,0.8) 0%, rgba(255,255,255,0) 25%, rgba(255,255,255,0) 75%, rgba(255,200,120,0.6) 100%);"
              />
              <!-- bottom reflection bar -->
              <div
                class="absolute inset-x-4 bottom-[2px] h-[1px] rounded-full opacity-35"
                style="background: linear-gradient(90deg, transparent 10%, rgba(255,255,255,0.6) 50%, transparent 90%);"
              />
              <!-- edge light (outer ring glow) -->
              <div
                class="absolute -inset-[0.5px] rounded-full opacity-50 pointer-events-none"
                style="background: transparent; box-shadow: inset 0 0 6px rgba(255,255,255,0.15);"
              />
            </div>

            <!-- Home icon -->
            <NuxtLink
              to="/"
              aria-label="Home"
              :data-nav-active="isPathActive('/')"
              class="relative z-10 flex items-center justify-center w-[44px] h-[38px] rounded-full transition-colors duration-200 group/home"
              @mouseenter="moveGlassTo($event)"
            >
              <svg
                class="w-[18px] h-[18px] text-white transition-transform duration-300 group-hover/home:scale-110"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="1.8"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </NuxtLink>

            <!-- Services (with dropdown) -->
            <div
              class="relative"
              @mouseenter="isServicesOpen = true; moveGlassTo($event)"
              @mouseleave="isServicesOpen = false"
            >
              <NuxtLink
                to="/services/branding-design"
                :data-nav-active="isPathActive('/services')"
                class="relative z-10 flex items-center justify-center px-4 h-[38px] rounded-full text-white text-[16px] font-normal select-none"
                style="font-family: 'Bricolage Grotesque', sans-serif;"
                @mouseenter="moveGlassTo($event)"
              >
                Services
              </NuxtLink>

              <!-- Dropdown -->
              <Transition
                enter-active-class="transition duration-200 ease-out"
                enter-from-class="opacity-0 translate-y-1"
                enter-to-class="opacity-100 translate-y-0"
                leave-active-class="transition duration-150 ease-in"
                leave-from-class="opacity-100 translate-y-0"
                leave-to-class="opacity-0 translate-y-1"
              >
                <div
                  v-if="isServicesOpen"
                  class="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-56 rounded-2xl overflow-hidden z-50 py-1"
                  style="background:rgba(18,40,70,0.85);backdrop-filter:blur(20px) saturate(180%);border:1px solid rgba(255,255,255,0.12);box-shadow:0 16px 48px rgba(0,0,0,0.3),inset 0 1px 0 rgba(255,255,255,0.1);"
                >
                  <NuxtLink
                    v-for="service in services"
                    :key="service.to"
                    :to="service.to"
                    class="flex items-center gap-2 px-4 py-3 text-[15px] text-white/80 hover:text-white hover:bg-white/8 transition-colors border-b border-white/6 last:border-0"
                    style="font-family: 'Bricolage Grotesque', sans-serif;"
                  >
                    {{ service.label }}
                  </NuxtLink>
                </div>
              </Transition>
            </div>

            <!-- Portfolio -->
            <NuxtLink
              to="/portfolio"
              :data-nav-active="isPathActive('/portfolio')"
              class="relative z-10 flex items-center justify-center px-4 h-[38px] rounded-full text-white text-[16px] font-normal select-none"
              style="font-family: 'Bricolage Grotesque', sans-serif;"
              @mouseenter="moveGlassTo($event)"
            >
              Portfolio
            </NuxtLink>

            <!-- Case Studies -->
            <NuxtLink
              to="/case-studies"
              :data-nav-active="isPathActive('/case-studies')"
              class="relative z-10 flex items-center justify-center px-4 h-[38px] rounded-full text-white text-[16px] font-normal select-none"
              style="font-family: 'Bricolage Grotesque', sans-serif;"
              @mouseenter="moveGlassTo($event)"
            >
              Case Studies
            </NuxtLink>

            <!-- About -->
            <NuxtLink
              to="/about"
              :data-nav-active="isPathActive('/about')"
              class="relative z-10 flex items-center justify-center px-4 h-[38px] rounded-full text-white text-[16px] font-normal select-none"
              style="font-family: 'Bricolage Grotesque', sans-serif;"
              @mouseenter="moveGlassTo($event)"
            >
              About
            </NuxtLink>
          </div>

          <!-- ── RIGHT: Get in Touch CTA ── -->
          <NuxtLink
            to="/contact"
            class="shrink-0 flex items-center justify-between pl-5 pr-4 h-[32px] rounded-full bg-white text-black transition-all duration-300 ease-out group/cta ml-1 hover:-translate-y-[1px]"
          >
            <span
              class="relative block overflow-hidden h-[18px] mr-3"
              style="font-family: 'Bricolage Grotesque', sans-serif;"
            >
              <span class="flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover/cta:-translate-y-1/2">
                <span class="font-bold text-[16px] h-[18px] leading-[18px] whitespace-nowrap select-none">
                  Get in Touch
                </span>
                <span class="font-bold text-[16px] h-[18px] leading-[18px] whitespace-nowrap select-none">
                  Get in Touch
                </span>
              </span>
            </span>
            <UpRightArrow
              class="w-[12px] h-[12px] shrink-0 transition-transform duration-300 ease-out group-hover/cta:translate-x-[2px] group-hover/cta:-translate-y-[2px]"
            />
          </NuxtLink>
        </nav>

        <!-- Right Spacer -->
        <div
          class="hidden md:block"
          :style="{
            flexGrow: scrollProgress,
            flexShrink: 1,
            flexBasis: '0%'
          }"
        />

        <!-- ═══════════════════════ MOBILE NAV ═══════════════════════ -->
        <div class="md:hidden flex items-center justify-between w-full">
          <NavBarLogo
            class="shrink-0 transition-opacity duration-300"
            :style="{
              opacity: 1 - scrollProgress,
              pointerEvents: scrollProgress > 0.8 ? 'none' : 'auto'
            }"
          />
          <button
            class="w-12 h-12 rounded-[16px] bg-white flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-transform shrink-0 cursor-pointer"
            aria-label="Toggle menu"
            @click="isMenuOpen = !isMenuOpen"
          >
            <svg
              v-if="!isMenuOpen"
              class="w-[22px] h-[22px] text-[#0596B8]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2.5"
              stroke-linecap="round"
            >
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <svg
              v-else
              class="w-[22px] h-[22px] text-[#0596B8]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2.5"
              stroke-linecap="round"
            >
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Mobile menu panel -->
      <Transition
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="opacity-0 scale-95"
        enter-to-class="opacity-100 scale-100"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="opacity-100 scale-100"
        leave-to-class="opacity-0 scale-95"
      >
        <div
          v-if="isMenuOpen"
          class="md:hidden fixed inset-0 z-[60] bg-white flex flex-col"
        >
          <!-- Close button -->
          <div class="flex justify-end px-8 pt-8 pb-4">
            <button
              class="w-10 h-10 flex items-center justify-center cursor-pointer"
              aria-label="Close menu"
              @click="isMenuOpen = false; isMobileServicesOpen = false"
            >
              <svg
                class="w-7 h-7 text-[#0596B8]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2.5"
                stroke-linecap="round"
              >
                <path d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Menu items -->
          <nav class="flex-1 flex flex-col px-8 overflow-y-auto">
            <!-- Home -->
            <NuxtLink
              to="/"
              class="py-5 text-[#0596B8] text-[22px] font-medium tracking-wide border-b border-[#0596B8]/30"
              style="font-family: 'Bricolage Grotesque', sans-serif;"
              @click="isMenuOpen = false; isMobileServicesOpen = false"
            >
              Home
            </NuxtLink>

            <!-- Services (accordion) -->
            <div class="border-b border-[#0596B8]/30">
              <button
                class="w-full flex items-center justify-between py-5 cursor-pointer"
                @click="isMobileServicesOpen = !isMobileServicesOpen"
              >
                <span
                  class="text-[#0596B8] text-[22px] font-medium tracking-wide"
                  style="font-family: 'Bricolage Grotesque', sans-serif;"
                >
                  Services
                </span>
                <svg
                  class="w-6 h-6 text-[#0596B8] transition-transform duration-300"
                  :class="{ 'rotate-180': isMobileServicesOpen }"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="1.5"
                >
                  <circle cx="12" cy="12" r="9" />
                  <path d="M8 10l4 4 4-4" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </button>
              <!-- Sub-items -->
              <Transition
                enter-active-class="transition-all duration-300 ease-out overflow-hidden"
                enter-from-class="max-h-0 opacity-0"
                enter-to-class="max-h-[200px] opacity-100"
                leave-active-class="transition-all duration-200 ease-in overflow-hidden"
                leave-from-class="max-h-[200px] opacity-100"
                leave-to-class="max-h-0 opacity-0"
              >
                <div v-if="isMobileServicesOpen" class="pb-4 pl-4 flex flex-col gap-1">
                  <NuxtLink
                    v-for="service in services"
                    :key="service.to"
                    :to="service.to"
                    class="py-2.5 text-[#0596B8]/70 text-[17px] font-normal hover:text-[#0596B8] transition-colors"
                    style="font-family: 'Bricolage Grotesque', sans-serif;"
                    @click="isMenuOpen = false; isMobileServicesOpen = false"
                  >
                    {{ service.label }}
                  </NuxtLink>
                </div>
              </Transition>
            </div>

            <!-- Portfolio -->
            <NuxtLink
              to="/portfolio"
              class="py-5 text-[#0596B8] text-[22px] font-medium tracking-wide border-b border-[#0596B8]/30"
              style="font-family: 'Bricolage Grotesque', sans-serif;"
              @click="isMenuOpen = false; isMobileServicesOpen = false"
            >
              Portfolio
            </NuxtLink>

            <!-- Case Studies -->
            <NuxtLink
              to="/case-studies"
              class="py-5 text-[#0596B8] text-[22px] font-medium tracking-wide border-b border-[#0596B8]/30"
              style="font-family: 'Bricolage Grotesque', sans-serif;"
              @click="isMenuOpen = false; isMobileServicesOpen = false"
            >
              Case Studies
            </NuxtLink>

            <!-- About -->
            <NuxtLink
              to="/about"
              class="py-5 text-[#0596B8] text-[22px] font-medium tracking-wide border-b border-[#0596B8]/30"
              style="font-family: 'Bricolage Grotesque', sans-serif;"
              @click="isMenuOpen = false; isMobileServicesOpen = false"
            >
              About
            </NuxtLink>

            <!-- Contact -->
            <NuxtLink
              to="/contact"
              class="py-5 text-[#0596B8] text-[22px] font-medium tracking-wide border-b border-[#0596B8]/30"
              style="font-family: 'Bricolage Grotesque', sans-serif;"
              @click="isMenuOpen = false; isMobileServicesOpen = false"
            >
              Contact
            </NuxtLink>
          </nav>
        </div>
      </Transition>
    </div>
  </header>
</template>
