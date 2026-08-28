<script setup lang="ts">
const { jobs, fetchPromise: careersPromise } = useCareers()
const { settings, fetchPromise: settingsPromise } = usePageSettings()

await Promise.all([
  careersPromise || Promise.resolve(),
  settingsPromise || Promise.resolve()
])

useSeoMeta({
  title: 'Careers at Macawoo — Join Our Creative & Strategy Team',
  description: 'Build your future with Macawoo. We are a collection of visionaries, builders, and storytellers. Join us in crafting digital experiences that demand attention and drive transformation.',
  ogTitle: 'Careers at Macawoo — Join Our Creative & Strategy Team',
  ogDescription: 'Build your future with Macawoo. We are a collection of visionaries, builders, and storytellers. Join us in crafting digital experiences that demand attention and drive transformation.'
})

const siteUrl = 'https://macawoo.co'
useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'AboutPage',
        '@id': `${siteUrl}/careers#webpage`,
        'url': `${siteUrl}/careers`,
        'name': 'Careers at Macawoo — Join Our Creative & Strategy Team',
        'description': 'Build your future with Macawoo. Join us in crafting digital experiences that demand attention and drive transformation.',
        'isPartOf': { '@id': `${siteUrl}/#website` }
      })
    }
  ]
})

const isModalOpen = ref(false)

const handleJobClick = (job: typeof jobs.value[number]) => {
  if (job.applyUrl) {
    window.open(job.applyUrl, '_blank', 'noopener,noreferrer')
  } else {
    isModalOpen.value = true
  }
}
</script>

<template>
  <div class="relative bg-brand-dark">
    <!-- Absolute Back button -->
    <NuxtLink
      to="/"
      class="absolute top-8 left-8 z-30 inline-flex items-center gap-2 px-5 py-2.5 bg-white text-brand-dark rounded-full text-sm font-bold shadow-md hover:scale-105 hover:bg-zinc-50 transition-all cursor-pointer border border-zinc-200/50"
    >
      <LeftArrow
        class="w-[11px] h-[11px] shrink-0 text-brand-dark"
      />
      Back
    </NuxtLink>

    <!-- Page Hero -->
    <PageHero
      title-html="<span class='text-brand-yellow-500'>Build Your Future<br>With Macawoo</span>"
      :video="settings.careersHeroVideo"
      :image="settings.careersHeroImage"
      description="We are a collection of visionaries, builders, and storytellers. Join us in crafting digital experiences that demand attention and drive transformation."
      :ctas="[{ label: 'View Open Roles ', to: '#open-roles', variant: 'white', showDownArrow: true }]"
      show-grid
      min-height=""
      class="custom-hero-ratio"
    />

    <!-- We Engineer Digital Excellence -->
    <section class="py-20 bg-[#0596B8] text-white">
      <div class="max-w-7xl mx-auto px-6">
        <div class="flex flex-col lg:flex-row gap-12 lg:gap-16 items-center">
          <!-- Left side Content (2/3 width on desktop) -->
          <div class="lg:w-7/12 flex flex-col items-start">
            <h2 class="text-[38px] md:text-[52px] font-medium text-[#F7EC12] mb-6 leading-[1.2] font-fredoka">
              We Engineer<br>Digital Excellence.
            </h2>
            <p
              class="text-white text-base md:text-[20px] leading-[1.5] mb-8 font-normal max-w-2xl"
              style="font-family: 'Bricolage Grotesque', sans-serif;"
            >
              At Macawoo, we don't just execute; we architect. We value raw creative energy paired with executive-level precision. Here, your work isn't just a project—it's a strategic asset for ambitious founders. We foster an environment where bold ideas are stress-tested and brilliant execution is the baseline.
            </p>
            <!-- Two yellow cards -->
            <div class="grid sm:grid-cols-2 gap-5 w-full">
              <div class="bg-[#F7EC12] text-black p-6 rounded-2xl flex flex-col items-start text-left">
                <UIcon
                  name="i-lucide-rocket"
                  class="w-6 h-6 text-black mb-3 shrink-0"
                />
                <h3
                  class="font-bold text-[18px] text-black mb-1"
                  style="font-family: 'Bricolage Grotesque', sans-serif;"
                >
                  Accelerated Growth
                </h3>
                <p
                  class="text-black text-xs md:text-[13px] leading-relaxed"
                  style="font-family: 'Bricolage Grotesque', sans-serif;"
                >
                  Continuous learning and opportunities to lead high-impact initiatives.
                </p>
              </div>
              <div class="bg-[#F7EC12] text-black p-6 rounded-2xl flex flex-col items-start text-left">
                <UIcon
                  name="i-lucide-users"
                  class="w-6 h-6 text-black mb-3 shrink-0"
                />
                <h3
                  class="font-bold text-[18px] text-black mb-1"
                  style="font-family: 'Bricolage Grotesque', sans-serif;"
                >
                  Visionary Team
                </h3>
                <p
                  class="text-black text-xs md:text-[13px] leading-relaxed"
                  style="font-family: 'Bricolage Grotesque', sans-serif;"
                >
                  Collaborate with top-tier talent pushing the boundaries of design and tech.
                </p>
              </div>
            </div>
          </div>

          <!-- Right side Image Card (1/3 width on desktop) -->
          <div class="lg:w-5/12 w-full flex justify-center lg:justify-end">
            <div class="relative w-full max-w-[380px] aspect-[3/4] rounded-[2.5rem] overflow-hidden shadow-md border border-white/10 bg-zinc-200">
              <NuxtImg
                v-if="settings.careersMiddleImage"
                :src="settings.careersMiddleImage"
                alt="Careers Macawoo"
                format="webp"
                class="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Open Roles -->
    <section
      id="open-roles"
      class="py-20 bg-[#0596B8] text-white"
    >
      <div class="max-w-7xl mx-auto px-6">
        <h2 class="text-3xl md:text-[46px] font-medium text-brand-yellow-500 mb-2 uppercase tracking-wide">
          Open Roles
        </h2>
        <p class="text-white/80 text-sm mb-12">
          Find your place among the visionaries.
        </p>

        <div class="border-t border-brand-yellow-500">
          <div
            v-for="job in jobs"
            :key="job.id"
            class="border-b border-brand-yellow-500 py-8 px-6 md:px-8 flex flex-col md:flex-row md:items-center justify-between gap-6 cursor-pointer group transition-all duration-300 ease-out hover:bg-[#F7EC12] hover:rounded-[12px] hover:border-b-transparent"
            @click="handleJobClick(job)"
          >
            <!-- Left Side: Dept/Loc + Job Title -->
            <div class="flex-1">
              <p class="text-white/70 group-hover:text-[#0596B8]/70 text-xs font-semibold uppercase tracking-wider mb-2 transition-colors duration-300">
                {{ job.department }} · {{ job.location }}
              </p>
              <h3 class="text-2xl md:text-3xl lg:text-[36px] font-semibold text-brand-yellow-500 group-hover:text-[#0596B8] uppercase tracking-wide transition-colors duration-300">
                {{ job.title }}
              </h3>
            </div>

            <!-- Right Side: Experience + Type Pill + Yellow Arrow -->
            <div class="flex items-center gap-6 md:gap-8 shrink-0 flex-wrap sm:flex-nowrap">
              <span class="text-white group-hover:text-[#0596B8] text-sm md:text-base font-semibold tracking-wide transition-colors duration-300">
                {{ job.experience }}
              </span>
              <span class="text-white group-hover:text-[#0596B8] text-xs font-bold border border-white group-hover:border-[#0596B8] px-5 py-2 rounded-full tracking-wider uppercase transition-colors duration-300">
                {{ job.type }}
              </span>
              <!-- Arrow icon -->
              <UpRightArrow
                class="w-8 h-8 md:w-10 md:h-10 text-brand-yellow-500 group-hover:text-[#0596B8] transition-all group-hover:rotate-90 group-hover:translate-x-1 group-hover:translate-y-1 duration-300"
              />
            </div>
          </div>
        </div>
      </div>
    </section>

    <ModalCareers v-model="isModalOpen" />
  </div>
</template>
