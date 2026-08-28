/* eslint-disable @typescript-eslint/no-explicit-any */
import { defineEventHandler, setResponseHeaders } from 'h3'
import { serverSupabase, publicCacheHeaders } from '../../utils/supabase'

export default defineEventHandler(async (event) => {
  setResponseHeaders(event, publicCacheHeaders())

  const { data, error } = await serverSupabase()
    .from('portfolio_projects')
    .select('*, categories(name)')
    .order('sort_order', { ascending: true })

  if (error) {
    console.error('Error fetching portfolio projects:', error)
    return []
  }

  return (data || []).map((d: any) => ({
    slug: d.slug,
    title: d.title,
    subtitle: d.subtitle,
    tags: d.tags || [],
    category: d.categories?.name || 'Branding',
    image: d.image,
    heroImage: d.hero_image,
    galleryImages: d.gallery_images || [],
    story: d.story || '',
    tagline: d.tagline || undefined,
    services: d.services || undefined,
    industry: d.industry || undefined,
    date: d.date || undefined,
    storyParagraphs: d.story_paragraphs || [],
    featured: d.published !== false,
    displayOrder: d.sort_order
  }))
})
