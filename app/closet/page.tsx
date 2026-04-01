"use client";

import { useState } from "react";
import Pill from "@/components/ui/Pill";
import ClosetItem from "@/components/features/ClosetItem";
import { mockClosetItems } from "@/lib/mock-data";
import type { ClothingCategory, ClothingItem } from "@/types";

const CATEGORIES: { label: string; value: ClothingCategory | "all" }[] = [
  { label: "All",         value: "all"         },
  { label: "Tops",        value: "tops"        },
  { label: "Bottoms",     value: "bottoms"     },
  { label: "Outerwear",   value: "outerwear"   },
  { label: "Shoes",       value: "shoes"       },
  { label: "Accessories", value: "accessories" },
  { label: "Dresses",     value: "dresses"     },
];

const SORT_OPTIONS = [
  { label: "Most worn",      value: "worn"    },
  { label: "Recently added", value: "recent"  },
  { label: "Category",       value: "category"},
  { label: "Colour",         value: "colour"  },
];

export default function ClosetPage() {
  const [activeCategory, setActiveCategory] = useState<ClothingCategory | "all">("all");
  const [activeSort, setActiveSort] = useState("worn");
  const [selected, setSelected] = useState<string | null>(null);

  const filtered =
    activeCategory === "all"
      ? mockClosetItems
      : mockClosetItems.filter((i) => i.category === activeCategory);

  const sorted = [...filtered].sort((a, b) => {
    if (activeSort === "worn") return (b.wearCount ?? 0) - (a.wearCount ?? 0);
    if (activeSort === "category") return a.category.localeCompare(b.category);
    return 0;
  });

  return (
    <div>
      {/* Header */}
      <div className="flex items-end justify-between mb-2">
        <div>
          <h1 className="text-[22px] font-medium">My Closet</h1>
          <p className="text-[14px] text-forme-muted">{mockClosetItems.length} items</p>
        </div>
        <button className="px-3 py-1 rounded-pill border-forme text-[12px] text-forme-muted hover:bg-forme-secondary transition-colors">
          + Add item
        </button>
      </div>

      {/* Category filters */}
      <div className="flex gap-1.5 flex-wrap mb-6">
        {CATEGORIES.map(({ label, value }) => (
          <Pill
            key={value}
            active={activeCategory === value}
            onClick={() => setActiveCategory(value)}
          >
            {label}
          </Pill>
        ))}
      </div>

      {/* Closet grid */}
      <div className="grid grid-cols-4 gap-3 mb-8">
        {sorted.map((item) => (
          <ClosetItem
            key={item.id}
            item={item}
            selected={selected === item.id}
            onClick={(i: ClothingItem) => setSelected(selected === i.id ? null : i.id)}
          />
        ))}
      </div>

      {/* Sort bar */}
      <div className="divider mb-5" />
      <div className="flex items-center gap-2">
        <span className="text-[13px] text-forme-muted">Sort by</span>
        {SORT_OPTIONS.map(({ label, value }) => (
          <Pill
            key={value}
            active={activeSort === value}
            onClick={() => setActiveSort(value)}
          >
            {label}
          </Pill>
        ))}
      </div>
    </div>
  );
}
