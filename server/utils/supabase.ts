import { createClient } from '@supabase/supabase-js'
import type { SupabaseClient } from '@supabase/supabase-js'

// Server-side Supabase client. Kept in server/utils so `@supabase/supabase-js`
// stays out of the browser bundle for public pages — every public read goes
// through /api/public/* instead of talking to Supabase from the client.
let instance: SupabaseClient | null = null

export function serverSupabase(): SupabaseClient {
  if (instance) return instance

  const url = process.env.SUPABASE_URL || 'https://vewmzejakdfsgsyxdlpa.supabase.co'
  const key = process.env.SUPABASE_KEY || 'sb_publishable_SjN1foafYhhbb3k-DI82Aw_xsjStWt_'

  instance = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false }
  })
  return instance
}

// Shared cache headers for the public read endpoints. Short edge TTL with a
// long stale window: content updates land within a minute, but a cold mobile
// client never waits on Supabase.
export function publicCacheHeaders() {
  return { 'cache-control': 'public, max-age=0, s-maxage=60, stale-while-revalidate=600' }
}
