/* eslint-disable @typescript-eslint/no-explicit-any */
import { caseStudies as defaultCaseStudies } from '~/data/case-studies'
import type { CaseStudy } from '~/data/case-studies'

let cachedCaseStudies: CaseStudy[] | null = null
let cacheTime = 0
let activeFetchPromise: Promise<void> | null = null
const CACHE_TTL = 300000 // 5 minutes

export function useCaseStudies() {
  const getSupabase = useSupabaseLazy()
  const caseStudies = useState<CaseStudy[]>('caseStudies', () => [])

  const fetchCaseStudies = async () => {
    // Read through the Nitro endpoint, not Supabase directly: it keeps
    // `@supabase/supabase-js` out of the browser bundle and lets Cloudflare
    // edge-cache the response.
    const load = async () => {
      const data = await $fetch<CaseStudy[]>('/api/public/case-studies')
      if (data) {
        cachedCaseStudies = data
        cacheTime = Date.now()
        caseStudies.value = data
      }
    }

    // The module-level memo is CLIENT-ONLY on purpose.
    //
    // On the server this module lives in a Cloudflare isolate that is reused
    // across requests, and a promise created for request A cannot be awaited by
    // request B — workerd cancels A's pending I/O the moment A's response is
    // sent, so that promise never settles. Any caller that starts this fetch
    // without awaiting it (a component rendering its own data, say) would
    // therefore leave `activeFetchPromise` permanently pending and every later
    // request would block on it forever. Server-side repetition is absorbed by
    // the edge cache on /api/public/* instead.
    if (import.meta.server) {
      try {
        await load()
      } catch (e) {
        console.error('Error fetching /api/public/case-studies:', e)
      }
      return
    }

    if (cachedCaseStudies && (Date.now() - cacheTime < CACHE_TTL)) {
      caseStudies.value = cachedCaseStudies
      return
    }

    if (activeFetchPromise) {
      try {
        await activeFetchPromise
      } catch {
        // fall through to a fresh attempt below
      }
      if (cachedCaseStudies) {
        caseStudies.value = cachedCaseStudies
        return
      }
    }

    activeFetchPromise = (async () => {
      try {
        await load()
      } catch (e) {
        console.error('Error fetching /api/public/case-studies:', e)
      } finally {
        activeFetchPromise = null
      }
    })()

    await activeFetchPromise
  }

  // Trigger fetch on server or if empty
  let fetchPromise: Promise<void> | null = null
  if (import.meta.server || caseStudies.value.length === 0) {
    fetchPromise = fetchCaseStudies()
  }

  const resolveCategoryId = async (categoryName: string | undefined): Promise<string | null> => {
    const supabase = await getSupabase()
    if (!categoryName) return null
    const { data } = await supabase
      .from('categories')
      .select('id')
      .eq('name', categoryName)
      .limit(1)
      .maybeSingle()
    return data?.id || null
  }

  const addCaseStudy = async (study: CaseStudy) => {
    const supabase = await getSupabase()
    cachedCaseStudies = null
    cacheTime = 0
    const categoryId = await resolveCategoryId(study.category)
    const payload = {
      slug: study.slug,
      title: study.title,
      client: study.client,
      tags: study.tags,
      category_id: categoryId,
      image: study.image,
      hero_image: study.heroImage,
      tagline: study.tagline || null,
      services: study.services || null,
      industry: study.industry || null,
      date: study.date || null,
      challenge: study.challenge || null,
      challenge_paragraphs: study.challengeParagraphs || [],
      approach: study.approach || null,
      approach_paragraphs: study.approachParagraphs || [],
      solution: study.solution || [],
      results: study.results as any,
      results_summary: study.resultsSummary || null,
      sort_order: caseStudies.value.length + 1,
      published: true
    }

    try {
      const { error } = await supabase
        .from('case_studies')
        .insert(payload)
      if (error) throw error
      caseStudies.value.push(study)
    } catch (e) {
      console.error('Error adding case study:', e)
    }
  }

  const updateCaseStudy = async (slug: string, updated: CaseStudy) => {
    const supabase = await getSupabase()
    cachedCaseStudies = null
    cacheTime = 0
    const categoryId = await resolveCategoryId(updated.category)
    const payload = {
      slug: updated.slug,
      title: updated.title,
      client: updated.client,
      tags: updated.tags,
      category_id: categoryId,
      image: updated.image,
      hero_image: updated.heroImage,
      tagline: updated.tagline || null,
      services: updated.services || null,
      industry: updated.industry || null,
      date: updated.date || null,
      challenge: updated.challenge || null,
      challenge_paragraphs: updated.challengeParagraphs || [],
      approach: updated.approach || null,
      approach_paragraphs: updated.approachParagraphs || [],
      solution: updated.solution || [],
      results: updated.results as any,
      results_summary: updated.resultsSummary || null,
      published: true
    }

    try {
      const { error } = await supabase
        .from('case_studies')
        .update(payload)
        .eq('slug', slug)
      if (error) throw error

      const idx = caseStudies.value.findIndex(s => s.slug === slug)
      if (idx !== -1) {
        caseStudies.value.splice(idx, 1, updated)
      }
    } catch (e) {
      console.error('Error updating case study:', e)
    }
  }

  const deleteCaseStudy = async (slug: string) => {
    const supabase = await getSupabase()
    cachedCaseStudies = null
    cacheTime = 0
    try {
      const { error } = await supabase
        .from('case_studies')
        .delete()
        .eq('slug', slug)
      if (error) throw error
      caseStudies.value = caseStudies.value.filter(s => s.slug !== slug)
    } catch (e) {
      console.error('Error deleting case study:', e)
    }
  }

  const resetCaseStudies = async () => {
    const supabase = await getSupabase()
    cachedCaseStudies = null
    cacheTime = 0
    try {
      await supabase.from('case_studies').delete().neq('slug', 'doesnotexist')
      const { data: cats } = await supabase.from('categories').select('*')
      const catMap = new Map<string, string>(cats?.map((c: any) => [c.name.toLowerCase(), c.id]) || [])

      const payloads = defaultCaseStudies.map((s, i) => ({
        slug: s.slug,
        title: s.title,
        client: s.client,
        tags: s.tags,
        category_id: catMap.get(s.category?.toLowerCase() || '') || null,
        image: s.image,
        hero_image: s.heroImage,
        tagline: s.tagline || null,
        services: s.services || null,
        industry: s.industry || null,
        date: s.date || null,
        challenge: s.challenge || null,
        challenge_paragraphs: s.challengeParagraphs || [],
        approach: s.approach || null,
        approach_paragraphs: s.approachParagraphs || [],
        solution: s.solution || [],
        results: s.results as any,
        results_summary: s.resultsSummary || null,
        sort_order: i + 1,
        published: true
      }))

      const { error } = await supabase
        .from('case_studies')
        .insert(payloads)
      if (error) throw error

      caseStudies.value = JSON.parse(JSON.stringify(defaultCaseStudies))
    } catch (e) {
      console.error('Error resetting case studies:', e)
    }
  }

  return {
    caseStudies,
    addCaseStudy,
    updateCaseStudy,
    deleteCaseStudy,
    resetCaseStudies,
    fetchCaseStudies,
    fetchPromise
  }
}
