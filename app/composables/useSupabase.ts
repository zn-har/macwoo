/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from '@supabase/supabase-js'

// ONE client instance per page, shared by every caller.
//
// This matters for authorization: useAuth() signs in through this client, and
// supabase-js attaches the resulting session token to subsequent PostgREST
// requests made by *that same instance*. A second createClient() would start
// out unauthenticated, so admin writes would hit RLS as the anon role.
//
// `useSupabaseWith` exists so the deferred entry point (useSupabaseLazy) can
// share this singleton without needing an active Nuxt instance to read
// runtimeConfig — the URL/key are captured earlier and passed in.
let supabaseInstance: any = null

export function useSupabaseWith(supabaseUrl: string, supabaseKey: string) {
  if (supabaseInstance) return supabaseInstance

  if (!supabaseUrl || !supabaseKey) {
    if (import.meta.env.PROD && import.meta.client) {
      throw new Error('Supabase URL or Key is missing in public runtimeConfig. Supabase integration is required in production.')
    }
    console.warn('Supabase URL or Key is missing in public runtimeConfig. Using fallback client.')
    return createDummyClient()
  }

  try {
    supabaseInstance = createClient(supabaseUrl, supabaseKey)
    return supabaseInstance
  } catch (err) {
    console.error('Failed to initialize Supabase client:', err)
    return createDummyClient()
  }
}

export function useSupabase() {
  if (supabaseInstance) return supabaseInstance

  const config = useRuntimeConfig()
  return useSupabaseWith(
    config.public.supabaseUrl as string,
    config.public.supabaseKey as string
  )
}

function createDummyClient(): any {
  const dummy = () => {}
  return new Proxy(dummy, {
    get(_target, prop) {
      if (prop === 'then') return undefined
      return createDummyClient()
    },
    apply(_target, _thisArg, _argArray) {
      return createDummyClient()
    }
  })
}
