<script setup lang="ts">
const { projects, fetchPromise } = usePortfolio()
if (fetchPromise) {
  await fetchPromise
}

const route = useRoute()
const slug = route.params.slug as string
const project = computed(() => projects.value.find(p => p.slug === slug))

if (!project.value) {
  throw createError({ statusCode: 404, statusMessage: 'Project not found', fatal: true })
}

const siteUrl = 'https://macawoo.co'
const absoluteImageUrl = computed(() => {
  const img = project.value?.image
  if (!img) return `${siteUrl}/og-image.png`
  if (img.startsWith('http://') || img.startsWith('https://')) return img
  return `${siteUrl}${img.startsWith('/') ? '' : '/'}${img}`
})

useSeoMeta({
  title: () => project.value ? `${project.value.title} — Macawoo Portfolio` : 'Macawoo Portfolio',
  description: () => project.value ? (project.value.tagline ?? project.value.subtitle) : '',
  ogTitle: () => project.value ? `${project.value.title} — Macawoo Portfolio` : 'Macawoo Portfolio',
  ogDescription: () => project.value ? (project.value.tagline ?? project.value.subtitle) : '',
  ogImage: absoluteImageUrl,
  twitterCard: 'summary_large_image',
  twitterImage: absoluteImageUrl
})

useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: computed(() => {
        if (!project.value) return ''
        return JSON.stringify({
          '@context': 'https://schema.org',
          '@graph': [
            {
              '@type': 'CreativeWork',
              '@id': `${siteUrl}/portfolio/${slug}#creativework`,
              'url': `${siteUrl}/portfolio/${slug}`,
              'name': project.value.title,
              'headline': project.value.subtitle,
              'description': project.value.tagline || project.value.subtitle,
              'image': absoluteImageUrl.value,
              'creator': { '@id': `${siteUrl}/#organization` },
              'publisher': { '@id': `${siteUrl}/#organization` }
            },
            {
              '@type': 'BreadcrumbList',
              '@id': `${siteUrl}/portfolio/${slug}#breadcrumb`,
              'itemListElement': [
                {
                  '@type': 'ListItem',
                  'position': 1,
                  'name': 'Home',
                  'item': siteUrl
                },
                {
                  '@type': 'ListItem',
                  'position': 2,
                  'name': 'Portfolio',
                  'item': `${siteUrl}/portfolio`
                },
                {
                  '@type': 'ListItem',
                  'position': 3,
                  'name': project.value.title,
                  'item': `${siteUrl}/portfolio/${slug}`
                }
              ]
            }
          ]
        })
      })
    }
  ]
})

const galleryIndex = ref(0)

watch(galleryIndex, () => {
  nextTick(() => {
    window.dispatchEvent(new CustomEvent('sync-reveal-cursor'))
  })
})

// ── Mobile stacked-card swipe gallery ──
const stackIndex = ref(0)
const dragX = ref(0)
const isDragging = ref(false)
let dragStartX = 0

const galleryCount = computed(() => project.value?.galleryImages?.length ?? 0)

const onStackDown = (e: PointerEvent) => {
  isDragging.value = true
  dragStartX = e.clientX
  ;(e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId)
}
const onStackMove = (e: PointerEvent) => {
  if (!isDragging.value) return
  dragX.value = e.clientX - dragStartX
}
const onStackUp = () => {
  if (!isDragging.value) return
  isDragging.value = false
  const threshold = 70
  if (dragX.value <= -threshold && stackIndex.value < galleryCount.value - 1) {
    stackIndex.value++
  } else if (dragX.value >= threshold && stackIndex.value > 0) {
    stackIndex.value--
  }
  dragX.value = 0
}

// Per-card transform building the stacked-deck look
const stackCardStyle = (i: number) => {
  const offset = i - stackIndex.value
  if (offset === 0) {
    const x = dragX.value
    return {
      transform: `translateX(${x}px) rotate(${x * 0.025}deg)`,
      transition: isDragging.value ? 'none' : 'transform 0.4s cubic-bezier(0.25,1,0.5,1)',
      zIndex: 30,
      opacity: 1
    }
  }
  if (offset < 0) {
    // already swiped away — fly off to the left
    return {
      transform: 'translateX(-130%) rotate(-10deg)',
      transition: 'transform 0.4s ease, opacity 0.4s ease',
      zIndex: 0,
      opacity: 0,
      pointerEvents: 'none' as const
    }
  }
  // cards behind the top one: nudge down + scale to form the deck
  const depth = Math.min(offset, 3)
  return {
    transform: `translateY(${depth * 16}px) scale(${1 - depth * 0.05})`,
    transition: 'transform 0.4s ease, opacity 0.4s ease',
    zIndex: 30 - depth,
    opacity: offset > 3 ? 0 : 1,
    pointerEvents: 'none' as const
  }
}

const paragraphs = computed(() =>
  project.value?.storyParagraphs?.length
    ? project.value.storyParagraphs
    : [project.value?.story ?? '']
)

const isYouTubeUrl = (url?: string) => {
  if (!url) return false
  return /youtube\.com|youtu\.be|youtube-nocookie\.com/i.test(url)
}

const getYouTubeEmbedUrl = (url?: string) => {
  if (!url) return ''
  const cleanUrl = url.trim().replace(/\/+$/, '')
  let videoId = ''
  
  const vMatch = cleanUrl.match(/[?&]v(?:i)?=([^&#?]+)/i)
  if (vMatch && vMatch[1]) {
    videoId = vMatch[1]
  } else {
    const pathMatch = cleanUrl.match(/(?:embed\/|shorts\/|v\/|vi\/|youtu\.be\/|watch\/)([^&#?\/]+)/i)
    if (pathMatch && pathMatch[1]) {
      videoId = pathMatch[1]
    } else {
      const endMatch = cleanUrl.match(/\/([^&#?\/]{11})$/i)
      if (endMatch && endMatch[1]) {
        videoId = endMatch[1]
      }
    }
  }
  
  if (videoId) {
    videoId = (videoId.split(/[?&#]/)[0] || '').trim()
  }
  
  return videoId && videoId.length === 11 ? `https://www.youtube.com/embed/${videoId}?controls=0&modestbranding=1&rel=0&iv_load_policy=3&disablekb=1` : url
}

const isVideoUrl = (url?: string) => {
  if (!url) return false
  return /\.(mp4|webm|mov|ogg)(\?.*)?$/i.test(url) || isYouTubeUrl(url)
}
</script>

<template>
  <div
    v-if="project"
    class="bg-white"
  >
    <!-- ── Hero ── -->
    <div class="site-hero-section relative">
      <!-- dark left-to-right gradient -->
      <div
        class="absolute inset-0 z-10 pointer-events-none"
        style="background: linear-gradient(90deg, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0) 55%)"
      />

      <!-- back button -->
      <button
        type="button"
        class="absolute top-8 left-6 md:left-[120px] z-20 bg-white inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full hover:opacity-90 transition-opacity cursor-pointer"
        @click="$router.back()"
      >
        <svg
          class="w-4 h-4 text-brand-dark"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M10 12L6 8L10 4"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        <span class="font-extrabold text-brand-dark text-sm">Back</span>
      </button>

      <!-- hero image -->
      <NuxtImg
        :src="project.heroImage"
        :alt="project.title"
        preload
        format="webp"
        class="w-full h-[360px] md:h-[560px] lg:h-[640px] object-cover"
      />
    </div>

    <!-- ── Teal Info Section ── -->
    <div class="bg-[#0596B8] px-6 md:px-[120px] py-16">
      <!-- metadata pills -->
      <div class="flex flex-wrap gap-2 mb-7">
        <!-- services pill -->
        <span
          v-if="project.services"
          class="border border-white text-white text-base font-normal leading-[28px] px-3 py-2 rounded-[56px] inline-flex items-center gap-1.5"
        >
          <svg
            class="w-3.5 h-3.5 shrink-0"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              x="1"
              y="1"
              width="5"
              height="5"
              rx="1"
              stroke="white"
              stroke-width="1.5"
            />
            <rect
              x="8"
              y="1"
              width="5"
              height="5"
              rx="1"
              stroke="white"
              stroke-width="1.5"
            />
            <rect
              x="1"
              y="8"
              width="5"
              height="5"
              rx="1"
              stroke="white"
              stroke-width="1.5"
            />
            <rect
              x="8"
              y="8"
              width="5"
              height="5"
              rx="1"
              stroke="white"
              stroke-width="1.5"
            />
          </svg>
          {{ project.services }}
        </span>

        <!-- industry pill -->
        <span
          v-if="project.industry"
          class="border border-white text-white text-base font-normal leading-[28px] px-3 py-2 rounded-[56px] inline-flex items-center gap-1.5"
        >
          <svg
            class="w-5 h-5 shrink-0"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3 21h18M6 21V7l6-4 6 4v14M9 21v-5h6v5"
              stroke="white"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          {{ project.industry }}
        </span>

        <!-- date pill -->
        <span
          v-if="project.date"
          class="border border-white text-white text-base font-normal leading-[28px] px-3 py-2 rounded-[56px] inline-flex items-center gap-1.5"
        >
          <svg
            class="w-3 h-3 shrink-0"
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              x="1"
              y="2"
              width="10"
              height="9"
              rx="1.5"
              stroke="white"
              stroke-width="1.2"
            />
            <path
              d="M4 1v2M8 1v2"
              stroke="white"
              stroke-width="1.2"
              stroke-linecap="round"
            />
            <path
              d="M1 5h10"
              stroke="white"
              stroke-width="1.2"
            />
          </svg>
          {{ project.date }}
        </span>
      </div>

      <!-- title -->
      <h1
        class="font-fredoka font-medium text-[56px] md:text-[64px] text-brand-yellow-500 leading-tight mb-3"
        style="font-variation-settings: 'wdth' 100"
      >
        {{ project.title }}
      </h1>

      <!-- tagline -->
      <p
        v-if="project.tagline"
        class="text-white text-lg leading-[24px] max-w-2xl"
      >
        {{ project.tagline }}
      </p>
    </div>

    <!-- ── Story Section ── -->
    <div class="bg-white px-6 md:px-[120px] py-16">
      <h2
        class="font-fredoka font-medium text-[40px] md:text-[48px] text-[#0596B8] mb-5 leading-tight"
        style="font-variation-settings: 'wdth' 100"
      >
        The Story Behind the Project
      </h2>
      <div class="space-y-5 max-w-[1200px]">
        <p
          v-for="(para, i) in paragraphs"
          :key="i"
          class="text-brand-dark text-lg leading-[24px]"
        >
          {{ para }}
        </p>
      </div>
    </div>

    <!-- ── Design Highlights ── -->
    <div
      v-if="project.galleryImages.length"
      class="bg-brand-yellow-500 px-6 md:px-[120px] py-16"
    >
      <h2
        class="font-fredoka font-medium text-[40px] md:text-[48px] text-[#0596B8] mb-5 leading-tight"
        style="font-variation-settings: 'wdth' 100"
      >
        Design Highlights
      </h2>

      <!-- Mobile: swipeable stacked-card deck (no arrows) -->
      <div class="md:hidden">
        <div
          class="gallery-stack relative w-full aspect-video select-none touch-pan-y"
          style="padding-bottom: 16px;"
          @pointerdown="onStackDown"
          @pointermove="onStackMove"
          @pointerup="onStackUp"
          @pointercancel="onStackUp"
        >
          <div
            v-for="(media, i) in project.galleryImages"
            :key="`gallery-card-${i}`"
            class="absolute inset-0 rounded-[28px] overflow-hidden bg-zinc-900 shadow-xl"
            :style="stackCardStyle(i)"
          >
            <iframe
              v-if="isYouTubeUrl(media)"
              :src="getYouTubeEmbedUrl(media)"
              loading="lazy"
              class="w-full h-full border-0 pointer-events-none"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowfullscreen
            ></iframe>
            <video
              v-else-if="isVideoUrl(media)"
              :src="media"
              autoplay
              muted
              playsinline
              webkit-playsinline="true"
              loop
              preload="auto"
              crossorigin="anonymous"
              class="w-full h-full object-cover rounded-[28px] pointer-events-none"
            />
            <NuxtImg
              v-else
              :src="media"
              :alt="`${project.title} design highlight ${i + 1}`"
              format="webp"
              loading="lazy"
              draggable="false"
              class="w-full h-full object-cover rounded-[28px] pointer-events-none"
            />
          </div>
        </div>

        <!-- Dots -->
        <div
          v-if="project.galleryImages.length > 1"
          class="flex justify-center gap-2 mt-4"
        >
          <button
            v-for="(_, i) in project.galleryImages"
            :key="`dot-${i}`"
            class="h-2 rounded-full transition-all"
            :class="stackIndex === i ? 'w-6 bg-[#0596B8]' : 'w-2 bg-[#0596B8]/30'"
            :aria-label="`Go to highlight ${i + 1}`"
            @click="stackIndex = i"
          />
        </div>
      </div>

      <!-- Desktop: single media + prev/next arrows -->
      <div class="hidden md:block relative rounded-[28px] overflow-hidden aspect-video w-full max-w-full mx-auto bg-zinc-900">
        <iframe
          v-if="isYouTubeUrl(project.galleryImages[galleryIndex])"
          :key="project.galleryImages[galleryIndex]"
          :src="getYouTubeEmbedUrl(project.galleryImages[galleryIndex])"
          class="w-full h-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowfullscreen
        ></iframe>
        <video
          v-else-if="isVideoUrl(project.galleryImages[galleryIndex])"
          :src="project.galleryImages[galleryIndex]"
          controls
          muted
          playsinline
          webkit-playsinline="true"
          loop
          preload="metadata"
          crossorigin="anonymous"
          class="w-full h-full object-cover rounded-[28px]"
        />
        <NuxtImg
          v-else
          :src="project.galleryImages[galleryIndex]"
          :alt="`${project.title} design highlight ${galleryIndex + 1}`"
          format="webp"
          class="w-full h-full object-cover rounded-[28px]"
        />

        <!-- prev / next buttons -->
        <template v-if="project.galleryImages.length > 1">
          <button
            class="absolute left-5 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-brand-yellow-500 border-2 border-brand-yellow-500 flex items-center justify-center hover:opacity-90 transition-opacity disabled:opacity-30 z-30 shadow-md"
            :disabled="galleryIndex === 0"
            @click="galleryIndex = Math.max(0, galleryIndex - 1)"
          >
            <LeftArrow class="w-5 h-5 text-brand-dark" />
          </button>
          <button
            class="absolute right-5 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-brand-yellow-500 border-2 border-brand-yellow-500 flex items-center justify-center hover:opacity-90 transition-opacity disabled:opacity-30 z-30 shadow-md"
            :disabled="galleryIndex >= project.galleryImages.length - 1"
            @click="galleryIndex = Math.min(project.galleryImages.length - 1, galleryIndex + 1)"
          >
            <RightArrow class="w-5 h-5 text-brand-dark" />
          </button>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Mobile stacked-card swipe deck: cards are absolutely stacked; touch-pan-y
   lets the page scroll vertically while we capture horizontal drag. */
.gallery-stack {
  cursor: grab;
  /* Clip the off-screen swipe (cards fly to translateX(-130%) + drag delta).
     Without this the flying card widens the page horizontally on mobile,
     expanding the layout viewport and shoving the fixed chat widget out of
     place. `clip` on the x-axis only -> vertical deck offset stays visible
     and page scroll is unaffected. */
  overflow-x: clip;
}
.gallery-stack:active {
  cursor: grabbing;
}
</style>
