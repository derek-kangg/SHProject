"use client";

import { useState } from "react";
import Pill from "@/components/ui/Pill";
import ClosetItem from "@/components/features/ClosetItem";
import AddItemModal from "@/components/features/AddItemModal";
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
  { label: "Most worn",      value: "worn"     },
  { label: "Recently added", value: "recent"   },
  { label: "Category",       value: "category" },
];

export default function ClosetPage() {
  const [items, setItems] = useState<ClothingItem[]>(mockClosetItems);
  const [activeCategory, setActiveCategory] = useState<ClothingCategory | "all">("all");
  const [activeSort, setActiveSort] = useState("worn");
  const [selected, setSelected] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  function handleAddItem(newItem: Omit<ClothingItem, "id">) {
    const item: ClothingItem = { ...newItem, id: `c${Date.now()}` };
    setItems((prev) => [item, ...prev]);
  }

  const filtered =
    activeCategory === "all"
      ? items
      : items.filter((i) => i.category === activeCategory);

  const sorted = [...filtered].sort((a, b) => {
    if (activeSort === "worn")     return (b.wearCount ?? 0) - (a.wearCount ?? 0);
    if (activeSort === "category") return a.category.localeCompare(b.category);
    return 0;
  });

  return (
    <div>
      <div className="flex items-end justify-between mb-2">
        <div>
          <h1 className="text-[22px] font-medium">My Closet</h1>
          <p className="text-[14px] text-[#726D68]">{items.length} items</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2 bg-[#111110] text-white rounded-full text-[13px] hover:opacity-90 transition-opacity"
        >
          + Add item
        </button>
      </div>

      <div className="flex gap-1.5 flex-wrap mb-6 mt-4">
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

      {sorted.length > 0 ? (
        <div className="grid grid-cols-4 gap-3 mb-8">
          {sorted.map((item) => (
            <ClosetItem
              key={item.id}
              item={item}
              selected={selected === item.id}
              onClick={(i: ClothingItem) =>
                setSelected(selected === i.id ? null : i.id)
              }
            />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center">
          <p className="text-[14px] text-[#726D68] mb-1">No items in this category</p>
          <p className="text-[13px] text-[#A8A39E]">
            Click &ldquo;+ Add item&rdquo; to start building your closet.
          </p>
        </div>
      )}

      <div className="h-px bg-black/[0.08] mb-5" />
      <div className="flex items-center gap-2">
        <span className="text-[13px] text-[#726D68]">Sort by</span>
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

      <AddItemModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onAdd={handleAddItem}
      />
    </div>
  );
}