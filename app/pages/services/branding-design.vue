<script setup lang="ts">
const hoveredCard = ref<number | null>(null)

useSeoMeta({
  title: 'Branding & Design Services — Creative and Strategic Branding Agency | Macawoo',
  description: 'As a leading creative and strategic branding agency, Macawoo crafts powerful brand identity, strategic positioning, visual design, and market positioning that drives growth.',
  ogTitle: 'Branding & Design Services — Creative and Strategic Branding Agency | Macawoo',
  ogDescription: 'As a leading creative and strategic branding agency, Macawoo crafts powerful brand identity, strategic positioning, visual design, and market positioning that drives growth.'
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
            '@type': 'Service',
            '@id': `${siteUrl}/services/branding-design#webpage`,
            'url': `${siteUrl}/services/branding-design`,
            'name': 'Branding & Design Services — Creative and Strategic Branding Agency | Macawoo',
            'description': 'Macawoo is a creative and strategic branding agency delivering brand strategy, identity design, and visual positioning.',
            'provider': { '@id': `${siteUrl}/#organization` }
          },
          {
            '@type': 'Service',
            '@id': `${siteUrl}/services/branding-design#service`,
            'name': 'Branding & Design Services',
            'provider': { '@id': `${siteUrl}/#organization` },
            'description': 'We Don\'t Just Design. We Build Brands. Define your brand positioning, messaging, and direction.',
            'serviceType': 'Branding, Brand Strategy, Corporate Identity, Logo Design'
          },
          {
            '@type': 'BreadcrumbList',
            '@id': `${siteUrl}/services/branding-design#breadcrumb`,
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
                'name': 'Branding & Design',
                'item': `${siteUrl}/services/branding-design`
              }
            ]
          }
        ]
      })
    }
  ]
})

const prevTo = '/services/video-production'
const nextTo = '/services/digital-marketing'

const containerRef = ref<HTMLElement | null>(null)
const methodologyRef = ref<HTMLElement | null>(null)

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

  if (methodologyRef.value) {
    const cards = methodologyRef.value.querySelectorAll('.reveal-card')
    cards.forEach(card => observer.observe(card))
  }
})

const subServices = [
  { icon: '/Icons/Lightbulb@4x.png', title: 'Brand Strategy', description: 'Define your brand positioning, messaging, and direction to build a strong foundation for growth.' },
  { icon: '/Icons/Pencil_Ruler@4x.png', title: 'Brand Identity', description: 'Create memorable visual identities that strengthen recognition, trust, and brand consistency.' },
  { icon: '/Icons/Package@4x.png', title: 'Packaging Design', description: 'Design impactful packaging that captures attention and enhances customer experience.' },
  { icon: '/Icons/Figma@4x.png', title: 'UI/UX Design', description: 'Craft intuitive digital experiences that improve usability, engagement, and customer satisfaction.' },
  { icon: '/Icons/Palette@4x.png', title: 'Corporate Design', description: 'Develop professional brand assets that ensure clear and consistent business communication.' },
  { icon: '/Icons/Brain@4x.png', title: 'Creative Design', description: 'Lead creative concepts and visual storytelling that bring your brand vision\nto life.' }
]

const steps = [
  { number: '01', title: 'Discover', description: 'Unearthing the core truth of your business.' },
  { number: '02', title: 'Define', description: 'Structuring the narrative and positioning.' },
  { number: '03', title: 'Design', description: 'Crafting the visual and verbal identity.' },
  { number: '04', title: 'Deliver', description: 'Launching the brand into the world.' }
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
          src="/Images/Branding.jpeg"
          alt="Macawoo Branding and Design Services Banner"
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
          Branding &amp; Design
        </h1>
        <p
          class="text-white text-[14px] md:text-[18px] font-normal leading-[28px] max-w-[910px]"
          style="font-family: 'Bricolage Grotesque', sans-serif;"
        >
          We Don't Just Design. We Build Brands.
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
    <section class="bg-brand-teal-500 relative overflow-hidden pt-6 md:pt-20 pb-20 md:pb-24">
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
                  class="text-black text-[15px] md:text-[18px] font-normal leading-[26px] md:leading-[28px] whitespace-pre-line"
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
         THE METHODOLOGY
         ═══════════════════════════════════════════ -->
    <section class="py-16 md:py-20 bg-brand-yellow-500 firefox-no-reveal">
      <div class="max-w-[1192px] mx-auto px-6 md:px-8">
        <h2
          class="text-brand-teal-500 text-[36px] md:text-[48px] leading-[58px] font-medium tracking-[-0.48px] mb-10 md:mb-[42px]"
          style="font-family: 'Fredoka', sans-serif;"
        >
          The Methodology
        </h2>

        <div
          ref="methodologyRef"
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          <div
            v-for="(step, idx) in steps"
            :key="step.number"
            :class="idx > 0 ? 'reveal-card' : ''"
            :style="idx > 0 ? { transitionDelay: ((idx - 1) * 150) + 'ms' } : {}"
          >
            <div
              class="group bg-brand-teal-500 rounded-[8px] p-6 flex flex-col methodology-card h-full transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1.5 hover:shadow-xl hover:shadow-black/25"
              style="border: 1px solid rgba(255, 255, 255, 0.05); min-height: 218px;"
            >
              <!-- Number -->
              <p
                class="text-brand-yellow-500 text-[48px] md:text-[64px] leading-[64px] font-bold transition-transform duration-300 ease-out group-hover:scale-105 origin-left"
                style="font-family: 'Bricolage Grotesque', sans-serif;"
              >
                {{ step.number }}
              </p>
              <!-- Title -->
              <h3
                class="text-white text-[20px] md:text-[24px] leading-[36px] font-medium mt-[8.7px]"
                style="font-family: 'Bricolage Grotesque', sans-serif;"
              >
                {{ step.title }}
              </h3>
              <!-- Description -->
              <p
                class="text-white text-[14px] md:text-[16px] leading-[26px] font-normal mt-auto"
                style="font-family: 'Bricolage Grotesque', sans-serif;"
              >
                {{ step.description }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════
         BUILD YOUR BRAND CTA
         ═══════════════════════════════════════════ -->
    <section class="py-16 md:py-20 bg-white text-center">
      <div class="max-w-[700px] mx-auto px-6">
        <h2
          class="text-brand-teal-500 text-[40px] md:text-[64px] leading-[1.2] font-medium mb-0"
          style="font-family: 'Fredoka', sans-serif;"
        >
          Build Your Brand
        </h2>
        <p
          class="text-black text-[16px] md:text-[18px] leading-[28px] font-normal mb-[30px]"
          style="font-family: 'Bricolage Grotesque', sans-serif;"
        >
          Let's Build Something Powerful.
        </p>
        <NuxtLink
          to="/contact"
          class="inline-flex items-center justify-center gap-[5px] px-6 md:px-8 py-2.5 bg-brand-yellow-500 text-[#201F1F] text-[16px] md:text-[20px] font-bold rounded-full hover:brightness-95 transition-all"
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

.methodology-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease, opacity 0.8s ease;
}

.methodology-card:hover {
  transform: translateY(-8px) !important;
  box-shadow: 0 20px 30px rgba(5, 150, 184, 0.35);
  transition-delay: 0s !important;
}
</style>
