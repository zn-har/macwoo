/* eslint-disable @typescript-eslint/no-explicit-any */
import { projects as defaultProjects } from '~/data/portfolio'
import type { PortfolioProject } from '~/data/portfolio'

export interface AdminPortfolioProject extends PortfolioProject {
  featured?: boolean
  displayOrder?: number
}

const initialProjects: AdminPortfolioProject[] = defaultProjects.map((p, i) => ({
  ...p,
  featured: true,
  displayOrder: i + 1
}))

let cachedProjects: AdminPortfolioProject[] | null = null
let cacheTime = 0
let activeFetchPromise: Promise<void> | null = null
const CACHE_TTL = 300000 // 5 minutes

export function usePortfolio() {
  const getSupabase = useSupabaseLazy()
  const projects = useState<AdminPortfolioProject[]>('portfolio', () => [])

  const fetchProjects = async () => {
    // Read through the Nitro endpoint, not Supabase directly: it keeps
    // `@supabase/supabase-js` out of the browser bundle and lets Cloudflare
    // edge-cache the response.
    const load = async () => {
      const data = await $fetch<AdminPortfolioProject[]>('/api/public/portfolio')
      if (data) {
        cachedProjects = data
        cacheTime = Date.now()
        projects.value = data
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
        console.error('Error fetching /api/public/portfolio:', e)
      }
      return
    }

    if (cachedProjects && (Date.now() - cacheTime < CACHE_TTL)) {
      projects.value = cachedProjects
      return
    }

    if (activeFetchPromise) {
      try {
        await activeFetchPromise
      } catch {
        // fall through to a fresh attempt below
      }
      if (cachedProjects) {
        projects.value = cachedProjects
        return
      }
    }

    activeFetchPromise = (async () => {
      try {
        await load()
      } catch (e) {
        console.error('Error fetching /api/public/portfolio:', e)
      } finally {
        activeFetchPromise = null
      }
    })()

    await activeFetchPromise
  }

  // Trigger fetch on server or if empty
  let fetchPromise: Promise<void> | null = null
  if (import.meta.server || projects.value.length === 0) {
    fetchPromise = fetchProjects()
  }

  const resolveCategoryId = async (categoryName: string): Promise<string | null> => {
    const supabase = await getSupabase()
    const { data } = await supabase
      .from('categories')
      .select('id')
      .eq('name', categoryName)
      .limit(1)
      .maybeSingle()
    return data?.id || null
  }

  const addProject = async (project: AdminPortfolioProject) => {
    const supabase = await getSupabase()
    cachedProjects = null
    cacheTime = 0
    const categoryId = await resolveCategoryId(project.category)
    const payload = {
      slug: project.slug,
      title: project.title,
      subtitle: project.subtitle,
      tags: project.tags,
      category_id: categoryId,
      image: project.image,
      hero_image: project.heroImage,
      gallery_images: project.galleryImages,
      story: project.story,
      tagline: project.tagline || null,
      services: project.services || null,
      industry: project.industry || null,
      date: project.date || null,
      story_paragraphs: project.storyParagraphs || [],
      sort_order: project.displayOrder || (projects.value.length + 1),
      published: project.featured !== false
    }

    try {
      const { error } = await supabase
        .from('portfolio_projects')
        .insert(payload)
      if (error) throw error
      projects.value.push(project)
    } catch (e) {
      console.error('Error adding project:', e)
    }
  }

  const updateProject = async (slug: string, updated: AdminPortfolioProject) => {
    const supabase = await getSupabase()
    cachedProjects = null
    cacheTime = 0
    const categoryId = await resolveCategoryId(updated.category)
    const payload = {
      slug: updated.slug,
      title: updated.title,
      subtitle: updated.subtitle,
      tags: updated.tags,
      category_id: categoryId,
      image: updated.image,
      hero_image: updated.heroImage,
      gallery_images: updated.galleryImages,
      story: updated.story,
      tagline: updated.tagline || null,
      services: updated.services || null,
      industry: updated.industry || null,
      date: updated.date || null,
      story_paragraphs: updated.storyParagraphs || [],
      sort_order: updated.displayOrder || 1,
      published: updated.featured !== false
    }

    try {
      const { error } = await supabase
        .from('portfolio_projects')
        .update(payload)
        .eq('slug', slug)
      if (error) throw error

      const idx = projects.value.findIndex(p => p.slug === slug)
      if (idx !== -1) {
        projects.value.splice(idx, 1, updated)
      }
    } catch (e) {
      console.error('Error updating project:', e)
    }
  }

  const deleteProject = async (slug: string) => {
    const supabase = await getSupabase()
    cachedProjects = null
    cacheTime = 0
    try {
      const { error } = await supabase
        .from('portfolio_projects')
        .delete()
        .eq('slug', slug)
      if (error) throw error
      projects.value = projects.value.filter(p => p.slug !== slug)
    } catch (e) {
      console.error('Error deleting project:', e)
    }
  }

  const resetPortfolio = async () => {
    const supabase = await getSupabase()
    cachedProjects = null
    cacheTime = 0
    try {
      await supabase.from('portfolio_projects').delete().neq('slug', 'doesnotexist')
      const { data: cats } = await supabase.from('categories').select('*')
      const catMap = new Map<string, string>(cats?.map((c: any) => [c.name.toLowerCase(), c.id]) || [])

      const payloads = initialProjects.map((p, i) => ({
        slug: p.slug,
        title: p.title,
        subtitle: p.subtitle,
        tags: p.tags,
        category_id: catMap.get(p.category.toLowerCase()) || null,
        image: p.image,
        hero_image: p.heroImage,
        gallery_images: p.galleryImages,
        story: p.story,
        tagline: p.tagline || null,
        services: p.services || null,
        industry: p.industry || null,
        date: p.date || null,
        story_paragraphs: p.storyParagraphs || [],
        sort_order: i + 1,
        published: p.featured !== false
      }))

      const { error } = await supabase
        .from('portfolio_projects')
        .insert(payloads)
      if (error) throw error

      projects.value = JSON.parse(JSON.stringify(initialProjects))
    } catch (e) {
      console.error('Error resetting portfolio:', e)
    }
  }

  return {
    projects,
    addProject,
    updateProject,
    deleteProject,
    resetPortfolio,
    fetchProjects,
    fetchPromise
  }
}
