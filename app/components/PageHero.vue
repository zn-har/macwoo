<script setup lang="ts">
interface Cta {
  label: string
  to: string
  variant?: 'primary' | 'outline' | 'white'
  showDownArrow?: boolean
}

interface Props {
  video?: string
  image?: string
  alt?: string
  eyebrow?: string
  titleHtml: string
  description?: string
  descriptionHtml?: string
  ctas?: Cta[]
  showArrows?: boolean
  prevTo?: string
  nextTo?: string
  minHeight?: string
  align?: 'left' | 'center'
  showGrid?: boolean
  imageClass?: string
  contentStyle?: Record<string, string | number | undefined>
  imageStyle?: Record<string, string | number | undefined>
  showScrollIndicator?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  minHeight: 'min-h-screen',
  align: 'center',
  showGrid: false,
  imageClass: '',
  contentStyle: () => ({}),
  showScrollIndicator: false
})

const videoLoaded = ref(false)
const videoRef = ref<HTMLVideoElement | null>(null)

// The hero video is the intended hero on EVERY device and setting — `image` is
// not a substitute for it. So this is never gated on viewport, pointer type or
// prefers-reduced-motion; whenever a `video` prop exists, it plays. Mobile cost
// is handled by keeping the files small (720p, ~0.3–0.9 MB) and long-cached,
// not by withholding the video.
const showVideo = computed(() => !!props.video)

// Reveal the video as soon as it has decodable frames. Deliberately NOT gated
// on play() resolving: a rejected play() — autoplay policy, or an AbortError
// from a competing load() — would otherwise leave the wrapper pinned at
// opacity 0.01 forever even though the element itself is playing fine.
const markVideoReady = () => {
  const el = videoRef.value
  if (el && el.readyState >= 2) {
    videoLoaded.value = true
  }
}

const tryPlayVideo = () => {
  const el = videoRef.value
  if (!el) return
  el.muted = true
  el.playsInline = true
  markVideoReady()
  if (el.paused) {
    const playPromise = el.play()
    if (playPromise !== undefined) {
      playPromise.then(markVideoReady).catch((err) => {
        console.warn('Video play prevented by browser/Opera autoplay policy:', err)
      })
    }
  }
}

// Unsupported codec or network failure — fall back to the static image.
const onVideoError = () => {
  videoLoaded.value = false
}

watch(() => props.video, () => {
  videoLoaded.value = false
  if (!showVideo.value) return
  nextTick(() => {
    if (videoRef.value) {
      videoRef.value.load()
    }
    tryPlayVideo()
  })
})

useHead({
  // NOTE: deliberately no <link rel=preload as=video>. The hero video is a
  // decorative background, not the LCP element — preloading it high-priority
  // starves the real LCP (hero image/text) of bandwidth on first paint.
  link: computed(() => props.image
    ? [{ rel: 'preload', as: 'image', href: props.image, fetchpriority: 'high' }]
    : [])
})

const isScrolled = ref(false)

const handleScroll = () => {
  isScrolled.value = window.scrollY > 50
}

const scrollToNext = () => {
  window.scrollTo({
    top: window.innerHeight,
    behavior: 'smooth'
  })
}

const handleFirstUserInteraction = () => {
  if (videoRef.value && videoRef.value.paused) {
    tryPlayVideo()
  }
}

onMounted(() => {
  // No load() here. The SSR markup already carries autoplay/preload, so the
  // browser starts fetching before hydration; calling load() at this point
  // resets the element, aborts that fetch, and re-downloads the whole file.
  // tryPlayVideo() also covers the case where loadeddata/canplay/playing all
  // fired before hydration attached their listeners.
  if (showVideo.value) {
    tryPlayVideo()
    window.addEventListener('pointerdown', handleFirstUserInteraction, { passive: true, once: true })
    window.addEventListener('touchstart', handleFirstUserInteraction, { passive: true, once: true })
    window.addEventListener('click', handleFirstUserInteraction, { passive: true, once: true })
  }

  if (props.showScrollIndicator) {
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
  }
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('pointerdown', handleFirstUserInteraction)
  window.removeEventListener('touchstart', handleFirstUserInteraction)
  window.removeEventListener('click', handleFirstUserInteraction)
})
</script>

<template>
  <section
    class="site-hero-section relative w-full flex items-center overflow-hidden bg-[#141111]"
    :class="[
      minHeight
    ]"
  >
    <!-- Video background wrapper -->
    <div
      v-if="showVideo"
      class="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000"
      :class="[videoLoaded ? 'opacity-100' : 'opacity-[0.01]']"
      :style="imageStyle"
    >
      <video
        ref="videoRef"
        :src="video"
        autoplay
        muted
        loop
        playsinline
        webkit-playsinline="true"
        preload="auto"
        class="absolute inset-0 w-full h-full object-cover"
        @loadedmetadata="tryPlayVideo"
        @loadeddata="tryPlayVideo"
        @canplay="tryPlayVideo"
        @playing="videoLoaded = true"
        @error="onVideoError"
      />
    </div>

    <!-- Static image background -->
    <NuxtImg
      v-if="image && (!showVideo || !videoLoaded)"
      :src="image"
      :alt="alt || titleHtml?.replace(/<[^>]*>/g, '') || 'Macawoo hero background'"
      class="absolute inset-0 w-full h-full object-cover opacity-30"
      :class="imageClass"
      :style="imageStyle"
      preload
      format="webp"
    />

    <!-- Premium Glass Panel Overlay -->
    <GlassGrid v-if="showGrid" />

    <!-- Left Arrow -->
    <NuxtLink
      v-if="showArrows && prevTo"
      :to="prevTo"
      class="absolute left-4 md:left-[120px] top-1/2 -translate-y-1/2 z-20 w-[48px] h-[48px] md:w-[68px] md:h-[68px] flex items-center justify-center bg-white rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.25)] hover:scale-105 transition-transform"
    >
      <LeftArrow class="w-[38%] h-[38%]" />
    </NuxtLink>

    <!-- Right Arrow -->
    <NuxtLink
      v-if="showArrows && nextTo"
      :to="nextTo"
      class="absolute right-4 md:right-[120px] top-1/2 -translate-y-1/2 z-20 w-[48px] h-[48px] md:w-[68px] md:h-[68px] flex items-center justify-center bg-white rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.25)] hover:scale-105 transition-transform"
    >
      <RightArrow class="w-[38%] h-[38%]" />
    </NuxtLink>

    <!-- Content -->
    <div
      class="relative z-20 w-full max-w-7xl mx-auto px-6 py-24 flex flex-col"
      :class="[
        align === 'center' ? 'items-center text-center' : 'items-start text-left'
      ]"
      :style="contentStyle"
    >
      <!-- Eyebrow -->
      <p
        v-if="eyebrow"
        class="text-brand-yellow-500 text-xs font-semibold tracking-widest uppercase mb-4"
      >
        {{ eyebrow }}
      </p>

      <!-- Title -->
      <!-- eslint-disable-next-line vue/no-v-html -->
      <h1
        class="font-fredoka text-5xl md:text-7xl lg:text-[96px] font-medium text-white leading-tight lg:leading-[116px] mb-2 lg:max-w-[699px] text-center"
        v-html="titleHtml"
      />

      <!-- Description -->
      <!-- eslint-disable-next-line vue/no-v-html -->
      <p
        v-if="descriptionHtml"
        class="text-white text-base md:text-lg lg:text-[20px] font-normal leading-relaxed lg:leading-[28px] lg:max-w-[728px] text-center mb-8"
        v-html="descriptionHtml"
      />
      <p
        v-else-if="description"
        class="text-white text-base md:text-lg lg:text-[20px] font-normal leading-relaxed lg:leading-[28px] lg:max-w-[728px] text-center mb-8"
      >
        {{ description }}
      </p>

      <!-- CTAs -->
      <div
        v-if="ctas?.length"
        class="flex flex-wrap gap-4"
      >
        <NuxtLink
          v-for="cta in ctas"
          :key="cta.to"
          :to="cta.to"
          class="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold transition-colors"
          :class="[
            cta.variant === 'outline' && 'border border-white text-white hover:bg-white/10',
            cta.variant === 'white' && 'bg-white text-brand-dark hover:bg-zinc-100',
            (!cta.variant || cta.variant === 'primary') && 'bg-brand-yellow-500 text-brand-dark hover:bg-brand-yellow-400'
          ]"
        >
          <span>{{ cta.label }}</span>
          <DownArrow
            v-if="cta.showDownArrow"
            class="w-3.5 h-3.5"
            :fill="cta.variant === 'white' ? '#141111' : '#ffffff'"
          />
        </NuxtLink>
      </div>
    </div>

    <!-- The #glass-dispersion-left / -right displacement filters that used to
         live here were emitted by every PageHero on every page (mobile
         included) and referenced by nothing. Removed. -->

    <!-- Scroll Down Indicator -->
    <div
      v-if="showScrollIndicator"
      class="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2 cursor-pointer group transition-all duration-500"
      :class="[isScrolled ? 'opacity-0 translate-y-4 pointer-events-none' : 'opacity-100 translate-y-0']"
      @click="scrollToNext"
    >
      <span
        class="text-white/60 group-hover:text-white text-[10px] md:text-xs font-semibold uppercase tracking-[0.2em] select-none transition-colors duration-300"
        style="font-family: 'Bricolage Grotesque', sans-serif;"
      >
        Scroll Down
      </span>
      <div class="relative w-[24px] h-[40px] rounded-full border-2 border-white/40 flex justify-center group-hover:border-white/80 transition-colors duration-300">
        <div
          class="w-1.5 h-1.5 bg-[#F7EC12] rounded-full mt-2 scroll-dot-animated"
          :class="{ 'is-paused': isScrolled }"
        />
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Custom 1442x386 Desktop Aspect Ratio overrides */
@media (min-width: 1024px) {
  .custom-hero-ratio {
    width: 100% !important;
    max-width: none !important;
    height: 386px !important;
    min-height: 386px !important;
  }

  .custom-hero-ratio .py-24,
  .custom-hero-ratio :deep(.py-24) {
    padding-top: 2.25rem !important;
    padding-bottom: 2.25rem !important;
  }

  .custom-hero-ratio h1,
  .custom-hero-ratio :deep(h1) {
    font-size: 2.75rem !important;
    line-height: 3.25rem !important;
    margin-bottom: 0.5rem !important;
  }

  .custom-hero-ratio p,
  .custom-hero-ratio :deep(p) {
    font-size: 0.95rem !important;
    line-height: 1.4rem !important;
    margin-bottom: 1.25rem !important;
    max-width: 650px !important;
  }
}

@media (max-width: 1023px) {
  .custom-hero-ratio {
    width: 100% !important;
    min-height: 360px !important;
  }

  .custom-hero-ratio .py-24,
  .custom-hero-ratio :deep(.py-24) {
    padding-top: 3.5rem !important;
    padding-bottom: 3.5rem !important;
  }

  .custom-hero-ratio h1,
  .custom-hero-ratio :deep(h1) {
    font-size: 2.25rem !important;
    line-height: 2.75rem !important;
    margin-bottom: 0.5rem !important;
  }

  .custom-hero-ratio p,
  .custom-hero-ratio :deep(p) {
    font-size: 0.9rem !important;
    line-height: 1.35rem !important;
    margin-bottom: 1.25rem !important;
  }
}

@keyframes scroll-dot {
  0% {
    transform: translateY(0);
    opacity: 0;
  }
  30% {
    opacity: 1;
  }
  60% {
    opacity: 1;
  }
  100% {
    transform: translateY(16px);
    opacity: 0;
  }
}

.scroll-dot-animated {
  animation: scroll-dot 1.8s infinite cubic-bezier(0.15, 0.41, 0.69, 0.94);
}

/* The indicator fades out once the user scrolls, but the keyframes kept
   running behind opacity:0 for the rest of the session. */
.scroll-dot-animated.is-paused {
  animation-play-state: paused;
}

@media (prefers-reduced-motion: reduce) {
  .scroll-dot-animated {
    animation: none;
  }
}
</style>
