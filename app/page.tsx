"use client";

import { useState, useEffect, useCallback } from "react";
import { useCloset } from "@/lib/closet-context";
import { useSavedLooks } from "@/lib/saved-looks-context";
import type { TodayOutfit } from "@/app/api/today-outfits/route";
import type { ClothingItem } from "@/types";

const OCCASION_COLORS: Record<string, string> = {
  casual:           "bg-[#F0EDE8] text-[#726D68]",
  work:             "bg-[#E8EDF0] text-[#4A6580]",
  evening:          "bg-[#1a1a1a] text-white",
  "smart-casual":   "bg-[#EDE8F0] text-[#6B5A7A]",
  date:             "bg-[#F0E8ED] text-[#7A4A5A]",
  brunch:           "bg-[#EDF0E8] text-[#5A7A4A]",
};

function OutfitPreview({ outfit, closetItems }: { outfit: TodayOutfit; closetItems: ClothingItem[] }) {
  const outfitItems = closetItems.filter((i) => outfit.closetItemIds.includes(i.id));

  if (outfitItems.length > 0) {
    return (
      <div className="w-full h-full p-3 grid gap-2"
        style={{
          gridTemplateColumns: outfitItems.length === 1 ? "1fr" : "1fr 1fr",
          gridTemplateRows: outfitItems.length <= 2 ? "1fr" : "1fr 1fr",
        }}
      >
        {outfitItems.map((item) => (
          <div
            key={item.id}
            className="rounded-xl overflow-hidden border border-black/[0.06] bg-[#E8E4DF] relative"
          >
            {item.imageUrl ? (
              <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center gap-1 p-2">
                <span className="text-[18px]">
                  {item.category === "shoes"     ? "👟" :
                   item.category === "tops"      ? "👕" :
                   item.category === "outerwear" ? "🧥" :
                   item.category === "bottoms"   ? "👖" :
                   item.category === "dresses"   ? "👗" : "👜"}
                </span>
                <span className="text-[9px] text-[#A8A39E] text-center leading-tight">{item.name}</span>
              </div>
            )}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/20 to-transparent px-1.5 py-1">
              <p className="text-[9px] text-white truncate">{item.name}</p>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="w-full h-full p-3 grid grid-cols-2 grid-rows-2 gap-2">
      {outfit.suggestedItems.slice(0, 4).map((item, i) => (
        <div
          key={i}
          className="rounded-xl border border-black/[0.08] flex items-center justify-center text-[10px] text-[#726D68] text-center leading-tight p-2"
          style={{ background: `linear-gradient(135deg, #F0EDE8, ${i % 2 === 0 ? "#E8E4DF" : "#DDD8D2"})` }}
        >
          {item.name}
        </div>
      ))}
    </div>
  );
}

function OutfitCard({
  outfit,
  closetItems,
  onSave,
}: {
  outfit: TodayOutfit;
  closetItems: ClothingItem[];
  onSave: (outfit: TodayOutfit) => void;
}) {
  const [liked, setLiked] = useState<boolean | null>(null);
  const [saved, setSaved] = useState(false);
  const outfitItems = closetItems.filter((i) => outfit.closetItemIds.includes(i.id));
  const occasionStyle = OCCASION_COLORS[outfit.occasion] ?? OCCASION_COLORS.casual;

  function handleSave() {
    if (saved) return;
    setSaved(true);
    onSave(outfit);
  }

  return (
    <div className="bg-white border border-black/[0.08] rounded-xl overflow-hidden flex flex-col">
      <div className="relative bg-[#F9F7F4] flex items-center justify-center" style={{aspectRatio:"3/4"}}>
        <OutfitPreview outfit={outfit} closetItems={closetItems} />
        <span className={`absolute top-2 left-2 px-2 py-1 rounded-full text-[10px] font-medium ${occasionStyle}`}>
          {outfit.occasion}
        </span>
      </div>

      <div className="p-3.5 flex flex-col flex-1">
        <p className="text-[14px] font-medium text-[#111110] mb-1">{outfit.name}</p>
        <p className="text-[12px] text-[#726D68] leading-snug mb-2">{outfit.description}</p>

        <div className="bg-[#F9F7F4] rounded-lg p-2.5 mb-3">
          <p className="text-[11px] text-[#A8A39E] mb-0.5">Styling tip</p>
          <p className="text-[12px] text-[#726D68] leading-snug">{outfit.stylingNote}</p>
        </div>

        {outfitItems.length > 0 && (
          <div className="flex gap-1.5 flex-wrap mb-2">
            {outfitItems.map((item) => (
              <span key={item.id} className="px-2 py-0.5 bg-[#F0EDE8] rounded-full text-[10px] text-[#726D68]">
                {item.name}
              </span>
            ))}
          </div>
        )}

        {outfit.suggestedItems.length > 0 && (
          <div className="flex gap-1.5 flex-wrap mb-3">
            {outfit.suggestedItems.map((item, i) => (
              <span key={i} className="px-2 py-0.5 bg-white border border-black/[0.08] rounded-full text-[10px] text-[#A8A39E]">
                + {item.name}
              </span>
            ))}
          </div>
        )}

        <div className="flex gap-2 mt-auto pt-2 border-t border-black/[0.06]">
          <button
            onClick={() => setLiked(liked === false ? null : false)}
            className={`flex-1 py-1.5 rounded-lg text-[12px] border transition-colors ${
              liked === false
                ? "bg-red-50 border-red-200 text-red-500"
                : "border-black/[0.08] text-[#726D68] hover:bg-[#F0EDE8]"
            }`}
          >
            {liked === false ? "↓ Disliked" : "↓ Dislike"}
          </button>
          <button
            onClick={() => setLiked(liked === true ? null : true)}
            className={`flex-1 py-1.5 rounded-lg text-[12px] border transition-colors ${
              liked === true
                ? "bg-green-50 border-green-200 text-green-600"
                : "border-black/[0.08] text-[#726D68] hover:bg-[#F0EDE8]"
            }`}
          >
            {liked === true ? "↑ Liked" : "↑ Like"}
          </button>
          <button
            onClick={handleSave}
            className={`flex-1 py-1.5 rounded-lg text-[12px] border transition-colors ${
              saved
                ? "bg-[#111110] text-white border-[#111110]"
                : "border-black/[0.08] text-[#726D68] hover:bg-[#F0EDE8]"
            }`}
          >
            {saved ? "Saved ✓" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

function getTodayKey() {
  return `forme_today_${new Date().toISOString().slice(0, 10)}`;
}

export default function TodayPage() {
  const { items: closetItems } = useCloset();
  const { saveOutfit } = useSavedLooks();
  const [outfits, setOutfits] = useState<TodayOutfit[]>([]);
  const [weather, setWeather] = useState<{ temp: string; condition: string; location: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long", month: "long", day: "numeric",
  });

  const fetchOutfits = useCallback(async (force = false) => {
    if (!force) {
      try {
        const cached = localStorage.getItem(getTodayKey());
        if (cached) {
          const { outfits: cachedOutfits, weather: cachedWeather } = JSON.parse(cached);
          setOutfits(cachedOutfits);
          setWeather(cachedWeather);
          setLoading(false);
          return;
        }
      } catch { /* ignore */ }
    }

    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/today-outfits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ closetItems, location: "Vancouver" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to generate outfits");
      setOutfits(data.outfits ?? []);
      setWeather(data.weather ?? null);
      localStorage.setItem(getTodayKey(), JSON.stringify({
        outfits: data.outfits,
        weather: data.weather,
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [closetItems]);

  useEffect(() => { fetchOutfits(false); }, []);

  function handleSave(outfit: TodayOutfit) {
    const items = closetItems.filter((i) => outfit.closetItemIds.includes(i.id));
    saveOutfit({
      name: outfit.name,
      occasion: outfit.occasion as never,
      description: outfit.description,
      items,
      source: "ai-daily",
    });
  }

  return (
    <div>
      <div className="flex items-end justify-between mb-6">
        <div>
          <p className="text-[11px] tracking-[0.08em] uppercase font-medium text-[#A8A39E] mb-1">{today}</p>
          <h1 className="text-[22px] font-medium">Good morning</h1>
          {weather && (
            <p className="text-[14px] text-[#726D68] mt-0.5">
              {weather.temp}°C · {weather.condition} · {weather.location}
            </p>
          )}
        </div>
        <button
          onClick={() => fetchOutfits(true)}
          disabled={loading}
          className="px-4 py-2 border border-black/[0.12] rounded-full text-[13px] text-[#726D68] hover:bg-[#F0EDE8] transition-colors disabled:opacity-40"
        >
          {loading ? "Generating..." : "↺ Refresh"}
        </button>
      </div>

      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#F0EDE8] border border-black/[0.08] rounded-full text-[11px] text-[#726D68] mb-6">
        ✦ AI-styled outfits for today
      </div>

      {loading && (
        <div className="grid grid-cols-3 gap-4">
          {[1,2,3].map((i) => (
            <div key={i} className="bg-white border border-black/[0.08] rounded-xl overflow-hidden animate-pulse">
              <div className="bg-[#F0EDE8]" style={{aspectRatio:"3/4"}} />
              <div className="p-3.5 space-y-2">
                <div className="h-4 bg-[#F0EDE8] rounded w-2/3" />
                <div className="h-3 bg-[#F0EDE8] rounded w-full" />
                <div className="h-3 bg-[#F0EDE8] rounded w-3/4" />
              </div>
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-[13px] text-red-600">{error}</div>
      )}

      {!loading && outfits.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          {outfits.map((outfit) => (
            <OutfitCard
              key={outfit.id}
              outfit={outfit}
              closetItems={closetItems}
              onSave={handleSave}
            />
          ))}
        </div>
      )}
    </div>
  );
}
