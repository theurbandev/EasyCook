'use client'

import { useState } from 'react'
import { watches } from '@/lib/watches'
import type { WatchRecommendation } from '@/lib/types'

interface Props {
  recommendation: WatchRecommendation
  rank: number
}

const RANK_COLORS = ['#00d4ff', '#7c3aed', '#ff6b35']
const RANK_LABELS = ['Best Match', '2nd Pick', '3rd Pick']

export default function WatchCard({ recommendation, rank }: Props) {
  const [expanded, setExpanded] = useState(rank === 1)
  const watch = watches.find((w) => w.id === recommendation.watchId)
  if (!watch) return null

  const accentColor = RANK_COLORS[rank - 1] ?? RANK_COLORS[2]
  const rankLabel = RANK_LABELS[rank - 1] ?? `Pick ${rank}`

  return (
    <div
      className="
        gradient-border rounded-2xl bg-[#0d0d0d]
        transition-all duration-300 hover:bg-[#111] cursor-pointer
        overflow-hidden
      "
      onClick={() => setExpanded((v) => !v)}
      style={rank === 1 ? { boxShadow: `0 0 0 1px ${accentColor}33, 0 4px 30px ${accentColor}15` } : {}}
    >
      <div className="p-6">
        {/* Header row */}
        <div className="flex items-start justify-between gap-4">
          {/* Left: rank badge + name */}
          <div className="flex items-start gap-4">
            {/* Rank badge */}
            <div
              className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold"
              style={{ background: `${accentColor}20`, color: accentColor, border: `1px solid ${accentColor}40` }}
            >
              {rank}
            </div>

            <div>
              <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                <span
                  className="text-xs font-semibold px-2 py-0.5 rounded-full"
                  style={{ background: `${accentColor}20`, color: accentColor }}
                >
                  {rankLabel}
                </span>
                {watch.series && (
                  <span className="text-xs text-gray-600">{watch.series}</span>
                )}
              </div>
              <h3 className="text-lg font-bold text-white leading-tight">{watch.name}</h3>
            </div>
          </div>

          {/* Right: price + toggle */}
          <div className="flex flex-col items-end gap-2 flex-shrink-0">
            <span className="text-xl font-bold" style={{ color: accentColor }}>
              ${watch.price.toLocaleString()}
            </span>
            <span className="text-gray-600 text-xs">
              {expanded ? '▲ less' : '▼ more'}
            </span>
          </div>
        </div>

        {/* AI reasoning (always visible) */}
        <p className="mt-4 text-sm text-gray-400 leading-relaxed">
          {recommendation.reasoning}
        </p>

        {/* Score bar */}
        <div className="mt-4 flex items-center gap-3">
          <span className="text-xs text-gray-600 w-12 flex-shrink-0">Match</span>
          <div className="flex-1 h-1.5 rounded-full bg-white/5 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${recommendation.score}%`,
                background: `linear-gradient(90deg, ${accentColor}88, ${accentColor})`,
              }}
            />
          </div>
          <span className="text-xs font-semibold tabular-nums" style={{ color: accentColor }}>
            {recommendation.score}%
          </span>
        </div>
      </div>

      {/* Expanded details */}
      {expanded && (
        <div className="px-6 pb-6 border-t border-white/5 pt-5 flex flex-col gap-5">
          {/* Key specs grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Spec label="Battery" value={`${watch.batteryLife.smartwatch}d smart`} />
            <Spec label="GPS Battery" value={`${watch.batteryLife.gpsMode}h GPS`} />
            <Spec label="Display" value={watch.displayType} />
            <Spec label="Weight" value={`${watch.weight}g`} />
          </div>

          {/* Best for */}
          <div>
            <p className="text-xs text-gray-600 uppercase tracking-wider mb-2">Best for</p>
            <div className="flex flex-wrap gap-2">
              {watch.bestFor.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2.5 py-1 rounded-full bg-white/5 text-gray-400 border border-white/8"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Key features */}
          <div>
            <p className="text-xs text-gray-600 uppercase tracking-wider mb-2">Key features</p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {watch.keyFeatures.map((f) => (
                <li key={f} className="text-xs text-gray-400 flex items-start gap-2">
                  <span style={{ color: accentColor }} className="mt-0.5 flex-shrink-0">✓</span>
                  {f}
                </li>
              ))}
            </ul>
          </div>

          {/* CTA */}
          <a
            href={watch.affiliateUrl}
            target="_blank"
            rel="noopener noreferrer sponsored"
            onClick={(e) => e.stopPropagation()}
            className="
              flex items-center justify-center gap-2
              w-full py-3 rounded-xl text-sm font-semibold
              transition-all duration-200 hover:brightness-110 active:scale-98
              text-black
            "
            style={{ background: accentColor }}
          >
            View on Amazon
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
          </a>
        </div>
      )}
    </div>
  )
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white/3 rounded-xl px-3 py-3">
      <p className="text-xs text-gray-600 mb-1">{label}</p>
      <p className="text-sm font-semibold text-white">{value}</p>
    </div>
  )
}
