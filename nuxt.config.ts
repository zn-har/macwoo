import { defineNuxtConfig } from 'nuxt/config'

// Nitro injects `unenv/polyfill/process` as a side-effect import at the
// Cloudflare worker entry. unenv v2's polyfill wraps `process` in a Proxy whose
// `get` trap forwards reads using the Proxy itself as the `receiver`. unenv's
// Process class implements stdout/stderr/stdin as getters backed by private
// fields (`get stdout(){ return this.#stdout ??= ... }`); when the getter runs
// with the Proxy as `this` it throws "Cannot read private member #t from an
// object whose class did not declare it", which crashes the Function on publish.
// Nitro resolves this polyfill to an absolute path before user aliases apply,
// so we patch the module source at bundle time to forward reads against the
// real target object (the getter's home) instead of the Proxy.
function fixUnenvProcessPolyfill() {
  return {
    name: 'fix-unenv-process-polyfill',
    load(id: string) {
      if (!id.replace(/\\/g, '/').endsWith('unenv/dist/runtime/polyfill/process.mjs')) {
        return null
      }
      return `import processModule from "node:process";
const originalProcess = globalThis["process"];
globalThis.process = originalProcess ? new Proxy(originalProcess, {
  get(target, prop) {
    if (Reflect.has(target, prop)) {
      return Reflect.get(target, prop, target);
    }
    return Reflect.get(processModule, prop, processModule);
  }
}) : processModule;
export default globalThis.process;
`
    }
  }
}

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
    '@nuxt/image',
    '@nuxtjs/seo'
  ],

  devtools: {
    enabled: true
  },

  css: ['~/assets/css/main.css'],

  site: {
    url: process.env.NUXT_PUBLIC_SITE_URL || 'https://macawoo.co',
    name: 'Macawoo',
    description: 'Macawoo is a leading creative and strategic branding agency. We blend raw creative energy with executive-level precision to craft brands that command attention and drive growth.',
    defaultLocale: 'en'
  },

  ui: {
    theme: {
      colors: ['primary', 'secondary']
    }
  },

  runtimeConfig: {
    resendApiKey: process.env.RESEND_API_KEY || '',
    contactRecipientEmail: process.env.CONTACT_RECIPIENT_EMAIL || '',
    turnstileSecretKey: process.env.TURNSTILE_SECRET_KEY || '',
    public: {
      supabaseUrl: process.env.SUPABASE_URL || 'https://vewmzejakdfsgsyxdlpa.supabase.co',
      supabaseKey: process.env.SUPABASE_KEY || 'sb_publishable_SjN1foafYhhbb3k-DI82Aw_xsjStWt_',
      turnstileSiteKey: process.env.TURNSTILE_SITE_KEY || '0x4AAAAAADmur0Me-uiKizSt'
    }
  },

  image: {
    // NOTE: `provider: 'none'` is the honest description of what actually runs
    // here. On the cloudflare-pages preset there is no IPX handler (it needs
    // sharp, which cannot run on Workers), so <NuxtImg> emits the original URL
    // untouched — `format`, `quality` and `screens` below are inert.
    //
    // To make them real, enable Cloudflare image transformations on the zone and
    // switch to `provider: 'cloudflare'` with `cloudflare: { baseURL: <site url> }`.
    // Until then, keep source assets pre-optimised.
    provider: 'none',
    format: ['webp', 'avif', 'png', 'jpg'],
    quality: 80,
    screens: {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      '2xl': 1536
    }
  },

  routeRules: {
    // Homepage hero/featured content comes from Supabase at request time.
    '/': { prerender: false, headers: { 'cache-control': 's-maxage=60, stale-while-revalidate=300' } },
    // Cache static assets aggressively
    '/_nuxt/**': { headers: { 'cache-control': 'public, max-age=31536000, immutable' } },
    '/Images/**': { headers: { 'cache-control': 'public, max-age=86400, stale-while-revalidate=604800' } },
    '/Icons/**': { headers: { 'cache-control': 'public, max-age=86400, stale-while-revalidate=604800' } },
    // Hero background videos are multi-megabyte and effectively immutable —
    // without this they were re-downloaded on every visit.
    '/Background_Videos/**': { headers: { 'cache-control': 'public, max-age=2592000, stale-while-revalidate=604800' } },
    // Public read endpoints are edge-cacheable; the handlers set the same
    // s-maxage, this makes the intent explicit at the route level.
    '/api/public/**': { headers: { 'cache-control': 'public, max-age=0, s-maxage=60, stale-while-revalidate=600' } },
    // Content pages are SSR'd from Supabase. A short edge TTL with a long
    // stale-while-revalidate window keeps cold Supabase latency off the
    // critical path without holding stale content for long.
    '/about': { headers: { 'cache-control': 's-maxage=60, stale-while-revalidate=600' } },
    '/contact': { headers: { 'cache-control': 's-maxage=60, stale-while-revalidate=600' } },
    '/careers': { headers: { 'cache-control': 's-maxage=60, stale-while-revalidate=600' } },
    '/blog': { headers: { 'cache-control': 's-maxage=60, stale-while-revalidate=600' } },
    '/blog/**': { headers: { 'cache-control': 's-maxage=60, stale-while-revalidate=600' } },
    '/portfolio': { headers: { 'cache-control': 's-maxage=60, stale-while-revalidate=600' } },
    '/portfolio/**': { headers: { 'cache-control': 's-maxage=60, stale-while-revalidate=600' } },
    '/case-studies': { headers: { 'cache-control': 's-maxage=60, stale-while-revalidate=600' } },
    '/case-studies/**': { headers: { 'cache-control': 's-maxage=60, stale-while-revalidate=600' } },
    '/services/**': { headers: { 'cache-control': 's-maxage=60, stale-while-revalidate=600' } },
    // Admin area is client-rendered SPA. Prerendering the SPA shells ensures
    // Cloudflare Pages serves them directly, avoiding 404s.
    '/admin': { ssr: false },
    '/admin/**': { ssr: false }
  },

  compatibilityDate: '2025-01-15',

  nitro: {
    preset: 'cloudflare-pages',
    rollupConfig: {
      plugins: [fixUnenvProcessPolyfill()]
    },
    prerender: {
      crawlLinks: true,
      // sitemap.xml is intentionally NOT prerendered — it pulls blog/portfolio/
      // case-study slugs from Supabase, and a build-time snapshot would miss
      // content published after deploy.
      routes: ['/admin', '/admin/login', '/robots.txt']
    }
  },

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  },

  ogImage: {
    enabled: false
  },

  robots: {
    disallow: ['/admin', '/admin/*']
  },

  // nuxt-schema-org (bundled in @nuxtjs/seo) ships a broken UnheadSchemaOrg
  // import that 500s under the cloudflare runtime. Disable it and inject
  // Organization + WebSite JSON-LD manually in app.vue instead.
  schemaOrg: {
    enabled: false
  },

  sitemap: {
    exclude: ['/admin/**'],
    sources: [
      '/api/sitemap-urls'
    ]
  }
})
