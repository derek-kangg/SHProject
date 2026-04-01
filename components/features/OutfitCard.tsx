"use client";
import { useState } from "react";
import type { Outfit } from "@/types";

const OCCASION_LABELS: Record<string, string> = {
  casual:"Casual", work:"Work", evening:"Evening",
  "smart-casual":"Smart casual", gym:"Gym", brunch:"Brunch", date:"Date night", custom:"Custom",
};

interface OutfitCardProps {
  outfit: Outfit;
  isTopPick?: boolean;
  onSave?: (outfit: Outfit) => void;
}

export default function OutfitCard({ outfit, isTopPick, onSave }: OutfitCardProps) {
  const [thumbed, setThumbed] = useState<"up"|"down"|null>(null);
  const [saved, setSaved] = useState(false);

  function handleSave() { setSaved(true); onSave?.(outfit); }

  const pieceCount = outfit.items.length + (outfit.includesShopItem ? 1 : 0);
  const fromShop = outfit.includesShopItem ? " · 1 from shop" : " · your closet";
  const label = outfit.occasion ? OCCASION_LABELS[outfit.occasion] : undefined;

  return (
    <div className="bg-white border border-black/[0.08] rounded-xl overflow-hidden group">
      <div className="relative bg-[#F0EDE8] flex items-center justify-center" style={{aspectRatio:"3/4"}}>
        <div className="flex flex-col items-center gap-1">
          <div className="w-14 bg-black/[0.08] rounded" style={{height:"72px"}} />
          <div className="w-14 h-16 bg-black/[0.12] rounded" />
          <div className="w-12 h-7 bg-black/[0.08] rounded" />
        </div>
        {label && (
          <span className="absolute top-2 left-2 px-2 py-1 bg-white border border-black/[0.08] rounded-full text-[10px] text-[#726D68]">
            {label}
          </span>
        )}
        {isTopPick && (
          <span className="absolute top-2 right-2 px-2 py-1 bg-[#111110] rounded-full text-[10px] text-white">
            Top pick
          </span>
        )}
        <button
          onClick={handleSave}
          className={`absolute bottom-2 right-2 px-3 py-1 border rounded-full text-[10px] transition-all ${
            saved
              ? "bg-[#111110] text-white border-[#111110]"
              : "bg-white border-black/[0.08] text-[#726D68] opacity-0 group-hover:opacity-100"
          }`}
        >
          {saved ? "Saved ✓" : "Save look"}
        </button>
      </div>
      <div className="px-3 py-2.5 flex items-center justify-between">
        <span className="text-[11px] text-[#726D68] tracking-[0.04em]">{pieceCount} pieces{fromShop}</span>
        <div className="flex gap-1.5">
          {(["up","down"] as const).map((dir) => (
            <button
              key={dir}
              onClick={() => setThumbed(thumbed === dir ? null : dir)}
              className={`w-6 h-6 rounded-full border text-[11px] flex items-center justify-center transition-colors ${
                thumbed === dir
                  ? "bg-[#111110] text-white border-[#111110]"
                  : "bg-[#F0EDE8] border-black/[0.08] text-[#726D68] hover:border-black/[0.15]"
              }`}
            >
              {dir === "up" ? "↑" : "↓"}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
