export interface Category {
  id: string
  name: string
  slug: string
  sort_order: number
}

let cachedCategories: Category[] | null = null
let cacheTime = 0
let activeFetchPromise: Promise<void> | null = null
const CACHE_TTL = 300000 // 5 minutes

export function useCategories() {
  const getSupabase = useSupabaseLazy()
  const dbCategories = useState<Category[]>('db_categories', () => [])
  const categories = computed(() => dbCategories.value.map(c => c.name))

  const fetchCategories = async () => {
    // Read through the Nitro endpoint, not Supabase directly: it keeps
    // `@supabase/supabase-js` out of the browser bundle and lets Cloudflare
    // edge-cache the response.
    const load = async () => {
      const data = await $fetch<Category[]>('/api/public/categories')
      if (data) {
        cachedCategories = data
        cacheTime = Date.now()
        dbCategories.value = data
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
        console.error('Error fetching /api/public/categories:', e)
      }
      return
    }

    if (cachedCategories && (Date.now() - cacheTime < CACHE_TTL)) {
      dbCategories.value = cachedCategories
      return
    }

    if (activeFetchPromise) {
      try {
        await activeFetchPromise
      } catch {
        // fall through to a fresh attempt below
      }
      if (cachedCategories) {
        dbCategories.value = cachedCategories
        return
      }
    }

    activeFetchPromise = (async () => {
      try {
        await load()
      } catch (e) {
        console.error('Error fetching /api/public/categories:', e)
      } finally {
        activeFetchPromise = null
      }
    })()

    await activeFetchPromise
  }

  // Trigger fetch on server or if empty
  let fetchPromise: Promise<void> | null = null
  if (import.meta.server || dbCategories.value.length === 0) {
    fetchPromise = fetchCategories()
  }

  const addCategory = async (catName: string) => {
    const supabase = await getSupabase()
    cachedCategories = null
    cacheTime = 0
    const trimmed = catName.trim()
    if (!trimmed) return
    if (dbCategories.value.some(c => c.name.toLowerCase() === trimmed.toLowerCase())) return

    const slug = trimmed.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    const sortOrder = dbCategories.value.length + 1

    try {
      const { data, error } = await supabase
        .from('categories')
        .insert({ name: trimmed, slug, sort_order: sortOrder })
        .select()
        .single()
      if (error) throw error
      if (data) {
        dbCategories.value.push(data)
      }
    } catch (e) {
      console.error('Error adding category:', e)
    }
  }

  const deleteCategory = async (catName: string) => {
    const supabase = await getSupabase()
    cachedCategories = null
    cacheTime = 0
    const target = dbCategories.value.find(c => c.name === catName)
    if (!target) return
    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', target.id)
      if (error) throw error
      dbCategories.value = dbCategories.value.filter(c => c.id !== target.id)
    } catch (e) {
      console.error('Error deleting category:', e)
    }
  }

  const resetCategories = async () => {
    const supabase = await getSupabase()
    cachedCategories = null
    cacheTime = 0
    const defaults = [
      { name: 'Branding', slug: 'branding', sort_order: 1 },
      { name: 'Marketing', slug: 'marketing', sort_order: 2 },
      { name: 'Video Production', slug: 'video-production', sort_order: 3 },
      { name: 'Digital Marketing', slug: 'digital-marketing', sort_order: 4 }
    ]
    try {
      // Clear all
      await supabase.from('categories').delete().neq('id', '00000000-0000-0000-0000-000000000000')
      const { data, error } = await supabase
        .from('categories')
        .insert(defaults)
        .select()
      if (error) throw error
      if (data) {
        dbCategories.value = data
      }
    } catch (e) {
      console.error('Error resetting categories:', e)
    }
  }

  return {
    dbCategories,
    categories,
    addCategory,
    deleteCategory,
    resetCategories,
    fetchCategories,
    fetchPromise
  }
}
