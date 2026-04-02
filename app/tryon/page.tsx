"use client";

import { useState } from "react";
import { useSavedLooks } from "@/lib/saved-looks-context";
import type { SavedOutfit } from "@/lib/saved-looks-context";
import type { ClothingItem } from "@/types";

const COLOR_MAP: Record<string, string> = {
  black: "#1C1C1C", white: "#F5F5F0", grey: "#9A9A9A", gray: "#9A9A9A",
  navy: "#1A2744", blue: "#4A7AB5", brown: "#7A5C44", beige: "#D4C4A8",
  cream: "#F0E8D8", green: "#4A7A4A", red: "#C44A4A", pink: "#E8A0B0",
  yellow: "#E8D44A", orange: "#E8844A", purple: "#7A4A9A",
  indigo: "#3A3A7A", camel: "#C4944A", sand: "#D4B87A", tan: "#C4A07A",
};

function getColor(item: ClothingItem): string {
  return COLOR_MAP[item.color?.toLowerCase() ?? ""] ?? "#C8C4BE";
}

function CategoryIcon({ category }: { category: string }) {
  const icons: Record<string, string> = {
    tops: "👕", outerwear: "🧥", bottoms: "👖",
    dresses: "👗", shoes: "👟", accessories: "💍",
  };
  return <span className="text-[28px]">{icons[category] ?? "👔"}</span>;
}

function ItemCard({ item }: { item: ClothingItem }) {
  return (
    <div className="relative rounded-2xl overflow-hidden bg-[#F0EDE8] border border-black/[0.06] w-full h-full">
      {item.imageUrl ? (
        <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center gap-2">
          <CategoryIcon category={item.category} />
          <span className="text-[11px] text-[#726D68] text-center px-2 leading-tight">{item.name}</span>
        </div>
      )}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/40 to-transparent p-2.5">
        <p className="text-[10px] text-white font-medium truncate">{item.name}</p>
        {item.brand && <p className="text-[9px] text-white/70 truncate">{item.brand}</p>}
      </div>
    </div>
  );
}

function EditorialLayout({ items }: { items: ClothingItem[] }) {
  if (items.length === 0) return null;
  if (items.length === 1) {
    return <div className="w-full" style={{height:360}}><ItemCard item={items[0]} /></div>;
  }
  if (items.length === 2) {
    return (
      <div className="grid grid-cols-2 gap-3" style={{height:360}}>
        <ItemCard item={items[0]} /><ItemCard item={items[1]} />
      </div>
    );
  }
  if (items.length === 3) {
    return (
      <div className="grid gap-3" style={{height:380, gridTemplateColumns:"1.6fr 1fr"}}>
        <ItemCard item={items[0]} />
        <div className="grid grid-rows-2 gap-3">
          <ItemCard item={items[1]} /><ItemCard item={items[2]} />
        </div>
      </div>
    );
  }
  return (
    <div className="grid gap-3" style={{height:400, gridTemplateColumns:"1.6fr 1fr"}}>
      <div className="grid grid-rows-2 gap-3">
        <ItemCard item={items[0]} /><ItemCard item={items[1]} />
      </div>
      <div className="grid grid-rows-2 gap-3">
        <ItemCard item={items[2]} /><ItemCard item={items[3]} />
      </div>
    </div>
  );
}

function MannequinView({ outfit }: { outfit: SavedOutfit }) {
  const top        = outfit.items.find((i) => ["tops", "outerwear", "dresses"].includes(i.category));
  const bottom     = outfit.items.find((i) => i.category === "bottoms");
  const shoe       = outfit.items.find((i) => i.category === "shoes");
  const accessory  = outfit.items.find((i) => i.category === "accessories");

  const topColor    = top       ? getColor(top)    : "#B0ABA4";
  const bottomColor = bottom    ? getColor(bottom) : "#8C8880";
  const shoeColor   = shoe      ? getColor(shoe)   : "#6B6762";
  const bodyColor   = "#C8C4BE";
  const shadowColor = "#A8A49E";

  return (
    <div className="flex flex-col items-center justify-center py-8 relative" style={{minHeight: 520}}>
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#F5F3F0] to-[#ECEAE6] rounded-2xl" />

      <div className="relative z-10 flex flex-col items-center">
        <svg
          width="240"
          height="480"
          viewBox="0 0 240 480"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* ── Head ── */}
          <ellipse cx="120" cy="42" rx="28" ry="34" fill={bodyColor} />
          {/* Subtle face */}
          <ellipse cx="111" cy="38" rx="3" ry="3.5" fill={shadowColor} fillOpacity="0.3" />
          <ellipse cx="129" cy="38" rx="3" ry="3.5" fill={shadowColor} fillOpacity="0.3" />
          <path d="M112 50 Q120 56 128 50" stroke={shadowColor} strokeOpacity="0.3" strokeWidth="1.5" strokeLinecap="round" fill="none" />

          {/* ── Neck ── */}
          <rect x="113" y="73" width="14" height="18" rx="4" fill={bodyColor} />

          {/* ── Torso / Top ── */}
          <path
            d="M72 92 Q90 84 120 87 Q150 84 168 92 L174 188 Q120 198 66 188 Z"
            fill={topColor}
          />
          {/* Top shading */}
          <path
            d="M72 92 Q90 84 120 87 Q150 84 168 92 L174 188 Q120 198 66 188 Z"
            fill="black"
            fillOpacity="0.04"
          />
          {/* Collar V */}
          <path d="M113 87 L120 106 L127 87" fill="white" fillOpacity="0.12" />

          {/* ── Left Arm ── */}
          <path
            d="M72 92 Q50 108 42 158 Q48 165 56 161 Q62 120 80 104 Z"
            fill={topColor}
          />
          <path
            d="M72 92 Q50 108 42 158 Q48 165 56 161 Q62 120 80 104 Z"
            fill="black" fillOpacity="0.06"
          />
          {/* Left hand */}
          <ellipse cx="46" cy="168" rx="9" ry="11" fill={bodyColor} />

          {/* ── Right Arm ── */}
          <path
            d="M168 92 Q190 108 198 158 Q192 165 184 161 Q178 120 160 104 Z"
            fill={topColor}
          />
          <path
            d="M168 92 Q190 108 198 158 Q192 165 184 161 Q178 120 160 104 Z"
            fill="black" fillOpacity="0.06"
          />
          {/* Right hand */}
          <ellipse cx="194" cy="168" rx="9" ry="11" fill={bodyColor} />

          {/* ── Waistband ── */}
          <rect x="66" y="184" width="108" height="14" rx="3" fill={bottomColor} fillOpacity="0.9" />
          <rect x="66" y="184" width="108" height="14" rx="3" fill="black" fillOpacity="0.08" />

          {/* ── Bottom / Legs ── */}
          <path
            d="M66 194 Q120 204 174 194 L180 330 Q158 336 142 330 L120 272 L98 330 Q82 336 60 330 Z"
            fill={bottomColor}
          />
          <path
            d="M66 194 Q120 204 174 194 L180 330 Q158 336 142 330 L120 272 L98 330 Q82 336 60 330 Z"
            fill="black" fillOpacity="0.04"
          />
          {/* Seam line */}
          <line x1="120" y1="204" x2="120" y2="272" stroke="white" strokeOpacity="0.15" strokeWidth="1" />

          {/* ── Left Shoe ── */}
          <rect x="64" y="328" width="52" height="18" rx="6" fill={shoeColor} />
          <rect x="58" y="338" width="58" height="12" rx="6" fill={shoeColor} />
          <rect x="58" y="338" width="58" height="12" rx="6" fill="black" fillOpacity="0.1" />

          {/* ── Right Shoe ── */}
          <rect x="124" y="328" width="52" height="18" rx="6" fill={shoeColor} />
          <rect x="124" y="338" width="58" height="12" rx="6" fill={shoeColor} />
          <rect x="124" y="338" width="58" height="12" rx="6" fill="black" fillOpacity="0.1" />

          {/* ── Accessory (necklace) ── */}
          {accessory && (
            <>
              <path
                d="M108 90 Q120 100 132 90"
                stroke={getColor(accessory)}
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
              />
              <circle cx="120" cy="100" r="3" fill={getColor(accessory)} />
            </>
          )}

          {/* ── Ground shadow ── */}
          <ellipse cx="120" cy="358" rx="52" ry="6" fill="black" fillOpacity="0.06" />
        </svg>

        {/* Item labels below */}
        <div className="flex flex-wrap justify-center gap-1.5 mt-4 max-w-[300px]">
          {outfit.items.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-black/[0.06] bg-white/80"
            >
              <div
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: getColor(item) }}
              />
              <span className="text-[10px] text-[#726D68]">{item.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MoodboardPanel({ outfit }: { outfit: SavedOutfit }) {
  const [view, setView] = useState<"pieces" | "mannequin">("pieces");

  const colors = outfit.items
    .map((i) => ({ color: getColor(i), name: i.name }))
    .filter((v, i, arr) => arr.findIndex((a) => a.color === v.color) === i);

  const date = new Date(outfit.savedAt).toLocaleDateString("en-US", {
    month: "long", day: "numeric", year: "numeric",
  });

  return (
    <div className="bg-white border border-black/[0.08] rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="px-8 pt-8 pb-4 border-b border-black/[0.06]">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[10px] tracking-[0.2em] uppercase text-[#A8A39E] mb-2">Outfit Preview</p>
            <h2 className="text-[28px] font-light text-[#111110] leading-tight mb-1">{outfit.name}</h2>
            <div className="flex items-center gap-2 mt-2">
              <span className="px-2.5 py-1 bg-[#F0EDE8] rounded-full text-[11px] text-[#726D68] capitalize">
                {outfit.occasion ?? "casual"}
              </span>
              <span className="text-[11px] text-[#A8A39E]">{outfit.items.length} pieces</span>
              <span className="text-[11px] text-[#A8A39E]">·</span>
              <span className="text-[11px] text-[#A8A39E]">{date}</span>
            </div>
          </div>
          <div className="text-[11px] tracking-[0.15em] uppercase text-[#D4CFC9] font-medium">FORME</div>
        </div>
      </div>

      {/* Toggle */}
      <div className="px-8 pt-5 flex items-center gap-2">
        <button
          onClick={() => setView("pieces")}
          className={`px-3 py-1.5 rounded-full text-[12px] border transition-colors ${
            view === "pieces"
              ? "bg-[#111110] text-white border-[#111110]"
              : "bg-white text-[#726D68] border-black/[0.08] hover:border-black/[0.15]"
          }`}
        >
          Outfit pieces
        </button>
        <button
          onClick={() => setView("mannequin")}
          className={`px-3 py-1.5 rounded-full text-[12px] border transition-colors ${
            view === "mannequin"
              ? "bg-[#111110] text-white border-[#111110]"
              : "bg-white text-[#726D68] border-black/[0.08] hover:border-black/[0.15]"
          }`}
        >
          👤 Mannequin view
        </button>
      </div>

      {/* Content */}
      <div className="px-8 py-6">
        {view === "mannequin" ? (
          <MannequinView outfit={outfit} />
        ) : (
          <EditorialLayout items={outfit.items} />
        )}
      </div>

      {/* Color palette */}
      {colors.length > 0 && (
        <div className="px-8 pb-5">
          <p className="text-[10px] tracking-[0.12em] uppercase text-[#A8A39E] mb-2.5">Colour palette</p>
          <div className="flex items-center gap-2">
            {colors.map(({ color, name }) => (
              <div key={color} className="flex flex-col items-center gap-1">
                <div
                  className="w-8 h-8 rounded-full border border-black/[0.08] shadow-sm"
                  style={{ backgroundColor: color }}
                  title={name}
                />
                <span className="text-[8px] text-[#A8A39E] capitalize text-center leading-tight" style={{maxWidth:40}}>
                  {name.split(" ")[0]}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="h-px bg-black/[0.06] mx-8" />

      {/* Description & pieces */}
      <div className="px-8 py-6">
        {outfit.description && (
          <p className="text-[15px] text-[#726D68] leading-relaxed font-light mb-5 italic">
            &ldquo;{outfit.description}&rdquo;
          </p>
        )}
        <p className="text-[10px] tracking-[0.12em] uppercase text-[#A8A39E] mb-3">The pieces</p>
        <div className="flex flex-wrap gap-2">
          {outfit.items.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-2 px-3 py-1.5 bg-[#F9F7F4] rounded-full border border-black/[0.06]"
            >
              <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: getColor(item) }} />
              <span className="text-[12px] text-[#726D68]">{item.name}</span>
              {item.brand && <span className="text-[10px] text-[#A8A39E]">· {item.brand}</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="bg-white border border-black/[0.08] rounded-2xl flex flex-col items-center justify-center text-center px-8 py-20">
      <div className="w-20 h-20 rounded-full bg-[#F0EDE8] flex items-center justify-center mb-4">
        <span className="text-[32px]">✦</span>
      </div>
      <p className="text-[17px] font-light text-[#111110] mb-2">Select a look</p>
      <p className="text-[13px] text-[#A8A39E] leading-relaxed max-w-[240px]">
        Choose a saved outfit from the left to see your editorial preview
      </p>
    </div>
  );
}

export default function TryOnPage() {
  const { savedLooks } = useSavedLooks();
  const [selected, setSelected] = useState<SavedOutfit | null>(null);

  return (
    <div>
      <h1 className="text-[22px] font-medium">Outfit Preview</h1>
      <p className="text-[14px] text-[#726D68] mb-6">
        See your saved looks in an editorial layout or on a mannequin
      </p>

      <div className="grid grid-cols-[280px_1fr] gap-6 items-start">
        <div className="bg-white border border-black/[0.08] rounded-xl p-4 sticky top-20">
          <p className="text-[11px] tracking-[0.08em] uppercase font-medium text-[#A8A39E] mb-3">Saved looks</p>
          {savedLooks.length === 0 ? (
            <div className="py-8 text-center border border-dashed border-black/[0.12] rounded-xl">
              <p className="text-[13px] text-[#726D68] mb-1">No saved looks yet</p>
              <p className="text-[11px] text-[#A8A39E]">Save outfits from Today or Style Builder first.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-1.5">
              {savedLooks.map((outfit) => (
                <button
                  key={outfit.id}
                  onClick={() => setSelected(outfit)}
                  className={`flex items-center gap-3 p-2.5 rounded-xl border text-left transition-all ${
                    selected?.id === outfit.id
                      ? "border-[#111110] bg-[#F9F7F4]"
                      : "border-black/[0.08] hover:border-black/[0.15] hover:bg-[#F9F7F4]"
                  }`}
                >
                  <div className="w-12 h-12 flex-shrink-0 grid grid-cols-2 gap-0.5 rounded-lg overflow-hidden bg-[#F0EDE8]">
                    {outfit.items.slice(0, 4).map((item, i) => (
                      <div key={i} className="bg-[#E8E4DF] overflow-hidden">
                        {item.imageUrl ? (
                          <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="text-[8px]">
                              {item.category === "shoes"     ? "👟" :
                               item.category === "tops"      ? "👕" :
                               item.category === "outerwear" ? "🧥" :
                               item.category === "bottoms"   ? "👖" : "👗"}
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-medium text-[#111110] truncate">{outfit.name}</p>
                    <p className="text-[10px] text-[#A8A39E] truncate capitalize">
                      {outfit.items.length} pieces · {outfit.occasion ?? "casual"}
                    </p>
                  </div>
                  {selected?.id === outfit.id && (
                    <span className="text-[11px] text-[#111110] flex-shrink-0">✓</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          {selected ? <MoodboardPanel outfit={selected} /> : <EmptyState />}
        </div>
      </div>
    </div>
  );
}