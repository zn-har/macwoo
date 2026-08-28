/* eslint-disable @typescript-eslint/no-explicit-any */
import { defineEventHandler, setResponseHeaders } from 'h3'
import { serverSupabase, publicCacheHeaders } from '../../utils/supabase'

export default defineEventHandler(async (event) => {
  setResponseHeaders(event, publicCacheHeaders())

  const { data, error } = await serverSupabase()
    .from('blog_posts')
    .select('*, categories(name)')
    .order('date', { ascending: false })

  if (error) {
    console.error('Error fetching blogs:', error)
    return []
  }

  return (data || []).map((d: any) => ({
    slug: d.slug,
    title: d.title,
    excerpt: d.excerpt,
    date: d.date,
    readTime: d.read_time,
    image: d.image,
    body: d.body || [],
    category: d.categories?.name || undefined
  }))
})
