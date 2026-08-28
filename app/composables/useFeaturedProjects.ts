import type { ResolvedFeaturedProject } from '~/types/featured-project'

export function useFeaturedProjects() {
  // `fetchPromise` is forwarded so the consuming component can await it. It
  // used to be dropped, which meant two things: the homepage SSR'd an empty
  // Featured Work grid, and the un-awaited fetch was left dangling — fatal on
  // Cloudflare, where an isolate outliving the request turns that promise into a
  // permanent block for later readers (see the note in usePortfolio).
  const { projects, fetchPromise } = usePortfolio()

  const featuredProjects = computed<ResolvedFeaturedProject[]>(() => {
    return projects.value
      .filter(p => p.featured !== false)
      .map((p, i) => ({
        id: i + 1,
        title: p.title,
        slug: p.slug,
        category: p.subtitle,
        image_path: p.image,
        image_url: p.image,
        description: p.story,
        display_order: p.displayOrder ?? (i + 1),
        featured: p.featured !== false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }))
      .sort((a, b) => a.display_order - b.display_order)
  })

  return {
    projects: featuredProjects,
    fetchPromise,
    pending: ref(false),
    error: ref<Error | null>(null)
  }
}
