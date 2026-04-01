'use client'

import { useState } from "react";
import Pill from "@/components/ui/Pill";
import OutfitCard from "@/components/features/OutfitCard";
import { mockDailyOutfits, mockUser } from "@/lib/mock-data";
import type { Occasion } from "@/types";

const OCCASION_FILTERS: { value: Occasion | 'all'; label: string }[] = [
  { value: 'all',          label: 'All' },
  { value: 'casual',       label: 'Casual' },
  { value: 'work',         label: 'Work' },
  { value: 'evening',      label: 'Evening' },
  { value: 'smart-casual', label: 'Smart casual' },
]

const QUICK_OCCASIONS = [
  'Job interview', 'Date night', 'Working from home',
  'Weekend brunch', 'Gym', '+ Custom',
]

export default function TodayPage() {
  const [filter, setFilter] = useState<Occasion | 'all'>('all')

  const outfits = filter === 'all'
    ? mockDailyOutfits
    : mockDailyOutfits.filter(o => o.occasion === filter)

  // Format today's date
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric',
  })

  return (
    <>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          marginBottom: '1.5rem',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <p className="label-caps" style={{ marginBottom: 4 }}>{today}</p>
          <h1 className="section-title">Good morning, Alex</h1>
          <p className="section-sub">12°C · Partly cloudy · Vancouver</p>
        </div>

        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {OCCASION_FILTERS.map(f => (
            <Pill
              key={f.value}
              label={f.label}
              active={filter === f.value}
              onClick={() => setFilter(f.value)}
            />
          ))}
        </div>
      </div>

      {/* AI badge */}
      <div className="ai-badge" style={{ marginBottom: '1.25rem' }}>
        ✦ AI-styled from your closet
      </div>

      {/* Outfit grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 16,
          marginBottom: '2rem',
        }}
      >
        {outfits.map(outfit => (
          <OutfitCard key={outfit.id} outfit={outfit} />
        ))}
      </div>

      <div className="divider" />

      {/* Quick occasion prompt */}
      <p className="label-caps" style={{ marginBottom: '0.75rem' }}>
        Tell Forme what you're doing
      </p>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {QUICK_OCCASIONS.map(label => (
          <Pill key={label} label={label} />
        ))}
      </div>
    </>
  )
}
