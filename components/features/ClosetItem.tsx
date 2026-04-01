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
      className={`bg-white rounded-xl overflow-hidden text-left transition-all w-full ${
        selected ? "border-[1.5px] border-[#111110]" : "border border-black/[0.08] hover:border-black/[0.2]"
      }`}
    >
      {/* Image area */}
      <div className="aspect-square bg-[#F0EDE8] flex items-center justify-center relative overflow-hidden">
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex flex-col items-center gap-2 p-3 text-center">
            <div className="w-10 h-10 rounded-full bg-black/[0.06] flex items-center justify-center text-[18px]">
              👕
            </div>
            <span className="text-[10px] text-[#A8A39E] leading-tight">{item.name}</span>
          </div>
        )}
        {showAnchorBadge && (
          <span className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-[#111110] rounded text-[9px] text-white">
            ✦
          </span>
        )}
      </div>

      {/* Footer */}
      <div className="px-2.5 py-2 border-t border-black/[0.06]">
        <p className="text-[12px] text-[#111110] leading-tight truncate font-medium">{item.name}</p>
        {item.brand && (
          <p className="text-[11px] text-[#A8A39E] leading-tight truncate mt-0.5">{item.brand}</p>
        )}
      </div>
    </button>
  );
}
