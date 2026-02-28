import { NextRequest, NextResponse } from 'next/server'
import { getRecommendations } from '@/lib/ai'
import { getCached, setCached, normalizeKey } from '@/lib/cache'

// Run on Node.js runtime for Anthropic SDK compatibility
export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  let query: string
  try {
    const body = await req.json()
    query = body.query
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  if (!query || typeof query !== 'string') {
    return NextResponse.json({ error: 'query is required' }, { status: 400 })
  }

  const trimmed = query.trim()
  if (trimmed.length < 5) {
    return NextResponse.json({ error: 'Query too short — tell us more about your needs' }, { status: 400 })
  }
  if (trimmed.length > 400) {
    return NextResponse.json({ error: 'Query too long — please keep it under 400 characters' }, { status: 400 })
  }

  const cacheKey = normalizeKey(trimmed)

  // Cache hit — free and instant
  const cached = getCached(cacheKey)
  if (cached) {
    return NextResponse.json(cached, {
      headers: { 'X-Cache': 'HIT' },
    })
  }

  // Call Claude Haiku
  try {
    const result = await getRecommendations(trimmed)
    setCached(cacheKey, result)
    return NextResponse.json(result, {
      headers: { 'X-Cache': 'MISS' },
    })
  } catch (err) {
    console.error('[recommend] AI error:', err)
    const message = err instanceof Error ? err.message : 'AI service error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
