import { defineEventHandler, setResponseHeaders } from 'h3'
import { serverSupabase, publicCacheHeaders } from '../../utils/supabase'

export default defineEventHandler(async (event) => {
  setResponseHeaders(event, publicCacheHeaders())

  const { data, error } = await serverSupabase()
    .from('client_logos')
    .select('*')
    .order('sort_order', { ascending: true })

  if (error) {
    console.error('Error fetching client logos:', error)
    return []
  }

  return data || []
})
