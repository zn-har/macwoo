<script setup lang="ts">
const props = defineProps<{ error: { statusCode: number, statusMessage?: string, message?: string } }>()

useHead({
  title: 'Page Not Found — Macawoo',
  meta: [
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})

function goHome() {
  clearError({ redirect: '/' })
}

function columnAlpha(i: number) {
  return Math.pow(i / 14, 1.8) * 0.95
}
</script>

<template>
  <div class="min-h-screen bg-white text-brand-dark relative overflow-hidden flex flex-col justify-between p-8 md:p-16">
    <!-- Background yellow pillar graphics top-right -->
    <div
      class="absolute top-0 right-0 w-[65%] sm:w-[55%] md:w-[50%] h-[80vh] flex pointer-events-none"
      aria-hidden="true"
    >
      <div
        v-for="i in 14"
        :key="i"
        class="flex-1 h-full"
        :style="`background: linear-gradient(to bottom, rgba(247,236,18,${columnAlpha(i)}) 0%, rgba(247,236,18,${columnAlpha(i) * 0.75}) 40%, rgba(255,255,255,0) 90%)`"
      />
    </div>

    <!-- Header Logo -->
    <div class="relative z-10">
      <NuxtLink
        to="/"
        class="inline-block"
      >
        <NuxtImg
          src="/Images/Logo.png"
          alt="Macawoo — Build. Brand. Boom."
          class="h-10 md:h-12 w-auto"
          format="webp"
        />
      </NuxtLink>
    </div>

    <!-- Main Content -->
    <div class="relative z-10 max-w-4xl my-auto py-8 md:py-16">
      <h1 class="text-5xl sm:text-6xl md:text-7xl lg:text-[84px] font-bold text-[#0596B8] leading-[1.05] tracking-tight mb-8">
        OOPS,<br>
        Something went<br>
        wrong :(
      </h1>

      <p class="text-zinc-900 font-extrabold text-sm sm:text-base md:text-lg mb-8 max-w-lg">
        {{ props.error?.statusCode === 404 ? "We couldn't find the page you were looking for." : (props.error?.message || "We couldn't find the page you were looking for.") }}
      </p>

      <button
        class="inline-flex items-center gap-2 px-6 py-2.5 bg-brand-yellow-500 text-brand-dark font-bold text-sm md:text-base rounded-full hover:bg-brand-yellow-400 transition-all duration-200 shadow-sm hover:shadow group"
        @click="goHome"
      >
        <span>Back to Home</span>
        <UpRightArrow class="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </button>
    </div>

    <!-- Bottom Spacing -->
    <div class="relative z-10 h-6" />
  </div>
</template>
