export interface ClientLogo {
  id: string
  image_url: string
  alt: string
  sort_order: number
}

let cachedLogos: ClientLogo[] | null = null
let cacheTime = 0
let activeFetchPromise: Promise<void> | null = null
const CACHE_TTL = 300000 // 5 minutes

export function useClientLogos() {
  const getSupabase = useSupabaseLazy()
  const logos = useState<ClientLogo[]>('db_client_logos', () => [])

  const fetchLogos = async () => {
    // Read through the Nitro endpoint, not Supabase directly: it keeps
    // `@supabase/supabase-js` out of the browser bundle and lets Cloudflare
    // edge-cache the response.
    const load = async () => {
      const data = await $fetch<ClientLogo[]>('/api/public/client-logos')
      if (data) {
        cachedLogos = data
        cacheTime = Date.now()
        logos.value = data
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
        console.error('Error fetching /api/public/client-logos:', e)
      }
      return
    }

    if (cachedLogos && (Date.now() - cacheTime < CACHE_TTL)) {
      logos.value = cachedLogos
      return
    }

    if (activeFetchPromise) {
      try {
        await activeFetchPromise
      } catch {
        // fall through to a fresh attempt below
      }
      if (cachedLogos) {
        logos.value = cachedLogos
        return
      }
    }

    activeFetchPromise = (async () => {
      try {
        await load()
      } catch (e) {
        console.error('Error fetching /api/public/client-logos:', e)
      } finally {
        activeFetchPromise = null
      }
    })()

    await activeFetchPromise
  }

  // Trigger fetch on server or if empty
  let fetchPromise: Promise<void> | null = null
  if (import.meta.server || logos.value.length === 0) {
    fetchPromise = fetchLogos()
  }

  const addLogo = async (imageUrl: string, alt: string) => {
    const supabase = await getSupabase()
    cachedLogos = null
    cacheTime = 0
    const url = imageUrl.trim()
    if (!url) return

    const sortOrder = logos.value.length
      ? Math.max(...logos.value.map(l => l.sort_order)) + 1
      : 1

    try {
      const { data, error } = await supabase
        .from('client_logos')
        .insert({ image_url: url, alt: alt.trim(), sort_order: sortOrder })
        .select()
        .single()
      if (error) throw error
      if (data) {
        logos.value.push(data)
      }
    } catch (e) {
      console.error('Error adding client logo:', e)
    }
  }

  const updateLogo = async (id: string, patch: Partial<Pick<ClientLogo, 'image_url' | 'alt' | 'sort_order'>>) => {
    const supabase = await getSupabase()
    cachedLogos = null
    cacheTime = 0
    try {
      const { data, error } = await supabase
        .from('client_logos')
        .update(patch)
        .eq('id', id)
        .select()
        .single()
      if (error) throw error
      if (data) {
        const idx = logos.value.findIndex(l => l.id === id)
        if (idx !== -1) logos.value[idx] = data
      }
    } catch (e) {
      console.error('Error updating client logo:', e)
    }
  }

  const deleteLogo = async (id: string) => {
    const supabase = await getSupabase()
    cachedLogos = null
    cacheTime = 0
    try {
      const { error } = await supabase
        .from('client_logos')
        .delete()
        .eq('id', id)
      if (error) throw error
      logos.value = logos.value.filter(l => l.id !== id)
    } catch (e) {
      console.error('Error deleting client logo:', e)
    }
  }

  return {
    logos,
    addLogo,
    updateLogo,
    deleteLogo,
    fetchLogos,
    fetchPromise
  }
}
