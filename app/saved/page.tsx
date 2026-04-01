"use client";

import { useState } from "react";
import Pill from "@/components/ui/Pill";
import SavedLookCard from "@/components/features/SavedLookCard";
import { mockSavedLooks } from "@/lib/mock-data";
import type { Outfit } from "@/types";

type SourceFilter = "all" | "ai-daily" | "style-builder";

const FILTERS: { label: string; value: SourceFilter }[] = [
  { label: "All",           value: "all"           },
  { label: "From Today",    value: "ai-daily"      },
  { label: "Style Builder", value: "style-builder" },
];

export default function SavedPage() {
  const [filter, setFilter] = useState<SourceFilter>("all");

  const filtered: Outfit[] =
    filter === "all"
      ? mockSavedLooks
      : mockSavedLooks.filter((o) => o.source === filter);

  return (
    <div>
      {/* Header */}
      <div className="flex items-end justify-between mb-6">
        <div>
          <h1 className="text-[22px] font-medium">Saved Looks</h1>
          <p className="text-[14px] text-forme-muted">{mockSavedLooks.length} looks saved</p>
        </div>
        <div className="flex gap-1.5 flex-wrap">
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
      </div>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-3 gap-4">
          {filtered.map((outfit) => (
            <SavedLookCard key={outfit.id} outfit={outfit} />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center">
          <p className="text-[14px] text-forme-muted mb-1">No saved looks yet</p>
          <p className="text-[13px] text-forme-subtle">
            Save outfits from Today or the Style Builder and they&apos;ll appear here.
          </p>
        </div>
      )}
    </div>
  );
}
