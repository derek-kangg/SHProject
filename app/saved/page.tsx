"use client";

import { useState } from "react";
import { useSavedLooks } from "@/lib/saved-looks-context";
import type { SavedOutfit } from "@/lib/saved-looks-context";
import Link from "next/link";

const SOURCE_LABELS: Record<string, string> = {
  "ai-daily":      "Today",
  "style-builder": "Style Builder",
  manual:          "Manual",
};

function SavedCard({ outfit, onRemove }: { outfit: SavedOutfit; onRemove: () => void }) {
  const date = new Date(outfit.savedAt).toLocaleDateString("en-US", {
    month: "short", day: "numeric",
  });

  return (
    <div className="bg-white border border-black/[0.08] rounded-xl overflow-hidden group">
      <div className="relative bg-[#F0EDE8]" style={{aspectRatio:"3/4"}}>
        <div className="w-full h-full p-3 grid gap-2"
          style={{
            gridTemplateColumns: outfit.items.length === 1 ? "1fr" : "1fr 1fr",
            gridTemplateRows: outfit.items.length <= 2 ? "1fr" : "1fr 1fr",
          }}
        >
          {outfit.items.slice(0, 4).map((item) => (
            <div
              key={item.id}
              className="rounded-xl overflow-hidden border border-black/[0.06] bg-[#E8E4DF] relative"
            >
              {item.imageUrl ? (
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-1 p-2">
                  <span className="text-[16px]">
                    {item.category === "shoes"     ? "👟" :
                     item.category === "tops"      ? "👕" :
                     item.category === "outerwear" ? "🧥" :
                     item.category === "bottoms"   ? "👖" :
                     item.category === "dresses"   ? "👗" : "👜"}
                  </span>
                  <span className="text-[9px] text-[#A8A39E] text-center leading-tight">
                    {item.name}
                  </span>
                </div>
              )}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/20 to-transparent px-1.5 py-1">
                <p className="text-[9px] text-white truncate">{item.name}</p>
              </div>
            </div>
          ))}
        </div>

        <span className="absolute top-2 right-2 px-2 py-1 bg-white border border-black/[0.08] rounded-full text-[10px] text-[#726D68]">
          {SOURCE_LABELS[outfit.source] ?? outfit.source}
        </span>

        <Link
          href="/tryon"
          className="absolute bottom-2.5 left-1/2 -translate-x-1/2 px-3.5 py-1 bg-white border border-black/[0.08] rounded-full text-[11px] text-[#111110] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity"
        >
          Try on avatar
        </Link>
      </div>

      <div className="px-3.5 py-2.5 flex items-start justify-between">
        <div>
          <p className="text-[13px] font-medium text-[#111110] mb-0.5">{outfit.name}</p>
          <p className="text-[11px] text-[#A8A39E]">
            {outfit.items.map((i) => i.name).join(" · ") || "No closet items"} · {date}
          </p>
        </div>
        <button
          onClick={onRemove}
          className="text-[11px] text-[#A8A39E] hover:text-red-400 transition-colors mt-0.5 flex-shrink-0 ml-2"
        >
          Remove
        </button>
      </div>
    </div>
  );
}

export default function SavedPage() {
  const { savedLooks, removeOutfit } = useSavedLooks();
  const [filter, setFilter] = useState<"all" | "ai-daily" | "style-builder">("all");

  const filtered = filter === "all"
    ? savedLooks
    : savedLooks.filter((o) => o.source === filter);

  return (
    <div>
      <div className="flex items-end justify-between mb-6">
        <div>
          <h1 className="text-[22px] font-medium">Saved Looks</h1>
          <p className="text-[14px] text-[#726D68]">{savedLooks.length} looks saved</p>
        </div>
        <div className="flex gap-1.5">
          {([
            { label: "All",           value: "all"           },
            { label: "From Today",    value: "ai-daily"      },
            { label: "Style Builder", value: "style-builder" },
          ] as { label: string; value: typeof filter }[]).map(({ label, value }) => (
            <button
              key={value}
              onClick={() => setFilter(value)}
              className={`px-3 py-1 rounded-full text-[12px] border transition-colors ${
                filter === value
                  ? "bg-[#111110] text-white border-[#111110]"
                  : "bg-white text-[#726D68] border-black/[0.08] hover:border-black/[0.15]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-3 gap-4">
          {filtered.map((outfit) => (
            <SavedCard
              key={outfit.id}
              outfit={outfit}
              onRemove={() => removeOutfit(outfit.id)}
            />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center">
          <p className="text-[14px] text-[#726D68] mb-1">No saved looks yet</p>
          <p className="text-[13px] text-[#A8A39E]">
            Save outfits from Today or the Style Builder and they will appear here.
          </p>
        </div>
      )}
    </div>
  );
}