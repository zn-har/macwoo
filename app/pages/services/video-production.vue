<script setup lang="ts">
const hoveredCard = ref<number | null>(null)
const { settings, fetchPromise: settingsPromise } = usePageSettings()
if (settingsPromise) {
  await settingsPromise
}

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

useSeoMeta({
  title: 'Video Production & Commercial Visuals — Creative Branding Agency | Macawoo',
  description: 'As a creative and strategic branding agency, Macawoo produces high-impact videos and brand films that captivate audiences and drive results.',
  ogTitle: 'Video Production & Commercial Visuals — Creative Branding Agency | Macawoo',
  ogDescription: 'As a creative and strategic branding agency, Macawoo produces high-impact videos and brand films that captivate audiences and drive results.'
})

const siteUrl = 'https://macawoo.co'
useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'WebPage',
            '@id': `${siteUrl}/services/video-production#webpage`,
            'url': `${siteUrl}/services/video-production`,
            'name': 'Video Production & Narrative Storytelling — Macawoo',
            'description': 'From concept to final cut, we produce video content that commands attention and drives meaningful engagement.',
            'isPartOf': { '@id': `${siteUrl}/#website` }
          },
          {
            '@type': 'Service',
            '@id': `${siteUrl}/services/video-production#service`,
            'name': 'Video Production Services',
            'provider': { '@id': `${siteUrl}/#organization` },
            'description': 'From concept to final cut, we produce video content that commands attention and drives meaningful engagement.',
            'serviceType': 'Video Production, Directing, Motion Graphics, Corporate Videos, Post-Production'
          },
          {
            '@type': 'BreadcrumbList',
            '@id': `${siteUrl}/services/video-production#breadcrumb`,
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
                'name': 'Video Production',
                'item': `${siteUrl}/services/video-production`
              }
            ]
          }
        ]
      })
    }
  ]
})

const prevTo = '/services/digital-marketing'
const nextTo = '/services/branding-design'

const containerRef = ref<HTMLElement | null>(null)

onMounted(() => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-active')
        observer.unobserve(entry.target)
      }
    })
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  })

  if (containerRef.value) {
    const cards = containerRef.value.querySelectorAll('.reveal-card')
    cards.forEach(card => observer.observe(card))
  }
})

const subServices = [
  { icon: '/Icons/Film@4x.png', title: 'Core Video Services', description: 'Brand Films, Commercial Ads, Social Reels, and Corporate Explainers crafted with cinematic precision.' },
  { icon: '/Icons/Video_Camera@4x.png', title: 'Specialized Content', description: 'Real Estate walkthroughs, Travel diaries, and compelling Testimonial shoots.' },
  { icon: '/Icons/Film_Slate@4x.png', title: 'Advanced Production', description: 'FPV Drone piloting, complex VFX editing, and high-end Post-production.' },
  { icon: '/Icons/Video@4x.png', title: 'Motion & Animation', description: 'Enhance videos with engaging motion graphics, 2D/3D animations, and dynamic visual effects that bring stories to life.' }
]

const logos = [
  { src: '/Images/Client_Logo/le_crown_brown-01_1@2x.png', alt: 'Le Crown', h: 'h-[39px]' },
  { src: '/Images/Client_Logo/COLOR_2_1@2x.png', alt: 'Take My Family', h: 'h-[42px]' },
  { src: '/Images/Client_Logo/IMG_3097_1@2x.png', alt: 'TAB', h: 'h-[38px]' },
  { src: '/Images/Client_Logo/Pink_Label_logo_1@2x.png', alt: 'Pinklabel', h: 'h-[45px]' },
  { src: '/Images/Client_Logo/Asset_1@500x_1@2x.png', alt: 'Piok English', h: 'h-[52px]' },
  { src: '/Images/Client_Logo/Asset_1@500x_2@2x.png', alt: 'Go German', h: 'h-[54px]' }
]
</script>

<template>
  <div class="bg-white">
    <!-- ═══════════════════════════════════════════
         HERO BANNER (386px)
         ═══════════════════════════════════════════ -->
    <section class="site-hero-section relative h-[300px] md:h-[386px] overflow-hidden">
      <!-- Background image + dark overlay -->
      <div class="absolute inset-0">
        <NuxtImg
          src="/Images/Video_Production.jpeg"
          alt="Macawoo Video Production Services Banner"
          preload
          format="webp"
          class="w-full h-full object-cover"
        />
        <div class="absolute inset-0 bg-black/40" />
      </div>

      <!-- Content -->
      <div class="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
        <p
          class="text-white text-[14px] md:text-[18px] font-normal tracking-wide mb-1"
          style="font-family: 'Bricolage Grotesque', sans-serif;"
        >
          SERVICES
        </p>
        <h1
          class="text-[#F7EC12] text-[32px] md:text-[48px] leading-[58px] font-medium mb-2"
          style="font-family: 'Fredoka', sans-serif;"
        >
          Video Production
        </h1>
        <p
          class="text-white text-[14px] md:text-[18px] font-normal leading-[28px] max-w-[910px]"
          style="font-family: 'Bricolage Grotesque', sans-serif;"
        >
          Stories That Capture Attention. Content That Converts.
        </p>
      </div>

      <!-- Left Arrow -->
      <NuxtLink
        :to="prevTo"
        class="hidden md:flex absolute left-4 md:left-[120px] top-1/2 -translate-y-1/2 z-20 w-[48px] h-[48px] md:w-[68px] md:h-[68px] items-center justify-center hover:scale-105 transition-transform"
      >
        <div class="w-full h-full rounded-full bg-white flex items-center justify-center shadow-[0_2px_8px_rgba(0,0,0,0.12)]">
          <LeftArrow class="w-[38%] h-[38%]" />
        </div>
      </NuxtLink>

      <!-- Right Arrow -->
      <NuxtLink
        :to="nextTo"
        class="hidden md:flex absolute right-4 md:right-[120px] top-1/2 -translate-y-1/2 z-20 w-[48px] h-[48px] md:w-[68px] md:h-[68px] items-center justify-center hover:scale-105 transition-transform"
      >
        <div class="w-full h-full rounded-full bg-white flex items-center justify-center shadow-[0_2px_8px_rgba(0,0,0,0.12)]">
          <RightArrow class="w-[38%] h-[38%]" />
        </div>
      </NuxtLink>
    </section>

    <!-- ═══════════════════════════════════════════
         SUB-SERVICES CARDS (Teal Background)
         ═══════════════════════════════════════════ -->
    <section class="bg-[#0596B8] relative overflow-hidden pt-6 md:pt-20 pb-20 md:pb-24">
      <!-- Mobile Navigation Arrows (Centered inside Section on Mobile) -->
      <div class="flex md:hidden items-center justify-center gap-6 pb-6">
        <NuxtLink
          :to="prevTo"
          class="w-[48px] h-[48px] flex items-center justify-center hover:scale-105 transition-transform"
        >
          <div class="w-full h-full rounded-full bg-white flex items-center justify-center shadow-[0_2px_8px_rgba(0,0,0,0.12)] border border-zinc-200">
            <LeftArrow class="w-[38%] h-[38%]" />
          </div>
        </NuxtLink>
        <NuxtLink
          :to="nextTo"
          class="w-[48px] h-[48px] flex items-center justify-center hover:scale-105 transition-transform"
        >
          <div class="w-full h-full rounded-full bg-white flex items-center justify-center shadow-[0_2px_8px_rgba(0,0,0,0.12)] border border-zinc-200">
            <RightArrow class="w-[38%] h-[38%]" />
          </div>
        </NuxtLink>
      </div>
      <div class="max-w-[1120px] mx-auto px-6">
        <div
          ref="containerRef"
          class="grid grid-cols-1 md:grid-cols-2 gap-x-[18px] gap-y-[28px]"
        >
          <div
            v-for="(s, i) in subServices"
            :key="s.title"
            class="reveal-card"
            :style="{ transitionDelay: (i % 2) * 150 + 'ms' }"
          >
            <div
              class="group service-card rounded-[10px] flex overflow-hidden h-auto md:h-[231px] transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] cursor-pointer"
              :class="[
                hoveredCard === i
                  ? 'bg-[#F7EC12] -translate-y-2 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.25)]'
                  : 'bg-white'
              ]"
              @mouseenter="hoveredCard = i"
              @mouseleave="hoveredCard = null"
            >
              <!-- Gradient left strip -->
              <div
                class="w-[60px] md:w-[78px] shrink-0 flex items-start justify-center pt-8 md:pt-9"
                style="background: linear-gradient(180deg, #F7EC12 0%, #0596B8 100%); border-radius: 10px 0 0 10px;"
              >
                <NuxtImg
                  :src="s.icon"
                  :alt="s.title"
                  loading="lazy"
                  format="webp"
                  class="w-[34px] h-[34px] md:w-[40px] md:h-[40px] object-contain transition-transform duration-300 ease-out"
                  :class="hoveredCard === i ? 'scale-110' : ''"
                />
              </div>
              <!-- Content -->
              <div class="flex-1 flex flex-col justify-start px-5 md:px-9 pt-8 md:pt-9 pb-6">
                <h3
                  class="text-[24px] md:text-[32px] font-medium leading-[38px] mb-3 md:mb-[19px] transition-colors duration-300"
                  :class="hoveredCard === i ? 'text-brand-dark' : 'text-[#0596B8]'"
                  style="font-family: 'Bricolage Grotesque', sans-serif;"
                >
                  {{ s.title }}
                </h3>
                <p
                  class="text-black text-[15px] md:text-[18px] font-normal leading-[26px] md:leading-[28px]"
                  style="font-family: 'Bricolage Grotesque', sans-serif;"
                >
                  {{ s.description }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════
         CLIENT LOGO MARQUEE
         ═══════════════════════════════════════════ -->
    <section class="site-exclude-reveal py-3 bg-white overflow-hidden relative">
      <!-- Fade edges -->
      <div class="absolute left-0 top-0 bottom-0 w-20 md:w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
      <div class="absolute right-0 top-0 bottom-0 w-20 md:w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

      <!-- Scrolling logos -->
      <div class="flex animate-marquee items-center py-3">
        <!-- Repeat 3 sets for seamless loop -->
        <template
          v-for="set in 3"
          :key="set"
        >
          <NuxtImg
            v-for="logo in logos"
            :key="`${set}-${logo.alt}`"
            :src="logo.src"
            :alt="logo.alt"
            loading="lazy"
            format="webp"
            :class="[logo.h, 'w-auto shrink-0 object-contain mx-[30px] md:mx-[51px]']"
          />
        </template>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════
         AGENCY SHOWREEL 2026 (Yellow Background)
         ═══════════════════════════════════════════ -->
    <section class="py-16 md:py-20 bg-[#F7EC12] text-center no-reveal-spotlight">
      <div class="max-w-[1120px] mx-auto px-6">
        <h2
          class="text-[#0596B8] text-[32px] md:text-[48px] leading-[58px] font-medium mb-8"
          style="font-family: 'Fredoka', sans-serif;"
        >
          Agency Showreel 2026
        </h2>
        <div class="relative w-full aspect-video rounded-2xl overflow-hidden bg-zinc-300 shadow-lg site-exclude-reveal">
          <iframe
            v-if="isYouTubeUrl(settings.servicesVideoShowreel)"
            :key="'youtube-' + settings.servicesVideoShowreel"
            :src="getYouTubeEmbedUrl(settings.servicesVideoShowreel)"
            class="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowfullscreen
          ></iframe>
          <video
            v-else
            :key="'native-' + settings.servicesVideoShowreel"
            :src="settings.servicesVideoShowreel"
            class="w-full h-full object-cover"
            controls
            muted
            playsinline
            webkit-playsinline="true"
            preload="metadata"
            crossorigin="anonymous"
            poster="/Images/Video_Production.jpeg"
          >
            <source :src="settings.servicesVideoShowreel">
          </video>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════
         BUILD YOUR BRAND CTA (Ready to Command Attention?)
         ═══════════════════════════════════════════ -->
    <section class="py-16 md:py-20 bg-white text-center">
      <div class="max-w-[700px] mx-auto px-6">
        <h2
          class="text-black text-[40px] md:text-[64px] leading-[1.2] font-medium mb-0"
          style="font-family: 'Fredoka', sans-serif;"
        >
          Ready to<br>
          <span class="text-[#0596B8]">Command Attention?</span>
        </h2>
        <p
          class="text-black text-[16px] md:text-[18px] leading-[28px] font-normal mt-2 mb-[30px]"
          style="font-family: 'Bricolage Grotesque', sans-serif;"
        >
          Create Your Story.
        </p>
        <NuxtLink
          to="/contact"
          class="inline-flex items-center justify-center gap-[5px] px-6 md:px-8 py-2.5 bg-[#F7EC12] text-[#201F1F] text-[16px] md:text-[20px] font-bold rounded-full hover:brightness-95 transition-all"
          style="font-family: 'Bricolage Grotesque', sans-serif; box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.25);"
        >
          <span>Start Your Project</span>
          <UpRightArrow
            class="w-[20px] h-[19px] md:w-[25px] md:h-[23px]"
            fill="#141111"
          />
        </NuxtLink>
      </div>
    </section>
  </div>
</template>

<style scoped>
@keyframes marquee {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-33.333%);
  }
}

.animate-marquee {
  animation: marquee 25s linear infinite;
  width: max-content;
}

.animate-marquee:hover {
  animation-play-state: paused;
}
</style>
