<script setup lang="ts">
const { projects, fetchPromise: portfolioPromise } = usePortfolio()
if (portfolioPromise) {
  await portfolioPromise
}

useSeoMeta({
  title: 'Portfolio Showcase — Creative and Strategic Branding Agency | Macawoo',
  description: 'Explore selected works by Macawoo, a creative and strategic branding agency. A curated showcase of brand identities, campaigns, and visual design.',
  ogTitle: 'Portfolio Showcase — Creative and Strategic Branding Agency | Macawoo',
  ogDescription: 'Explore selected works by Macawoo, a creative and strategic branding agency. A curated showcase of brand identities, campaigns, and visual design.'
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
            '@type': 'CollectionPage',
            '@id': `${siteUrl}/portfolio#webpage`,
            'url': `${siteUrl}/portfolio`,
            'name': 'Macawoo Portfolio — Selected Branding & Design Work',
            'description': 'Work that speaks. Results that matter. A curated showcase of our finest projects.',
            'isPartOf': { '@id': `${siteUrl}/#website` }
          },
          {
            '@type': 'BreadcrumbList',
            '@id': `${siteUrl}/portfolio#breadcrumb`,
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
              }
            ]
          }
        ]
      })
    }
  ]
})

const filtered = computed(() => projects.value)

const pairs = computed(() => {
  const result = []
  for (let i = 0; i < filtered.value.length; i += 2) {
    result.push(filtered.value.slice(i, i + 2))
  }
  return result
})
</script>

<template>
  <div>
    <PageHero
      title-html="Work That Speaks.<br><em class='not-italic text-brand-yellow-500'>Results That Matter.</em>"
      video="/Background_Videos/Portfolio.mp4"
      image="/Images/Marketing.jpeg"
      description="A curated selection of our finest projects, demonstrating our commitment to visionary design and strategic execution."
      class="custom-hero-ratio"
      show-grid
    />

    <div class="bg-[#0596B8]">
      <!-- Portfolio grid -->
      <div class="max-w-[1200px] mx-auto px-6 pt-10 sm:pt-16 pb-16">
        <div
          v-if="filtered.length"
          class="flex flex-col gap-10"
        >
          <div
            v-for="(pair, pairIndex) in pairs"
            :key="pairIndex"
            class="flex flex-col md:flex-row gap-10 items-start"
          >
            <template v-if="pairIndex % 2 === 0">
              <PortfolioCard
                v-if="pair[0]"
                :project="pair[0]"
                size="large"
              />
              <PortfolioCard
                v-if="pair[1]"
                :project="pair[1]"
                size="small"
              />
            </template>
            <template v-else>
              <PortfolioCard
                v-if="pair[0]"
                :project="pair[0]"
                size="small"
              />
              <PortfolioCard
                v-if="pair[1]"
                :project="pair[1]"
                size="large"
              />
            </template>
          </div>
        </div>
        <div
          v-else
          class="py-20 text-center text-white/60"
        >
          No projects in this category yet.
        </div>
      </div>

      <!-- Pagination -->
      <div class="max-w-[1200px] mx-auto px-6 pb-16 flex justify-end">
        <div class="flex items-center gap-3">
          <button class="w-[41px] h-[41px] rounded-full flex items-center justify-center bg-white shadow-[0_2px_8px_rgba(0,0,0,0.12)] hover:opacity-80 transition-opacity">
            <LeftArrow class="w-[45%] h-[45%]" />
          </button>
          <span class="font-medium text-white text-lg">Page: 01</span>
          <button class="w-[41px] h-[41px] rounded-full flex items-center justify-center bg-white shadow-[0_2px_8px_rgba(0,0,0,0.12)] hover:opacity-80 transition-opacity">
            <RightArrow class="w-[45%] h-[45%]" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
