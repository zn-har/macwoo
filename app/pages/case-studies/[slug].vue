<script setup lang="ts">
const { caseStudies, fetchPromise } = useCaseStudies()
if (fetchPromise) {
  await fetchPromise
}

const route = useRoute()
const slug = route.params.slug as string
const study = computed(() => caseStudies.value.find(s => s.slug === slug))

if (!study.value) {
  throw createError({ statusCode: 404, statusMessage: 'Case study not found', fatal: true })
}

const siteUrl = 'https://macawoo.co'
const absoluteImageUrl = computed(() => {
  const img = study.value?.image
  if (!img) return `${siteUrl}/og-image.png`
  if (img.startsWith('http://') || img.startsWith('https://')) return img
  return `${siteUrl}${img.startsWith('/') ? '' : '/'}${img}`
})

useSeoMeta({
  title: () => study.value ? `${study.value.title} — Macawoo Case Study` : 'Macawoo Case Study',
  description: () => study.value ? (study.value.tagline ?? study.value.challenge.slice(0, 160)) : '',
  ogTitle: () => study.value ? `${study.value.title} — Macawoo Case Study` : 'Macawoo Case Study',
  ogDescription: () => study.value ? (study.value.tagline ?? study.value.challenge.slice(0, 160)) : '',
  ogImage: absoluteImageUrl,
  twitterCard: 'summary_large_image',
  twitterImage: absoluteImageUrl
})

useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: computed(() => {
        if (!study.value) return ''
        return JSON.stringify({
          '@context': 'https://schema.org',
          '@graph': [
            {
              '@type': 'CreativeWork',
              '@id': `${siteUrl}/case-studies/${slug}#creativework`,
              'url': `${siteUrl}/case-studies/${slug}`,
              'name': study.value.title,
              'headline': study.value.tagline,
              'description': study.value.tagline || study.value.challenge.slice(0, 160),
              'image': absoluteImageUrl.value,
              'creator': { '@id': `${siteUrl}/#organization` },
              'publisher': { '@id': `${siteUrl}/#organization` }
            },
            {
              '@type': 'BreadcrumbList',
              '@id': `${siteUrl}/case-studies/${slug}#breadcrumb`,
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
                  'name': 'Case Studies',
                  'item': `${siteUrl}/case-studies`
                },
                {
                  '@type': 'ListItem',
                  'position': 3,
                  'name': study.value.title,
                  'item': `${siteUrl}/case-studies/${slug}`
                }
              ]
            }
          ]
        })
      })
    }
  ]
})

const challengeParas = computed(() =>
  study.value?.challengeParagraphs?.length
    ? study.value.challengeParagraphs
    : [study.value?.challenge ?? '']
)

const approachParas = computed(() =>
  study.value?.approachParagraphs?.length
    ? study.value.approachParagraphs
    : [study.value?.approach ?? '']
)
</script>

<template>
  <div
    v-if="study"
    class="bg-white"
  >
    <!-- ── Hero ── -->
    <div class="site-hero-section relative">
      <div
        class="absolute inset-0 z-10 pointer-events-none"
        style="background: linear-gradient(90deg, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0) 55%)"
      />

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

      <NuxtImg
        :src="study.heroImage"
        :alt="study.title"
        preload
        format="webp"
        class="w-full h-[360px] md:h-[560px] lg:h-[640px] object-cover"
      />
    </div>

    <!-- ── Teal Info Section ── -->
    <div class="bg-[#0596B8] px-6 md:px-[120px] py-16">
      <!-- Metadata pills -->
      <div class="flex flex-wrap gap-2 mb-7">
        <span
          v-if="study.services"
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
          {{ study.services }}
        </span>

        <span
          v-if="study.industry"
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
          {{ study.industry }}
        </span>

        <span
          v-if="study.date"
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
          {{ study.date }}
        </span>
      </div>

      <!-- Title -->
      <h1
        class="font-fredoka font-medium text-[56px] md:text-[64px] text-brand-yellow-500 leading-tight mb-3"
        style="font-variation-settings: 'wdth' 100"
      >
        {{ study.title }}
      </h1>

      <!-- Tagline -->
      <p
        v-if="study.tagline"
        class="text-white text-lg leading-[24px] max-w-2xl"
      >
        {{ study.tagline }}
      </p>
    </div>

    <!-- ── Challenge / Approach / Solution ── -->
    <div class="bg-white px-6 md:px-[120px] py-16">
      <div class="max-w-[1200px] flex flex-col gap-12">
        <!-- Challenge -->
        <div class="flex flex-col gap-4">
          <h2
            class="font-fredoka font-medium text-[40px] md:text-[48px] text-[#0596B8] leading-tight"
            style="font-variation-settings: 'wdth' 100"
          >
            The Challenge
          </h2>
          <div class="space-y-5">
            <p
              v-for="(para, i) in challengeParas"
              :key="i"
              class="text-brand-dark text-lg leading-[24px]"
            >
              {{ para }}
            </p>
          </div>
        </div>

        <!-- Approach -->
        <div class="flex flex-col gap-4">
          <h2
            class="font-fredoka font-medium text-[40px] md:text-[48px] text-[#0596B8] leading-tight"
            style="font-variation-settings: 'wdth' 100"
          >
            Our Approach
          </h2>
          <div class="space-y-5">
            <p
              v-for="(para, i) in approachParas"
              :key="i"
              class="text-brand-dark text-lg leading-[24px]"
            >
              {{ para }}
            </p>
          </div>
        </div>

        <!-- Solution -->
        <div class="flex flex-col gap-4">
          <h2
            class="font-fredoka font-medium text-[40px] md:text-[48px] text-[#0596B8] leading-tight"
            style="font-variation-settings: 'wdth' 100"
          >
            The Solution
          </h2>
          <ul class="list-disc pl-7 space-y-1">
            <li
              v-for="item in study.solution"
              :key="item"
              class="text-brand-dark text-lg leading-[30px]"
            >
              {{ item }}
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- ── Results ── -->
    <div class="bg-brand-yellow-500 px-6 md:px-[120px] py-16">
      <div class="max-w-[1200px] flex flex-col gap-12">
        <!-- Heading + summary -->
        <div class="flex flex-col gap-4">
          <h2
            class="font-fredoka font-medium text-[40px] md:text-[48px] text-[#0596B8] leading-tight"
            style="font-variation-settings: 'wdth' 100"
          >
            Results
          </h2>
          <p
            v-if="study.resultsSummary"
            class="text-brand-dark text-lg leading-[24px] max-w-[1200px]"
          >
            {{ study.resultsSummary }}
          </p>
        </div>

        <!-- Metric cards -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div
            v-for="result in study.results"
            :key="result.label"
            class="bg-[#0596B8] border border-white/5 rounded-lg p-6 flex flex-col gap-2"
          >
            <span class="font-bold text-brand-yellow-500 text-[48px] md:text-[64px] leading-[64px]">
              <CountUpMetric :value="result.metric" />
            </span>
            <span class="font-semibold text-white text-xl md:text-2xl leading-[36px]">
              {{ result.label }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- ── CTA ── -->
    <div class="bg-white px-6 py-20 flex flex-col items-center text-center gap-8">
      <div class="flex flex-col gap-3">
        <h2
          class="font-fredoka font-medium text-[48px] md:text-[64px] text-[#0596B8] leading-tight"
          style="font-variation-settings: 'wdth' 100"
        >
          Want Results Like This?
        </h2>
        <p class="text-brand-dark text-lg">
          Let's Build Something Powerful.
        </p>
      </div>
      <NuxtLink
        to="/contact"
        class="bg-brand-yellow-500 inline-flex items-center gap-2 px-8 py-3 rounded-full font-bold text-brand-dark text-lg shadow-[0px_0px_4px_rgba(0,0,0,0.25)] hover:opacity-90 transition-opacity"
      >
        Start Your Project
        <svg
          class="w-5 h-5"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M7 17L17 7M17 7H7M17 7V17"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </NuxtLink>
    </div>
  </div>
</template>
