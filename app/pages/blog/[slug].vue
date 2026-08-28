<script setup lang="ts">
import LeftArrow from '~/components/LeftArrow.vue'

const { posts, fetchPromise } = useBlogs()
if (fetchPromise) {
  await fetchPromise
}

const route = useRoute()
const slug = route.params.slug as string
const post = computed(() => posts.value.find(p => p.slug === slug))

if (!post.value) {
  throw createError({ statusCode: 404, statusMessage: 'Post not found', fatal: true })
}

const siteUrl = 'https://macawoo.co'
const absoluteImageUrl = computed(() => {
  const img = post.value?.image
  if (!img) return `${siteUrl}/og-image.png`
  if (img.startsWith('http://') || img.startsWith('https://')) return img
  return `${siteUrl}${img.startsWith('/') ? '' : '/'}${img}`
})

const publishedIso = computed(() => post.value?.date ? new Date(post.value.date).toISOString() : undefined)
const articleBody = computed(() =>
  (post.value?.body || []).map(s => [s.heading, s.content].filter(Boolean).join(' ')).join('\n\n')
)
const wordCount = computed(() => articleBody.value ? articleBody.value.trim().split(/\s+/).length : 0)
const category = computed(() => (post.value as { category?: string } | undefined)?.category)

useSeoMeta({
  title: () => post.value ? `${post.value.title} — Macawoo Blog` : 'Macawoo Blog',
  description: () => post.value ? post.value.excerpt : '',
  keywords: () => [post.value?.title, category.value, 'Macawoo blog', 'branding', 'digital marketing'].filter(Boolean).join(', '),
  ogTitle: () => post.value ? `${post.value.title} — Macawoo Blog` : 'Macawoo Blog',
  ogDescription: () => post.value ? post.value.excerpt : '',
  ogType: 'article',
  ogImage: absoluteImageUrl,
  articlePublishedTime: publishedIso,
  articleSection: category,
  twitterCard: 'summary_large_image',
  twitterImage: absoluteImageUrl
})

useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: computed(() => {
        if (!post.value) return ''
        return JSON.stringify({
          '@context': 'https://schema.org',
          '@graph': [
            {
              '@type': 'BlogPosting',
              '@id': `${siteUrl}/blog/${slug}#blogposting`,
              'url': `${siteUrl}/blog/${slug}`,
              'mainEntityOfPage': `${siteUrl}/blog/${slug}`,
              'headline': post.value.title,
              'description': post.value.excerpt,
              'inLanguage': 'en',
              'datePublished': publishedIso.value,
              'dateModified': publishedIso.value,
              'articleSection': category.value || undefined,
              'keywords': [post.value.title, category.value].filter(Boolean).join(', '),
              'wordCount': wordCount.value || undefined,
              'image': absoluteImageUrl.value,
              'author': {
                '@type': 'Organization',
                'name': 'Macawoo',
                'url': siteUrl
              },
              'publisher': { '@id': `${siteUrl}/#organization` },
              'isPartOf': {
                '@type': 'WebPage',
                '@id': `${siteUrl}/blog/${slug}#webpage`,
                'url': `${siteUrl}/blog/${slug}`,
                'name': `${post.value.title} — Macawoo Blog`
              }
            },
            {
              '@type': 'BreadcrumbList',
              '@id': `${siteUrl}/blog/${slug}#breadcrumb`,
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
                },
                {
                  '@type': 'ListItem',
                  'position': 3,
                  'name': post.value.title,
                  'item': `${siteUrl}/blog/${slug}`
                }
              ]
            }
          ]
        })
      })
    }
  ]
})

const recommended = computed(() => posts.value.filter(p => p.slug !== slug).slice(0, 3))

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase()
}
</script>

<template>
  <div v-if="post">
    <!-- Hero image -->
    <div class="site-hero-section relative w-full h-[500px] md:h-[698px] overflow-hidden">
      <NuxtImg
        :src="post.image"
        :alt="post.title"
        preload
        format="webp"
        class="w-full h-full object-cover"
      />
      <div class="absolute inset-0 bg-black/20" />
      <button
        type="button"
        class="absolute top-8 md:top-[90px] left-6 md:left-[120px] bg-white flex items-center gap-[3px] px-5 py-[10px] rounded-full font-extrabold text-[16px] text-[#201f1f] leading-[28px] hover:bg-zinc-100 transition-colors z-10 cursor-pointer"
        @click="$router.back()"
      >
        <LeftArrow
          class="w-[12px] h-[12px] shrink-0 transition-transform duration-300 ease-out group-hover/cta:translate-x-[2px] group-hover/cta:-translate-y-[2px]"
        />
        Back
      </button>
    </div>

    <!-- Article header on teal -->
    <div class="bg-[#0596B8]">
      <div class="max-w-[1440px] mx-auto px-6 md:px-[120px] pt-[59px] pb-[40px]">
        <div class="max-w-[894px]">
          <div class="flex gap-[15px] mb-[13px]">
            <span class="border border-white rounded-full px-[9px] py-[5px] text-[16px] font-['Bricolage_Grotesque'] text-white leading-[28px] whitespace-nowrap">
              {{ formatDate(post.date) }}
            </span>
            <span class="border border-white rounded-full px-[9px] py-[5px] text-[16px] font-['Bricolage_Grotesque'] text-white leading-[28px] flex items-center gap-[5px] whitespace-nowrap">
              <svg
                class="w-[18px] h-[18px] shrink-0"
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
          <h1 class="font-fredoka font-medium text-[48px] text-[#F7EC12] leading-[51px] mb-[14px]">
            {{ post.title }}
          </h1>
          <p class="text-[18px] font-['Bricolage_Grotesque'] font-normal text-white leading-relaxed">
            {{ post.excerpt }}
          </p>
        </div>
      </div>
    </div>

    <!-- Article body (white) -->
    <article class="bg-white">
      <div class="max-w-[1440px] mx-auto px-6 md:px-[120px] py-[34px]">
        <div class="flex flex-col gap-[34px]">
          <div
            v-for="section in post.body"
            :key="section.heading ?? section.content"
            class="flex flex-col gap-[14px]"
          >
            <h2
              v-if="section.heading"
              class="font-fredoka font-medium text-[32px] text-[#0596B8] leading-normal"
            >
              {{ section.heading }}
            </h2>
            <p class="text-[18px] font-['Bricolage_Grotesque'] font-normal text-black leading-relaxed">
              {{ section.content }}
            </p>
          </div>
        </div>
      </div>
    </article>

    <!-- Recommended reading -->
    <section class="bg-[#0596B8] py-16">
      <div class="max-w-[1440px] mx-auto px-6 md:px-[120px]">
        <h2 class="font-fredoka font-medium text-[48px] text-[#F7EC12] leading-[51px] mb-8">
          Recommended Reading
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <NuxtLink
            v-for="rec in recommended"
            :key="rec.slug"
            :to="`/blog/${rec.slug}`"
            class="group blog-card flex flex-row md:flex-col items-center md:items-stretch bg-white rounded-[24px] md:rounded-[34px] p-3.5 md:p-0 gap-4 md:gap-0 overflow-hidden"
          >
            <div class="w-[100px] h-[100px] md:w-full md:h-[337px] overflow-hidden rounded-[16px] md:rounded-none md:rounded-t-[34px] bg-zinc-200 shrink-0">
              <NuxtImg
                :src="rec.image"
                :alt="rec.title"
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
                  {{ formatDate(rec.date) }}
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
                  {{ rec.readTime }}
                </span>
              </div>
              <h3
                class="text-[18px] md:text-[24px] font-medium text-[#201f1f] leading-tight mt-1 md:mt-2.5"
                style="font-family: 'Bricolage Grotesque', sans-serif;"
              >
                {{ rec.title }}
              </h3>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>
