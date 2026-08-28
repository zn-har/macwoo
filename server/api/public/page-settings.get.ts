import { defineEventHandler, setResponseHeaders } from 'h3'
import { serverSupabase, publicCacheHeaders } from '../../utils/supabase'
import { defaultPageSettings, mapDbToPageSettings } from '../../../shared/page-settings'

export default defineEventHandler(async (event) => {
  setResponseHeaders(event, publicCacheHeaders())

  const { data, error } = await serverSupabase()
    .from('page_settings')
    .select('*')
    .limit(1)
    .maybeSingle()

  if (error) {
    console.error('Error fetching page settings:', error)
    return { ...defaultPageSettings }
  }

  return data ? mapDbToPageSettings(data) : { ...defaultPageSettings }
})
