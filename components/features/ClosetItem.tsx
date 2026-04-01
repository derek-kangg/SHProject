"use client";
import type { ClothingItem } from "@/types";

interface ClosetItemProps {
  item: ClothingItem;
  selected?: boolean;
  onClick?: (item: ClothingItem) => void;
  showAnchorBadge?: boolean;
}

export default function ClosetItem({ item, selected, onClick, showAnchorBadge }: ClosetItemProps) {
  return (
    <button
      onClick={() => onClick?.(item)}
      className={`bg-white rounded-lg overflow-hidden text-left transition-all ${
        selected ? "border-[1.5px] border-[#111110]" : "border border-black/[0.08] hover:border-black/[0.15]"
      }`}
    >
      <div className="bg-[#F0EDE8] flex items-center justify-center relative" style={{aspectRatio:"1"}}>
        <span className="text-[10px] text-[#A8A39E] text-center px-1 leading-tight">{item.name}</span>
        {showAnchorBadge && (
          <span className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-[#111110] rounded text-[9px] text-white">✦</span>
        )}
      </div>
      <div className="px-2 py-1.5">
        <p className="text-[11px] text-[#726D68] leading-tight truncate">{item.name}</p>
      </div>
    </button>
  );
}
