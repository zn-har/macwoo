/* eslint-disable @typescript-eslint/no-explicit-any */
import { defineEventHandler, setResponseHeaders } from 'h3'
import { serverSupabase, publicCacheHeaders } from '../../utils/supabase'

export default defineEventHandler(async (event) => {
  setResponseHeaders(event, publicCacheHeaders())

  const { data, error } = await serverSupabase()
    .from('case_studies')
    .select('*, categories(name)')
    .order('sort_order', { ascending: true })

  if (error) {
    console.error('Error fetching case studies:', error)
    return []
  }

  return (data || []).map((d: any) => ({
    slug: d.slug,
    title: d.title,
    client: d.client,
    tags: d.tags || [],
    category: d.categories?.name || 'Branding',
    image: d.image,
    heroImage: d.hero_image,
    tagline: d.tagline || undefined,
    services: d.services || undefined,
    industry: d.industry || undefined,
    date: d.date || undefined,
    challenge: d.challenge || '',
    challengeParagraphs: d.challenge_paragraphs || [],
    approach: d.approach || '',
    approachParagraphs: d.approach_paragraphs || [],
    solution: d.solution || [],
    results: d.results || [],
    resultsSummary: d.results_summary || undefined
  }))
})
