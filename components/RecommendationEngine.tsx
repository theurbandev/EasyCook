'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import WatchCard from './WatchCard'
import type { RecommendationResult } from '@/lib/types'

const EXAMPLE_PROMPTS = [
  'I trail run 40+ miles a week and need accurate GPS',
  'Daily wear smartwatch for work, gym, and sleep tracking',
  'Military-grade durability, I work outdoors in all weather',
  'Best ultramarathon watch under $600',
  'Swimming and triathlon with long battery life',
]

export default function RecommendationEngine() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<RecommendationResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [charCount, setCharCount] = useState(0)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const resultsRef = useRef<HTMLDivElement>(null)

  const handleSubmit = async (queryText = query) => {
    const q = queryText.trim()
    if (!q || loading) return
    setLoading(true)
    setError(null)
    setResults(null)

    try {
      const res = await fetch('/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Something went wrong')
      }
      const data: RecommendationResult = await res.json()
      setResults(data)
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 100)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unexpected error')
    } finally {
      setLoading(false)
    }
  }

  const handleExample = (ex: string) => {
    setQuery(ex)
    setCharCount(ex.length)
    inputRef.current?.focus()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Input area */}
      <div className="relative gradient-border rounded-2xl bg-[#0d0d0d] p-1">
        <div className="rounded-xl overflow-hidden">
          <textarea
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setCharCount(e.target.value.length)
            }}
            onKeyDown={handleKeyDown}
            placeholder="Describe your lifestyle, activities, and budget..."
            maxLength={400}
            rows={3}
            className="
              w-full bg-transparent text-white placeholder-gray-600
              px-5 pt-5 pb-3 resize-none text-base leading-relaxed
              focus:outline-none input-glow transition-all duration-200
            "
          />
          <div className="flex items-center justify-between px-5 pb-4">
            <span className="text-xs text-gray-700 tabular-nums">
              {charCount}/400
            </span>
            <button
              onClick={() => handleSubmit()}
              disabled={!query.trim() || loading}
              className="
                relative px-6 py-2.5 rounded-xl text-sm font-semibold
                transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed
                bg-[#00d4ff] text-black hover:brightness-110 active:scale-95
                glow-cyan
              "
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <LoadingSpinner />
                  Matching...
                </span>
              ) : (
                'Find my watch →'
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Example prompts */}
      <div className="flex flex-wrap gap-2">
        {EXAMPLE_PROMPTS.map((ex) => (
          <button
            key={ex}
            onClick={() => handleExample(ex)}
            className="
              text-xs px-3 py-1.5 rounded-full border border-white/10
              text-gray-500 hover:text-white hover:border-white/25
              transition-all duration-200 hover:bg-white/5
            "
          >
            {ex}
          </button>
        ))}
      </div>

      {/* Error state */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="rounded-xl bg-red-950/40 border border-red-800/40 px-5 py-4 text-red-400 text-sm"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading skeleton */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 gap-4"
          >
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="skeleton rounded-2xl h-40"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results */}
      <AnimatePresence>
        {results && !loading && (
          <motion.div
            ref={resultsRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col gap-4"
          >
            {/* AI summary */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-sm text-gray-400 border-l-2 border-[#00d4ff]/50 pl-4 italic"
            >
              {results.summary}
            </motion.p>

            {/* Watch cards */}
            {results.recommendations.map((rec, i) => (
              <motion.div
                key={rec.watchId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.1, ease: 'easeOut' }}
              >
                <WatchCard recommendation={rec} rank={i + 1} />
              </motion.div>
            ))}

            {/* New search button */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.55 }}
              onClick={() => {
                setResults(null)
                setQuery('')
                setCharCount(0)
                inputRef.current?.focus()
              }}
              className="text-sm text-gray-600 hover:text-gray-400 transition-colors mx-auto mt-2"
            >
              ← Start a new search
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function LoadingSpinner() {
  return (
    <svg
      className="animate-spin h-4 w-4"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12" cy="12" r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v8z"
      />
    </svg>
  )
}
