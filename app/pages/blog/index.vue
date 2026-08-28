<script setup lang="ts">
const { posts, fetchPromise: blogsPromise } = useBlogs()
const { settings, fetchPromise: settingsPromise } = usePageSettings()

await Promise.all([
  blogsPromise || Promise.resolve(),
  settingsPromise || Promise.resolve()
])

useSeoMeta({
  title: 'Blog & Insights — Creative and Strategic Branding Agency | Macawoo',
  description: 'Ideas, insights, and expert perspectives on branding strategy, creative direction, and digital marketing from Macawoo.',
  keywords: 'creative and strategic branding agency, brand strategy blog, design strategy, creative agency journal',
  ogTitle: 'Blog & Insights — Creative and Strategic Branding Agency | Macawoo',
  ogDescription: 'Ideas, insights, and expert perspectives on branding strategy, creative direction, and digital marketing from Macawoo.'
})

const siteUrl = 'https://macawoo.co'
useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: computed(() => JSON.stringify({
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'Blog',
            '@id': `${siteUrl}/blog#webpage`,
            'url': `${siteUrl}/blog`,
            'name': 'Macawoo Blog — Insights on Branding, Design & Marketing',
            'description': 'Ideas, insights & stories that drive brands. The Macawoo journal on branding, marketing, and creative strategy.',
            'inLanguage': 'en',
            'isPartOf': { '@id': `${siteUrl}/#website` },
            'publisher': { '@id': `${siteUrl}/#organization` },
            'blogPost': posts.value.map(p => ({
              '@type': 'BlogPosting',
              'headline': p.title,
              'description': p.excerpt,
              'url': `${siteUrl}/blog/${p.slug}`,
              'datePublished': p.date ? new Date(p.date).toISOString() : undefined,
              'image': p.image?.startsWith('http') ? p.image : `${siteUrl}${p.image?.startsWith('/') ? '' : '/'}${p.image}`,
              'author': { '@id': `${siteUrl}/#organization` }
            }))
          },
          {
            '@type': 'ItemList',
            '@id': `${siteUrl}/blog#postlist`,
            'itemListElement': posts.value.map((p, i) => ({
              '@type': 'ListItem',
              'position': i + 1,
              'url': `${siteUrl}/blog/${p.slug}`,
              'name': p.title
            }))
          },
          {
            '@type': 'BreadcrumbList',
            '@id': `${siteUrl}/blog#breadcrumb`,
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
                'name': 'Blog',
                'item': `${siteUrl}/blog`
              }
            ]
          }
        ]
      }))
    }
  ]
})

const POSTS_PER_PAGE = 6
const currentPage = ref(1)
const totalPages = computed(() => Math.ceil(posts.value.length / POSTS_PER_PAGE))
const paginatedPosts = computed(() => {
  const start = (currentPage.value - 1) * POSTS_PER_PAGE
  return posts.value.slice(start, start + POSTS_PER_PAGE)
})

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase()
}
</script>

<template>
  <div>
    <PageHero
      variant="teal"
      title-html="Ideas, Insights &amp; Stories<br>That Drive Brands"
      :video="settings.blogHeroVideo"
      :image="settings.blogHeroImage"
      class="custom-hero-ratio"
      show-grid
    />

    <section class="bg-[#0596B8] py-16 pb-20">
      <div class="max-w-[1440px] mx-auto px-6 md:px-[120px]">
        <h2 class="font-fredoka font-medium text-[36px] md:text-[48px] text-[#F7EC12] leading-tight mb-12">
          Latest Articles
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <NuxtLink
            v-for="post in paginatedPosts"
            :key="post.slug"
            :to="`/blog/${post.slug}`"
            class="group blog-card flex flex-row md:flex-col items-center md:items-stretch bg-white rounded-[24px] md:rounded-[34px] p-3.5 md:p-0 gap-4 md:gap-0 overflow-hidden"
          >
            <div class="w-[100px] h-[100px] md:w-full md:h-[337px] overflow-hidden rounded-[16px] md:rounded-none md:rounded-t-[34px] bg-zinc-200 shrink-0">
              <NuxtImg
                :src="post.image"
                :alt="post.title"
                loading="lazy"
                format="webp"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div class="flex-1 flex flex-col gap-2 md:gap-[10px] px-0 md:px-[21px] py-0 md:pt-[14px] md:pb-[18px] bg-white rounded-b-[24px] md:rounded-b-[34px]">
              <div class="flex gap-2 flex-wrap">
                <span class="border border-[#201f1f] rounded-full px-2.5 py-1 text-[12px] md:text-[14px] text-[#201f1f] leading-none flex items-center gap-1.5 whitespace-nowrap">
                  <svg
                    class="w-[14px] h-[14px] shrink-0"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.5"
                  >
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                  {{ formatDate(post.date) }}
                </span>
                <span class="border border-[#201f1f] rounded-full px-2.5 py-1 text-[12px] md:text-[14px] text-[#201f1f] leading-none flex items-center gap-1.5 whitespace-nowrap">
                  <svg
                    class="w-[14px] h-[14px] shrink-0"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.5"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="9"
                    />
                    <path
                      d="M12 7v5l3 3"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                  {{ post.readTime }}
                </span>
              </div>
              <h3
                class="text-[18px] md:text-[24px] font-medium text-[#201f1f] leading-tight mt-1 md:mt-2.5"
                style="font-family: 'Bricolage Grotesque', sans-serif;"
              >
                {{ post.title }}
              </h3>
            </div>
          </NuxtLink>
        </div>

        <div
          v-if="totalPages > 1"
          class="flex items-center justify-end gap-[10px] mt-14"
        >
          <button
            :disabled="currentPage === 1"
            class="w-[41px] h-[41px] rounded-full border border-[#F7EC12] flex items-center justify-center text-[#F7EC12] disabled:opacity-40 hover:bg-[#F7EC12]/10 transition-colors cursor-pointer"
            @click="currentPage = Math.max(1, currentPage - 1)"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
            >
              <path
                d="M9 2L4 7L9 12"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>
          <span class="text-[18px] font-medium text-white whitespace-nowrap">
            Page: {{ String(currentPage).padStart(2, '0') }}
          </span>
          <button
            :disabled="currentPage === totalPages"
            class="w-[41px] h-[41px] rounded-full border border-[#F7EC12] flex items-center justify-center text-[#F7EC12] disabled:opacity-40 hover:bg-[#F7EC12]/10 transition-colors cursor-pointer"
            @click="currentPage = Math.min(totalPages, currentPage + 1)"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
            >
              <path
                d="M5 2L10 7L5 12"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </section>
  </div>
</template>
