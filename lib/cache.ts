import type { RecommendationResult } from './types'

interface CacheEntry {
  data: RecommendationResult
  timestamp: number
}

// In-memory LRU-style cache. Works per process instance.
// For multi-instance deployments (Vercel, etc.) upgrade to Redis/Upstash.
const cache = new Map<string, CacheEntry>()
const TTL_MS = 60 * 60 * 1000  // 1 hour
const MAX_SIZE = 500

export function normalizeKey(query: string): string {
  return query.toLowerCase().trim().replace(/\s+/g, ' ')
}

export function getCached(key: string): RecommendationResult | null {
  const entry = cache.get(key)
  if (!entry) return null
  if (Date.now() - entry.timestamp > TTL_MS) {
    cache.delete(key)
    return null
  }
  return { ...entry.data, cached: true }
}

export function setCached(key: string, data: RecommendationResult): void {
  if (cache.size >= MAX_SIZE) {
    // Evict oldest entry
    const oldest = cache.keys().next().value
    if (oldest) cache.delete(oldest)
  }
  cache.set(key, { data, timestamp: Date.now() })
}
