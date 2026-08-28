// Types, defaults and the DB<->app mapping live in shared/ so the Nitro route
// (/api/public/page-settings) and this composable can never drift apart.
import {
  defaultPageSettings,
  mapPageSettingsToDb
} from '#shared/page-settings'
import type { PageSettings } from '#shared/page-settings'

export type { PageSettings }

const defaultSettings = defaultPageSettings
const mapSettingsToDb = mapPageSettingsToDb

let cachedSettings: PageSettings | null = null
let cacheTime = 0
let activeFetchPromise: Promise<void> | null = null
const CACHE_TTL = 300000 // 5 minutes

export function usePageSettings() {
  const getSupabase = useSupabaseLazy()
  const settings = useState<PageSettings>('page_settings', () => ({ ...defaultSettings }))
  // Serialised into the SSR payload, so the client knows the settings it
  // hydrated with are real DB values. The old check compared against the
  // defaults, which re-fetched on every client navigation whenever a stored
  // value happened to equal its default.
  const loaded = useState<boolean>('page_settings_loaded', () => false)

  const fetchSettings = async () => {
    // Read through the Nitro endpoint, not Supabase directly: it keeps
    // `@supabase/supabase-js` out of the browser bundle and lets Cloudflare
    // edge-cache the response.
    const load = async () => {
      const data = await $fetch<PageSettings>('/api/public/page-settings')
      if (data) {
        cachedSettings = data
        cacheTime = Date.now()
        settings.value = data
        loaded.value = true
      }
    }

    // Module-level memo is CLIENT-ONLY — see the long note in usePortfolio.ts.
    // A shared in-flight promise cannot cross requests inside a reused
    // Cloudflare isolate without deadlocking later readers.
    if (import.meta.server) {
      try {
        await load()
      } catch (e) {
        console.error('Error fetching /api/public/page-settings:', e)
      }
      return
    }

    if (cachedSettings && (Date.now() - cacheTime < CACHE_TTL)) {
      settings.value = cachedSettings
      loaded.value = true
      return
    }

    if (activeFetchPromise) {
      try {
        await activeFetchPromise
      } catch {
        // fall through to a fresh attempt below
      }
      if (cachedSettings) {
        settings.value = cachedSettings
        loaded.value = true
        return
      }
    }

    activeFetchPromise = (async () => {
      try {
        await load()
      } catch (e) {
        console.error('Error fetching /api/public/page-settings:', e)
      } finally {
        activeFetchPromise = null
      }
    })()

    await activeFetchPromise
  }

  // Fetch on the server, or on the client only when nothing was hydrated
  // (i.e. the SPA-rendered admin area).
  let fetchPromise: Promise<void> | null = null
  if (import.meta.server || !loaded.value) {
    fetchPromise = fetchSettings()
  }

  const updateSettings = async (updated: Partial<PageSettings>): Promise<boolean> => {
    const supabase = await getSupabase()
    cachedSettings = null
    cacheTime = 0
    settings.value = { ...settings.value, ...updated }
    try {
      const { data: current } = await supabase
        .from('page_settings')
        .select('id')
        .limit(1)
        .maybeSingle()

      const payload = mapSettingsToDb(settings.value)
      if (current?.id) {
        const { error } = await supabase
          .from('page_settings')
          .update(payload)
          .eq('id', current.id)
        if (error) throw error
      } else {
        const { error } = await supabase
          .from('page_settings')
          .insert(payload)
        if (error) throw error
      }
      return true
    } catch (e) {
      console.error('Failed to save page settings to Supabase:', e)
      return false
    }
  }

  const resetSettings = async () => {
    cachedSettings = null
    cacheTime = 0
    settings.value = { ...defaultSettings }
    await updateSettings(defaultSettings)
  }

  return {
    settings,
    updateSettings,
    resetSettings,
    fetchSettings,
    fetchPromise
  }
}
