/* eslint-disable @typescript-eslint/no-explicit-any */
import { defineEventHandler, setResponseHeaders } from 'h3'
import { serverSupabase, publicCacheHeaders } from '../../utils/supabase'

export default defineEventHandler(async (event) => {
  setResponseHeaders(event, publicCacheHeaders())

  const { data, error } = await serverSupabase()
    .from('careers')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })

  if (error) {
    console.error('Error fetching careers:', error)
    return []
  }

  return (data || []).map((d: any) => ({
    id: d.id,
    title: d.title,
    department: d.department,
    location: d.location,
    type: d.type,
    experience: d.experience,
    applyUrl: d.apply_url || ''
  }))
})
