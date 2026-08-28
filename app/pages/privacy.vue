<script setup lang="ts">
useSeoMeta({
  title: 'Privacy Policy — Macawoo',
  description: 'At Macawoo, we value your trust and are committed to protecting your personal information. Read our Privacy Policy to understand how we collect, use, and protect your data.',
  ogTitle: 'Privacy Policy — Macawoo',
  ogDescription: 'At Macawoo, we value your trust and are committed to protecting your personal information. Read our Privacy Policy to understand how we collect, use, and protect your data.'
})

const siteUrl = 'https://macawoo.co'
useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        '@id': `${siteUrl}/privacy#webpage`,
        'url': `${siteUrl}/privacy`,
        'name': 'Privacy Policy — Macawoo',
        'description': 'At Macawoo, we value your trust and are committed to protecting your personal information.',
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
        Privacy Policy
      </h1>
      <p class="text-xs text-zinc-500 mb-8">
        Effective Date: July 27, 2026
      </p>

      <!-- Introduction -->
      <div class="text-zinc-700 leading-relaxed mb-8">
        <p class="mb-4">
          At Macawoo, we value your trust and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, store, and protect the information you share with us through our website, digital platforms, and other communication channels. By accessing our website or using our services, you agree to the practices described in this Privacy Policy.
        </p>
      </div>

      <!-- Content Flow -->
      <div class="space-y-8 text-zinc-700 leading-relaxed">
        <!-- 1. ABOUT MACAWOO -->
        <section id="about">
          <h2 class="text-xl font-medium font-fredoka text-brand-teal-500 mb-3">
            1. ABOUT MACAWOO
          </h2>
          <p>
            Macawoo is a brand strategy and creative agency that helps businesses build, communicate, and grow through strategic branding, visual content production, video production, and digital marketing solutions.
          </p>
        </section>

        <!-- 2. Information We Collect -->
        <section id="collect">
          <h2 class="text-xl font-medium font-fredoka text-brand-teal-500 mb-3">
            2. Information We Collect
          </h2>
          <p class="mb-3">
            We may collect:
          </p>
          <div class="space-y-3 pl-4">
            <p>
              <span class="font-semibold text-zinc-900">2.1. Personal Information</span> like Full Name, Company Name, Email Address, Phone Number, Business Location, Job Title, Project Requirements, and any other information you voluntarily provide to us.
            </p>
            <p>
              <span class="font-semibold text-zinc-900">2.2. Technical Information</span> such as IP Address, Browser Type, Device Information, Pages Visited, Website Usage Data, Referral Source, and other technical information.
            </p>
            <p>
              <span class="font-semibold text-zinc-900">2.3. Marketing Information</span> such as Communication preferences, Responses to campaigns, Social media interactions, and other related information.
            </p>
          </div>
        </section>

        <!-- 3. How We Collect Information -->
        <section id="how-collect">
          <h2 class="text-xl font-medium font-fredoka text-brand-teal-500 mb-3">
            3. How We Collect Information
          </h2>
          <p class="mb-3">
            We collect information when you:
          </p>
          <div class="space-y-2 pl-4">
            <p>3.1. Submit an enquiry through our website</p>
            <p>3.2. Fill out a contact or consultation form</p>
            <p>3.3. Request a quotation</p>
            <p>3.4. Communicate with us through email, WhatsApp, or phone</p>
            <p>3.5. Engage with our social media platforms</p>
            <p>3.6. Subscribe to newsletters or marketing communications</p>
            <p>3.7. Browse our website using cookies and analytics tools</p>
          </div>
        </section>

        <!-- 4. HOW WE USE YOUR INFORMATION -->
        <section id="use">
          <h2 class="text-xl font-medium font-fredoka text-brand-teal-500 mb-3">
            4. HOW WE USE YOUR INFORMATION
          </h2>
          <p class="mb-3">
            Your information helps us:
          </p>
          <div class="space-y-2 pl-4 mb-4">
            <p>4.1. Respond to enquiries and provide branding, creative, and digital marketing services</p>
            <p>4.2. Prepare proposals and quotations</p>
            <p>4.3. Manage client projects</p>
            <p>4.4. Improve our website and user experience</p>
            <p>4.5. Send relevant updates and marketing communications</p>
            <p>4.6. Conduct market research and business analytics</p>
            <p>4.7. Meet legal and regulatory obligations</p>
          </div>
          <p class="font-semibold text-zinc-900">
            All your information collected is used for legitimate business purposes.
          </p>
        </section>

        <!-- 5. COOKIES AND TRACKING TECHNOLOGIES -->
        <section id="cookies">
          <h2 class="text-xl font-medium font-fredoka text-brand-teal-500 mb-3">
            5. COOKIES AND TRACKING TECHNOLOGIES
          </h2>
          <p class="mb-3">
            Our website may use cookies and similar technologies to:
          </p>
          <div class="space-y-2 pl-4 mb-3">
            <p>5.1. Understand visitor behaviour</p>
            <p>5.2. Improve website performance</p>
            <p>5.3. Remember user preferences</p>
            <p>5.4. Measure marketing campaign effectiveness</p>
            <p>5.5. Analyze website traffic</p>
          </div>
          <p class="text-sm text-zinc-500">
            The cookies can be dissolved through your browser settings.
          </p>
        </section>

        <!-- 6. SHARING YOUR INFORMATION -->
        <section id="sharing">
          <h2 class="text-xl font-medium font-fredoka text-brand-teal-500 mb-3">
            6. SHARING YOUR INFORMATION
          </h2>
          <p class="mb-3">
            Macawoo does not sell or rent your personal information. We may share information only with:
          </p>
          <div class="space-y-2 pl-4 mb-4">
            <p>6.1. Authorized employees working on your project</p>
            <p>6.2. Trusted technology providers and hosting partners</p>
            <p>6.3. Payment processing providers (where applicable)</p>
            <p>6.4. Professional advisers</p>
            <p>6.5. Government authorities where legally required</p>
          </div>
          <p class="text-sm">
            All external service providers are required to uphold suitable confidentiality and security measures.
          </p>
        </section>

        <!-- 7. DATA SECURITY -->
        <section id="security">
          <h2 class="text-xl font-medium font-fredoka text-brand-teal-500 mb-3">
            7. DATA SECURITY
          </h2>
          <div class="space-y-2">
            <p>7.1. We implement reasonable administrative, technical, and organizational measures to protect your information against unauthorized access, alteration, disclosure, or loss.</p>
            <p>7.2. While we strive to use commercially acceptable means to protect your information, no method of internet transmission or electronic storage is completely secure.</p>
          </div>
        </section>

        <!-- 8. DATA RETENTION -->
        <section id="retention">
          <h2 class="text-xl font-medium font-fredoka text-brand-teal-500 mb-3">
            8. DATA RETENTION
          </h2>
          <p class="mb-3">
            We retain your personal information only for as long as necessary to:
          </p>
          <div class="space-y-2 pl-4 mb-3">
            <p>8.1. Deliver our services</p>
            <p>8.2. Maintain project records</p>
            <p>8.3. Fulfil legal obligations</p>
            <p>8.4. Resolve disputes</p>
            <p>8.5. Enforce contractual agreements</p>
          </div>
          <p>When information is no longer needed, it is safely erased or anonymized when suitable.</p>
        </section>

        <!-- 9. YOUR RIGHTS -->
        <section id="rights">
          <h2 class="text-xl font-medium font-fredoka text-brand-teal-500 mb-3">
            9. YOUR RIGHTS
          </h2>
          <p class="mb-3">
            Based on relevant legislation, you might have the entitlement to:
          </p>
          <div class="space-y-2 pl-4 mb-3">
            <p>9.1. Access your personal information</p>
            <p>9.2. Correct inaccurate information</p>
            <p>9.3. Request deletion of your information</p>
            <p>9.4. Withdraw consent for marketing communications</p>
            <p>9.5. Request a copy of your stored data</p>
            <p>9.6. Object to certain processing activities</p>
          </div>
          <p>Inquiries may be sent using the contact information listed below.</p>
        </section>

        <!-- 10. THIRD-PARTY LINKS -->
        <section id="links">
          <h2 class="text-xl font-medium font-fredoka text-brand-teal-500 mb-3">
            10. THIRD-PARTY LINKS
          </h2>
          <div class="space-y-2">
            <p>10.1. Our website may contain links to third-party websites that are not under our control.</p>
            <p>10.2. We are not responsible for the privacy practices or content of these websites. We encourage you to review the privacy policies of those third parties.</p>
          </div>
        </section>

        <!-- 11. INTERNATIONAL CLIENTS -->
        <section id="international">
          <h2 class="text-xl font-medium font-fredoka text-brand-teal-500 mb-3">
            11. INTERNATIONAL CLIENTS
          </h2>
          <div class="space-y-2">
            <p>11.1. Macawoo works with businesses across India, the GCC, Australia, Canada, South Africa, and other international markets.</p>
            <p>11.2. By communicating with us, you acknowledge that your information may be processed in accordance with this Privacy Policy and applicable laws governing our operations.</p>
          </div>
        </section>

        <!-- 12. AMENDMENTS TO THIS PRIVACY POLICY -->
        <section id="amendments">
          <h2 class="text-xl font-medium font-fredoka text-brand-teal-500 mb-3">
            12. AMENDMENTS TO THIS PRIVACY POLICY
          </h2>
          <div class="space-y-2">
            <p>12.1. We may update this Privacy Policy from time to time to reflect changes in our services, technology, or legal requirements.</p>
            <p>12.2. The updated version will be published on this page with a revised Effective Date.</p>
          </div>
        </section>

        <!-- 13. CONTACT US -->
        <section id="contact">
          <h2 class="text-xl font-medium font-fredoka text-brand-teal-500 mb-3">
            13. CONTACT US
          </h2>
          <p class="mb-4">
            13.1. If you have any questions regarding this Privacy Policy or how your information is handled, please contact us at
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
