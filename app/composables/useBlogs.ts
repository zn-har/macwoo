/* eslint-disable @typescript-eslint/no-explicit-any */
import { posts as defaultPosts } from '~/data/blog'
import type { BlogPost } from '~/data/blog'

let cachedPosts: BlogPost[] | null = null
let cacheTime = 0
let activeFetchPromise: Promise<void> | null = null
const CACHE_TTL = 300000 // 5 minutes

export function useBlogs() {
  const getSupabase = useSupabaseLazy()
  const posts = useState<BlogPost[]>('blogs', () => [])

  const fetchBlogs = async () => {
    // Read through the Nitro endpoint, not Supabase directly: it keeps
    // `@supabase/supabase-js` out of the browser bundle and lets Cloudflare
    // edge-cache the response.
    const load = async () => {
      const data = await $fetch<BlogPost[]>('/api/public/blogs')
      if (data) {
        cachedPosts = data
        cacheTime = Date.now()
        posts.value = data
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
        console.error('Error fetching /api/public/blogs:', e)
      }
      return
    }

    if (cachedPosts && (Date.now() - cacheTime < CACHE_TTL)) {
      posts.value = cachedPosts
      return
    }

    if (activeFetchPromise) {
      try {
        await activeFetchPromise
      } catch {
        // fall through to a fresh attempt below
      }
      if (cachedPosts) {
        posts.value = cachedPosts
        return
      }
    }

    activeFetchPromise = (async () => {
      try {
        await load()
      } catch (e) {
        console.error('Error fetching /api/public/blogs:', e)
      } finally {
        activeFetchPromise = null
      }
    })()

    await activeFetchPromise
  }

  // Trigger fetch on server or if empty
  let fetchPromise: Promise<void> | null = null
  if (import.meta.server || posts.value.length === 0) {
    fetchPromise = fetchBlogs()
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

  const addPost = async (post: BlogPost & { category?: string }) => {
    const supabase = await getSupabase()
    cachedPosts = null
    cacheTime = 0
    const categoryId = await resolveCategoryId(post.category)
    const payload = {
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      date: post.date,
      read_time: post.readTime,
      image: post.image,
      body: post.body as any,
      category_id: categoryId,
      published: true
    }

    try {
      const { error } = await supabase
        .from('blog_posts')
        .insert(payload)
      if (error) throw error
      posts.value.unshift(post)
    } catch (e) {
      console.error('Error adding blog post:', e)
    }
  }

  const updatePost = async (slug: string, updated: BlogPost & { category?: string }) => {
    const supabase = await getSupabase()
    cachedPosts = null
    cacheTime = 0
    const categoryId = await resolveCategoryId(updated.category)
    const payload = {
      slug: updated.slug,
      title: updated.title,
      excerpt: updated.excerpt,
      date: updated.date,
      read_time: updated.readTime,
      image: updated.image,
      body: updated.body as any,
      category_id: categoryId,
      published: true
    }

    try {
      const { error } = await supabase
        .from('blog_posts')
        .update(payload)
        .eq('slug', slug)
      if (error) throw error

      const idx = posts.value.findIndex(p => p.slug === slug)
      if (idx !== -1) {
        posts.value.splice(idx, 1, updated)
      }
    } catch (e) {
      console.error('Error updating blog post:', e)
    }
  }

  const deletePost = async (slug: string) => {
    const supabase = await getSupabase()
    cachedPosts = null
    cacheTime = 0
    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('slug', slug)
      if (error) throw error
      posts.value = posts.value.filter(p => p.slug !== slug)
    } catch (e) {
      console.error('Error deleting blog post:', e)
    }
  }

  const resetBlogs = async () => {
    const supabase = await getSupabase()
    cachedPosts = null
    cacheTime = 0
    try {
      await supabase.from('blog_posts').delete().neq('slug', 'doesnotexist')
      const { data: cats } = await supabase.from('categories').select('*')
      const catMap = new Map<string, string>(cats?.map((c: any) => [c.name.toLowerCase(), c.id]) || [])

      // We'll map default posts with some logical categories
      const getCategoryForPost = (slug: string): string | null => {
        if (slug.includes('storytelling') || slug.includes('identity') || slug.includes('packaging')) {
          return catMap.get('branding') || null
        }
        if (slug.includes('social') || slug.includes('roi')) {
          return catMap.get('marketing') || null
        }
        if (slug.includes('video')) {
          return catMap.get('video production') || null
        }
        return null
      }

      const payloads = defaultPosts.map((p, i) => ({
        slug: p.slug,
        title: p.title,
        excerpt: p.excerpt,
        date: p.date,
        read_time: p.readTime,
        image: p.image,
        body: p.body as any,
        category_id: getCategoryForPost(p.slug),
        published: true,
        sort_order: i + 1
      }))

      const { error } = await supabase
        .from('blog_posts')
        .insert(payloads)
      if (error) throw error

      posts.value = JSON.parse(JSON.stringify(defaultPosts))
    } catch (e) {
      console.error('Error resetting blogs:', e)
    }
  }

  return {
    posts,
    addPost,
    updatePost,
    deletePost,
    resetBlogs,
    fetchBlogs,
    fetchPromise
  }
}
