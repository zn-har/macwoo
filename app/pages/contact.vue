<script setup lang="ts">
import { ref, reactive } from 'vue'

const { settings } = usePageSettings()

useSeoMeta({
  title: 'Contact Macawoo — Creative & Strategic Branding Agency',
  description: 'Connect with Macawoo, a leading creative and strategic branding agency. Let\'s partner to craft brand strategies that command attention and drive exponential growth.',
  ogTitle: 'Contact Macawoo — Creative & Strategic Branding Agency',
  ogDescription: 'Connect with Macawoo, a leading creative and strategic branding agency. Let\'s partner to craft brand strategies that command attention and drive exponential growth.'
})

const siteUrl = 'https://macawoo.co'
useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'ContactPage',
        '@id': `${siteUrl}/contact#webpage`,
        'url': `${siteUrl}/contact`,
        'name': 'Contact Macawoo — Creative & Strategic Branding Agency',
        'description': 'Connect with Macawoo, a leading creative and strategic branding agency.',
        'isPartOf': { '@id': `${siteUrl}/#website` }
      })
    }
  ]
})

const services = ['Branding & Design', 'Digital Marketing', 'Video Production', 'Others']
const form = reactive({ name: '', service: '', email: '', phone: '', message: '' })

const isSubmitting = ref(false)
const isSubmitted = ref(false)
const errorMsg = ref('')

const turnstileRef = ref<any>(null)
const turnstileToken = ref('')

const handleVerify = (token: string) => {
  turnstileToken.value = token
  errorMsg.value = ''
}

const handleExpire = () => {
  turnstileToken.value = ''
}

const handleSubmit = async () => {
  if (!turnstileToken.value) {
    errorMsg.value = 'Please complete the security verification.'
    return
  }

  isSubmitting.value = true
  errorMsg.value = ''
  try {
    await $fetch('/api/contact', {
      method: 'POST',
      body: {
        name: form.name,
        service: form.service,
        email: form.email,
        phone: form.phone,
        message: form.message,
        token: turnstileToken.value
      }
    })
    isSubmitted.value = true

    // Reset form
    form.name = ''
    form.service = ''
    form.email = ''
    form.phone = ''
    form.message = ''

    if (turnstileRef.value) {
      turnstileRef.value.reset()
    }
    turnstileToken.value = ''

    // Clear success message after 5 seconds
    setTimeout(() => {
      isSubmitted.value = false
    }, 5000)
  } catch (err: unknown) {
    console.error('Failed to submit form:', err)
    const fetchError = err as { data?: { statusMessage?: string } }
    errorMsg.value = fetchError.data?.statusMessage || 'Failed to send your request. Please try again or email us directly.'
    if (turnstileRef.value) {
      turnstileRef.value.reset()
    }
    turnstileToken.value = ''
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div>
    <PageHero
      title-html="<em class='not-italic text-brand-yellow-500'>Let's Build Something Powerful.</em>"
      :video="settings.contactHeroVideo"
      description="Ready to elevate your brand? Drop us a line and let's start crafting a narrative that commands attention and drives results."
      class="custom-hero-ratio"
      show-grid
    />

    <!-- Form + Direct Lines -->
    <section class="py-24 bg-brand-yellow-500">
      <div class="max-w-7xl mx-auto px-6">
        <div class="flex flex-col lg:flex-row gap-12 lg:gap-20 items-center justify-center">
          <!-- Form -->
          <div class="w-full lg:max-w-[600px]">
            <div
              v-if="isSubmitted"
              class="bg-brand-yellow-500 rounded-[24px] min-h-[400px] flex flex-col items-start justify-center px-10 py-12 animate-success-pop"
            >
              <h3 class="text-[32px] md:text-[40px] font-medium text-brand-dark leading-tight flex items-center gap-3 animate-success-text">
                Message Sent
                <svg
                  class="w-7 h-7 md:w-8 md:h-8 text-brand-dark animate-success-arrow"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2.5"
                    d="M7 17L17 7M17 7H8M17 7v9"
                  />
                </svg>
              </h3>
            </div>

            <form
              v-else
              class="space-y-5"
              @submit.prevent="handleSubmit"
            >
              <div
                v-if="errorMsg"
                class="p-4 bg-rose-950/45 border border-rose-500/35 text-rose-200 rounded-xl text-sm font-semibold leading-relaxed"
              >
                {{ errorMsg }}
              </div>

              <div class="grid sm:grid-cols-2 gap-x-2.5 gap-y-5">
                <div>
                  <label class="block text-xl text-black mb-2 pl-2">Full Name</label>
                  <input
                    v-model="form.name"
                    type="text"
                    required
                    placeholder="John Doe"
                    class="w-full h-[45px] px-4 rounded-[11px] border border-black bg-transparent text-base text-brand-dark focus:outline-none focus:ring-2 focus:ring-black placeholder:text-brand-dark/40"
                  >
                </div>
                <div>
                  <label class="block text-xl text-black mb-2 pl-2">Select Service's</label>
                  <div class="relative">
                    <select
                      v-model="form.service"
                      required
                      class="w-full h-[45px] px-4 pr-10 rounded-[11px] border border-black bg-transparent text-base focus:outline-none focus:ring-2 focus:ring-black appearance-none"
                      :class="form.service ? 'text-brand-dark' : 'text-brand-dark/40'"
                    >
                      <option
                        value=""
                        disabled
                      >
                        Select Services
                      </option>
                      <option
                        v-for="s in services"
                        :key="s"
                        :value="s"
                      >
                        {{ s }}
                      </option>
                    </select>
                    <svg
                      class="w-4 h-4 text-black absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <div class="grid sm:grid-cols-2 gap-x-2.5 gap-y-5">
                <div>
                  <label class="block text-xl text-black mb-2 pl-2">Email</label>
                  <input
                    v-model="form.email"
                    type="email"
                    required
                    placeholder="john@gmail.com"
                    class="w-full h-[45px] px-4 rounded-[11px] border border-black bg-transparent text-base text-brand-dark focus:outline-none focus:ring-2 focus:ring-black placeholder:text-brand-dark/40"
                  >
                </div>
                <div>
                  <label class="block text-xl text-black mb-2 pl-2">Phone Number</label>
                  <input
                    v-model="form.phone"
                    type="tel"
                    required
                    placeholder="+91 00000 00000"
                    class="w-full h-[45px] px-4 rounded-[11px] border border-black bg-transparent text-base text-brand-dark focus:outline-none focus:ring-2 focus:ring-black placeholder:text-brand-dark/40"
                  >
                </div>
              </div>

              <div>
                <label class="block text-xl text-black mb-2 pl-2">Message</label>
                <textarea
                  v-model="form.message"
                  required
                  rows="4"
                  placeholder="Tell us about your project, goals, and any specific requirements. We'll get back to you shortly."
                  class="w-full h-[114px] px-4 py-3 rounded-[11px] border border-black bg-transparent text-base text-brand-dark focus:outline-none focus:ring-2 focus:ring-black placeholder:text-brand-dark/40 resize-none"
                />
              </div>

              <!-- Cloudflare Turnstile -->
              <Turnstile
                ref="turnstileRef"
                @verify="handleVerify"
                @expire="handleExpire"
                @error="handleExpire"
              />

              <button
                type="submit"
                :disabled="isSubmitting"
                class="w-full h-[43px] bg-white text-[#201F1F] text-xl font-bold rounded-full hover:bg-zinc-100 transition-colors flex items-center justify-center gap-3 disabled:opacity-75 disabled:pointer-events-none cursor-pointer"
              >
                <span v-if="isSubmitting">Submitting...</span>
                <template v-else>
                  Get Started
                  <svg
                    class="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2.5"
                      d="M7 17L17 7M17 7H8M17 7v9"
                    />
                  </svg>
                </template>
              </button>
            </form>
          </div>

          <!-- Direct Lines -->
          <div class="w-full lg:w-[416px] shrink-0">
            <div class="bg-brand-teal-500 rounded-[21px] p-7 lg:min-h-[410px] text-white">
              <h3 class="font-fredoka font-medium text-[32px] mt-5 mb-10">
                Direct Lines
              </h3>
              <div class="space-y-4">
                <div class="flex gap-3.5 items-center">
                  <svg
                    class="w-6 h-6 shrink-0"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z" />
                  </svg>
                  <div>
                    <p class="font-fredoka font-medium text-xl">
                      Email Us
                    </p>
                    <a
                      href="mailto:info@macawoo.co"
                      class="text-lg font-medium hover:underline break-all"
                    >
                      info@macawoo.co
                    </a>
                  </div>
                </div>

                <div class="flex gap-3.5 items-center">
                  <svg
                    class="w-6 h-6 shrink-0"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                  </svg>
                  <div>
                    <p class="font-fredoka font-medium text-xl">
                      Call Us
                    </p>
                    <a
                      href="tel:+919747477502"
                      class="text-lg font-medium hover:underline"
                    >
                      +91 97474 77502
                    </a>
                  </div>
                </div>

                <div class="flex gap-3.5 items-center">
                  <svg
                    class="w-6 h-6 shrink-0"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 0 1 0-5 2.5 2.5 0 0 1 0 5z" />
                  </svg>
                  <div>
                    <p class="font-fredoka font-medium text-xl">
                      Location
                    </p>
                    <p class="text-lg font-medium">
                      Kerala | UAE
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
