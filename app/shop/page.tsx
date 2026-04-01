"use client";

import { useState } from "react";
import Pill from "@/components/ui/Pill";
import ShopCard from "@/components/features/ShopCard";
import { mockShopItems, mockWardrobeGaps } from "@/lib/mock-data";

type ShopFilter = "all" | "matches" | "gap" | "new";

const FILTERS: { label: string; value: ShopFilter }[] = [
  { label: "All",                value: "all"     },
  { label: "Matches my closet",  value: "matches" },
  { label: "Fill the gap",       value: "gap"     },
  { label: "New brands",         value: "new"     },
];

export default function ShopPage() {
  const [filter, setFilter] = useState<ShopFilter>("all");

  const filtered = mockShopItems.filter((item) => {
    if (filter === "gap")     return item.fillsGap;
    if (filter === "matches") return !item.fillsGap;
    return true;
  });

  return (
    <div>
      <h1 className="text-[22px] font-medium">Shop</h1>
      <p className="text-[14px] text-forme-muted mb-6">
        Curated picks to fill the gaps in your wardrobe
      </p>

      {/* Gap banner */}
      <div className="bg-forme-secondary border-forme rounded-card p-4 flex items-center justify-between mb-6">
        <div>
          <p className="text-[13px] font-medium text-forme-ink">
            Your closet is missing a few key pieces
          </p>
          <p className="text-[12px] text-forme-muted mt-0.5">
            Based on outfit patterns and style preferences
          </p>
        </div>
        <div className="flex gap-1.5 flex-wrap justify-end ml-4">
          {mockWardrobeGaps.map((gap) => (
            <span
              key={gap}
              className="px-2 py-1 bg-forme-card border-forme rounded text-[11px] text-forme-muted"
            >
              {gap}
            </span>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-1.5 flex-wrap mb-6">
        {FILTERS.map(({ label, value }) => (
          <Pill
            key={value}
            active={filter === value}
            onClick={() => setFilter(value)}
          >
            {label}
          </Pill>
        ))}
      </div>

      {/* Shop grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-4 gap-4">
          {filtered.map((item) => (
            <ShopCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center">
          <p className="text-[14px] text-forme-muted">No items match this filter.</p>
        </div>
      )}
    </div>
  );
}
