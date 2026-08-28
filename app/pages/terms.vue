<script setup lang="ts">
useSeoMeta({
  title: 'Terms and Conditions — Macawoo',
  description: 'Read the Terms and Conditions for using the Macawoo website. By accessing our site, you agree to comply with these terms.',
  ogTitle: 'Terms and Conditions — Macawoo',
  ogDescription: 'Read the Terms and Conditions for using the Macawoo website. By accessing our site, you agree to comply with these terms.'
})

const siteUrl = 'https://macawoo.co'
useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        '@id': `${siteUrl}/terms#webpage`,
        'url': `${siteUrl}/terms`,
        'name': 'Terms and Conditions — Macawoo',
        'description': 'Read the Terms and Conditions for using the Macawoo website.',
        'isPartOf': { '@id': `${siteUrl}/#website` }
      })
    }
  ]
})
</script>

<template>
  <div class="bg-white min-h-screen text-brand-dark font-sans pt-28 pb-20">
    <div class="max-w-3xl mx-auto px-6">
      <!-- Back Link -->
      <div class="mb-8">
        <NuxtLink
          to="/"
          class="text-sm text-brand-teal-500 hover:underline font-semibold"
        >
          &larr; Back to Home
        </NuxtLink>
      </div>

      <!-- Main Title -->
      <h1 class="text-4xl font-medium font-fredoka mb-4 text-brand-teal-500">
        Terms &amp; Conditions
      </h1>
      <p class="text-xs text-zinc-500 mb-8">
        Effective Date: July 27, 2026
      </p>

      <!-- Introduction -->
      <div class="text-zinc-700 leading-relaxed mb-8">
        <p>
          Welcome to the Macawoo website. By accessing or using this website, you agree to comply with these Terms and Conditions. If you do not agree with these terms, please refrain from using our website.
        </p>
      </div>

      <!-- Content Flow -->
      <div class="space-y-8 text-zinc-700 leading-relaxed">
        <!-- ABOUT MACAWOO -->
        <section id="about">
          <h2 class="text-xl font-medium font-fredoka text-brand-teal-500 mb-3">
            ABOUT MACAWOO
          </h2>
          <p>
            Macawoo is a brand strategy and creative agency offering branding, advertising, visual content production, video production, and digital marketing services. The information provided on this website is intended for general information about our company and services.
          </p>
        </section>

        <!-- USE OF THE WEBSITE -->
        <section id="usage">
          <h2 class="text-xl font-medium font-fredoka text-brand-teal-500 mb-3">
            USE OF THE WEBSITE
          </h2>
          <p class="mb-3">
            You agree to use this website only for lawful purposes. You must not:
          </p>
          <ul class="list-disc pl-5 space-y-2">
            <li>Try to unlawfully enter our website or servers.</li>
            <li>Copy, reproduce, or distribute website content without written permission.</li>
            <li>Use the website in any way that may disrupt or interfere with its operation.</li>
            <li>Upload or transmit any harmful software or malicious code.</li>
          </ul>
        </section>

        <!-- INTELLECTUAL PROPERTY -->
        <section id="intellectual-property">
          <h2 class="text-xl font-medium font-fredoka text-brand-teal-500 mb-3">
            INTELLECTUAL PROPERTY
          </h2>
          <p>
            All content on this website, including text, graphics, logos, images, videos, designs, branding elements, and other creative materials, is the intellectual property of Macawoo unless otherwise stated. Any content's unauthorized use, reproduction, or distribution is firmly forbidden.
          </p>
        </section>

        <!-- ACCURACY OF INFORMATION -->
        <section id="accuracy">
          <h2 class="text-xl font-medium font-fredoka text-brand-teal-500 mb-3">
            ACCURACY OF INFORMATION
          </h2>
          <p>
            We strive to ensure the information on this website is accurate and up to date. However, Macawoo does not warrant that all information is complete, accurate, or current, and reserves the right to modify website content without prior notice.
          </p>
        </section>

        <!-- THIRD-PARTY LINKS -->
        <section id="links">
          <h2 class="text-xl font-medium font-fredoka text-brand-teal-500 mb-3">
            THIRD-PARTY LINKS
          </h2>
          <p>
            This site might include links to external websites for your ease. Macawoo does not endorse or assume responsibility for the content, policies, or practices of these external websites.
          </p>
        </section>

        <!-- LIMITATION OF LIABILITY -->
        <section id="liability">
          <h2 class="text-xl font-medium font-fredoka text-brand-teal-500 mb-3">
            LIMITATION OF LIABILITY
          </h2>
          <p>
            Macawoo shall not be liable for any direct, indirect, incidental, or consequential damages arising from the use of, or inability to use, this website or the information contained within it.
          </p>
        </section>

        <!-- PRIVACY -->
        <section id="privacy">
          <h2 class="text-xl font-medium font-fredoka text-brand-teal-500 mb-3">
            PRIVACY
          </h2>
          <p>
            Your use of this website is also subject to our
            <NuxtLink
              to="/privacy"
              class="text-brand-teal-500 hover:underline font-semibold"
            >Privacy Policy</NuxtLink>, which explains how we collect, use, and protect your personal information.
          </p>
        </section>

        <!-- AMENDMENTS TO THESE TERMS -->
        <section id="amendments">
          <h2 class="text-xl font-medium font-fredoka text-brand-teal-500 mb-3">
            AMENDMENTS TO THESE TERMS
          </h2>
          <p>
            Macawoo reserves the right to update or modify these Terms and Conditions at any time. Continued use of this website after any changes constitutes your acceptance of the revised terms.
          </p>
        </section>

        <!-- GOVERNING LAW -->
        <section id="governing-law">
          <h2 class="text-xl font-medium font-fredoka text-brand-teal-500 mb-3">
            GOVERNING LAW
          </h2>
          <p>
            These Terms and Conditions shall be governed by and interpreted in accordance with the laws of India. Any disputes arising from the use of this website shall be subject to the jurisdiction of the courts in Ernakulam, Kerala.
          </p>
        </section>

        <!-- CONTACT US -->
        <section id="contact">
          <h2 class="text-xl font-medium font-fredoka text-brand-teal-500 mb-3">
            CONTACT US
          </h2>
          <p>
            If you have any questions regarding these Terms and Conditions, please contact us at
            <a
              href="mailto:info@macawoo.co"
              class="text-brand-teal-500 hover:underline font-semibold"
            >info@macawoo.co</a>.
          </p>
        </section>
      </div>
    </div>
  </div>
</template>
