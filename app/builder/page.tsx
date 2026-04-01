"use client";

import { useState } from "react";
import Pill from "@/components/ui/Pill";
import AiBadge from "@/components/ui/AiBadge";
import ClosetItem from "@/components/features/ClosetItem";
import { useCloset } from "@/lib/closet-context";
import type { ClothingItem, Occasion, Gender } from "@/types";
import type { BuildOutfitResponse, SuggestedItem } from "@/app/api/build-outfit/route";

const OCCASIONS: { label: string; value: Occasion }[] = [
  { label: "Casual",       value: "casual"       },
  { label: "Work",         value: "work"         },
  { label: "Evening",      value: "evening"      },
  { label: "Smart casual", value: "smart-casual" },
  { label: "Date night",   value: "date"         },
  { label: "Gym",          value: "gym"          },
];

const GENDERS: { label: string; value: Gender }[] = [
  { label: "All",   value: "all" },
  { label: "Men",   value: "men" },
  { label: "Women", value: "women" },
];

export default function BuilderPage() {
  const { items: closetItems } = useCloset();
  const [anchor,     setAnchor]     = useState<ClothingItem | null>(null);
  const [occasion,   setOccasion]   = useState<Occasion>("casual");
  const [customOpen, setCustomOpen] = useState(false);
  const [customText, setCustomText] = useState("");
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState("");
  const [result,     setResult]     = useState<BuildOutfitResponse | null>(null);
  const [gender, setGender] = useState<Gender>("all");

  const selectedClosetItems = result
    ? closetItems.filter((i) => result.closetItemIds.includes(i.id))
    : [];

  async function handleBuild() {
    if (!anchor && !customText.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/build-outfit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          anchorItem:   anchor ?? null,
          customAnchor: customText.trim() || null,
          closetItems,
          occasion,
          gender,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to generate outfit");
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  function handleReset() {
    setAnchor(null);
    setCustomText("");
    setCustomOpen(false);
    setResult(null);
    setError("");
  }

  return (
    <div>
      <h1 className="text-[22px] font-medium">Style Builder</h1>
      <p className="text-[14px] text-[#726D68] mb-6">
        Pick a piece — AI builds the outfit around it
      </p>

      <div className="grid grid-cols-[1fr_1.4fr] gap-5 items-start">

        {/* Left: anchor selection */}
        <div className="bg-white border border-black/[0.08] rounded-xl p-5">
          <p className="text-[11px] tracking-[0.08em] uppercase font-medium text-[#A8A39E] mb-3">
            1 · Choose your anchor piece
          </p>

          {closetItems.length === 0 ? (
            <div className="py-6 text-center border border-dashed border-black/[0.12] rounded-xl mb-4">
              <p className="text-[13px] text-[#726D68] mb-1">Your closet is empty</p>
              <p className="text-[11px] text-[#A8A39E]">
                Add items in My Closet first, or describe a piece below.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-2 mb-4">
              {closetItems.slice(0, 7).map((item) => (
                <ClosetItem
                  key={item.id}
                  item={item}
                  selected={anchor?.id === item.id}
                  onClick={(i) => {
                    setAnchor(anchor?.id === i.id ? null : i);
                    setCustomOpen(false);
                    setCustomText("");
                    setResult(null);
                  }}
                />
              ))}
              <button
                onClick={() => {
                  setCustomOpen((v) => !v);
                  setAnchor(null);
                  setResult(null);
                }}
                className={`aspect-square rounded-lg border flex flex-col items-center justify-center gap-1 transition-colors ${
                  customOpen
                    ? "border-[1.5px] border-[#111110] bg-[#F0EDE8]"
                    : "border-dashed border-black/[0.15] hover:bg-[#F0EDE8]"
                }`}
              >
                <span className="text-[18px] text-[#A8A39E] leading-none">+</span>
                <span className="text-[10px] text-[#A8A39E] text-center leading-tight px-1">
                  Describe a piece
                </span>
              </button>
            </div>
          )}

          {customOpen && (
            <div className="mb-4 bg-[#F0EDE8] border border-black/[0.12] rounded-lg p-3">
              <p className="text-[11px] text-[#726D68] mb-2">
                Describe the piece you want to build around
              </p>
              <textarea
                value={customText}
                onChange={(e) => { setCustomText(e.target.value); setResult(null); }}
                placeholder="e.g. a cream ribbed turtleneck, olive cargo trousers..."
                rows={3}
                className="w-full bg-transparent border-none outline-none text-[13px] text-[#111110] placeholder:text-[#A8A39E] resize-none font-sans"
              />
            </div>
          )}

          <div className="h-px bg-black/[0.08] mb-4" />

          <p className="text-[11px] tracking-[0.08em] uppercase font-medium text-[#A8A39E] mb-2">
            2 · Set the occasion
          </p>
          <div className="flex gap-1.5 flex-wrap mb-5">
            {OCCASIONS.map(({ label, value }) => (
              <Pill
                key={value}
                active={occasion === value}
                onClick={() => { setOccasion(value); setResult(null); }}
              >
                {label}
              </Pill>
            ))}
          </div>

          <p className="text-[11px] tracking-[0.08em] uppercase font-medium text-[#A8A39E] mb-2">
  3 · Style Preference
</p>
<div className="flex gap-1.5 flex-wrap mb-5">
  {GENDERS.map(({ label, value }) => (
    <Pill
      key={value}
      active={gender === value}
      onClick={() => { setGender(value); setResult(null); }}
    >
      {label}
    </Pill>
  ))}
</div>
          <button
            onClick={handleBuild}
            disabled={loading || (!anchor && !customText.trim())}
            className="w-full py-2.5 rounded-lg text-[13px] font-medium bg-[#111110] text-white disabled:opacity-30 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
          >
            {loading ? "Building outfit..." : "Build outfit"}
          </button>

          {error && (
            <p className="mt-3 text-[12px] text-red-500 text-center">{error}</p>
          )}
        </div>

        {/* Right: result */}
        <div className="bg-white border border-black/[0.08] rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="text-[11px] tracking-[0.08em] uppercase font-medium text-[#A8A39E]">
              3 · Your outfit
            </p>
            <AiBadge label="Gemini AI" />
          </div>

          {/* Loading */}
          {loading && (
            <div className="space-y-3 animate-pulse">
              <div className="h-24 bg-[#F0EDE8] rounded-xl" />
              <div className="h-4 bg-[#F0EDE8] rounded w-3/4" />
              <div className="h-4 bg-[#F0EDE8] rounded w-1/2" />
              <div className="h-4 bg-[#F0EDE8] rounded w-2/3" />
            </div>
          )}

          {/* Empty state */}
          {!loading && !result && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 rounded-full bg-[#F0EDE8] flex items-center justify-center text-[24px] mb-3">
                ✦
              </div>
              <p className="text-[13px] text-[#726D68]">
                {anchor || customText.trim()
                  ? 'Click "Build outfit" to generate'
                  : "Select an anchor piece to get started"}
              </p>
            </div>
          )}

          {/* Result */}
          {!loading && result && (
            <div>
              <div className="bg-[#F0EDE8] rounded-xl p-4 mb-5">
                <p className="text-[13px] text-[#111110] leading-relaxed">
                  {result.outfitDescription}
                </p>
              </div>

              <p className="text-[11px] tracking-[0.08em] uppercase font-medium text-[#A8A39E] mb-3">
                Anchor piece
              </p>
              <div className="flex items-center gap-3 mb-5 p-3 border border-[#111110] rounded-xl">
                <div className="w-10 h-10 bg-[#F0EDE8] rounded-lg flex-shrink-0 overflow-hidden flex items-center justify-center">
                  {anchor?.imageUrl ? (
                    <img src={anchor.imageUrl} alt={anchor.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-[10px] text-[#A8A39E]">✦</span>
                  )}
                </div>
                <div>
                  <p className="text-[13px] font-medium text-[#111110]">
                    {anchor?.name ?? customText}
                  </p>
                  <p className="text-[11px] text-[#A8A39E]">Anchor</p>
                </div>
              </div>

              {selectedClosetItems.length > 0 && (
                <>
                  <p className="text-[11px] tracking-[0.08em] uppercase font-medium text-[#A8A39E] mb-3">
                    From your closet
                  </p>
                  <div className="flex flex-col gap-2 mb-5">
                    {selectedClosetItems.map((item) => (
                      <div key={item.id} className="flex items-center gap-3 p-3 bg-[#F9F7F4] rounded-xl">
                        <div className="w-10 h-10 bg-[#F0EDE8] rounded-lg flex-shrink-0 overflow-hidden flex items-center justify-center">
                          {item.imageUrl ? (
                            <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-[10px] text-[#A8A39E]">{item.category[0].toUpperCase()}</span>
                          )}
                        </div>
                        <div>
                          <p className="text-[13px] text-[#111110]">{item.name}</p>
                          {item.brand && <p className="text-[11px] text-[#A8A39E]">{item.brand}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {result.suggestedItems.length > 0 && (
                <>
                  <p className="text-[11px] tracking-[0.08em] uppercase font-medium text-[#A8A39E] mb-3">
                    Suggested to complete the look
                  </p>
                  <div className="flex flex-col gap-2 mb-5">
                    {result.suggestedItems.map((item: SuggestedItem, i: number) => (
                      <div key={i} className="p-3 border border-black/[0.08] rounded-xl">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="text-[13px] font-medium text-[#111110]">{item.name}</p>
                            <p className="text-[11px] text-[#726D68] mt-0.5 leading-snug">{item.why}</p>
                          </div>
                          <button
                            onClick={() => window.open(`/shop?q=${encodeURIComponent(item.searchQuery)}`, "_blank")}
                            className="flex-shrink-0 px-2.5 py-1 border border-black/[0.12] rounded-full text-[11px] text-[#111110] hover:bg-[#F0EDE8] transition-colors"
                          >
                            Shop
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              <p className="text-[11px] tracking-[0.08em] uppercase font-medium text-[#A8A39E] mb-3">
                Styling tips
              </p>
              <div className="flex flex-col gap-2 mb-5">
                {result.stylingTips.map((tip: string, i: number) => (
                  <div key={i} className="flex gap-2.5 items-start">
                    <span className="text-[#A8A39E] text-[12px] mt-0.5 flex-shrink-0">{i + 1}.</span>
                    <p className="text-[13px] text-[#726D68] leading-snug">{tip}</p>
                  </div>
                ))}
              </div>

              <div className="h-px bg-black/[0.08] mb-4" />
              <div className="flex gap-2">
                <button
                  onClick={handleReset}
                  className="flex-1 py-2.5 border border-black/[0.12] rounded-lg text-[13px] text-[#726D68] hover:bg-[#F0EDE8] transition-colors"
                >
                  Start over
                </button>
                <button
                  onClick={handleBuild}
                  className="flex-1 py-2.5 border border-black/[0.12] rounded-lg text-[13px] text-[#726D68] hover:bg-[#F0EDE8] transition-colors"
                >
                  Regenerate
                </button>
                <button className="flex-1 py-2.5 bg-[#111110] text-white rounded-lg text-[13px] hover:opacity-90 transition-opacity">
                  Save look
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}