/* eslint-disable @typescript-eslint/no-explicit-any */
// Deferred Supabase client for browser-side WRITES (admin only).
//
// `@supabase/supabase-js` is ~200 kB of JS (auth + realtime + postgrest).
// Static-importing it from composables that public pages use pulled it into the
// shared entry chunk, so every mobile visitor downloaded and parsed it for
// nothing. Public reads now go through /api/public/*; the client only needs a
// real Supabase client when an admin mutates something, so the module is loaded
// on demand behind a dynamic import and lands in its own chunk.
//
// It resolves the SAME singleton as useSupabase(), so an admin's signed-in
// session is carried by these writes.
//
// The URL/key are read synchronously at composable-setup time: useRuntimeConfig()
// needs an active Nuxt instance, which is not guaranteed to still be current
// after the `await` inside a mutation handler.
export function useSupabaseLazy() {
  const config = useRuntimeConfig()
  const url = config.public.supabaseUrl as string
  const key = config.public.supabaseKey as string

  return async (): Promise<any> => {
    const { useSupabaseWith } = await import('./useSupabase')
    return useSupabaseWith(url, key)
  }
}
