"use client";
import Link from "next/link";
import type { Outfit } from "@/types";

const SOURCE_LABELS: Record<string, string> = {
  "ai-daily":"Today's pick", "style-builder":"Style Builder", manual:"Manual",
};

export default function SavedLookCard({ outfit }: { outfit: Outfit }) {
  const date = outfit.savedAt
    ? new Date(outfit.savedAt).toLocaleDateString("en-US", { month:"short", day:"numeric" })
    : null;
  const pieces = outfit.items.map((i) => i.name).join(" · ");

  return (
    <div className="bg-white border border-black/[0.08] rounded-xl overflow-hidden group">
      <div className="relative bg-[#F0EDE8] flex items-center justify-center" style={{aspectRatio:"3/4"}}>
        <div className="flex flex-col items-center gap-1">
          <div className="w-16 bg-black/[0.1] rounded" style={{height:"88px"}} />
          <div className="w-12 h-7 bg-black/[0.07] rounded" />
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
      <div className="px-3.5 py-2.5">
        <p className="text-[13px] font-medium mb-0.5">{outfit.name ?? "Untitled look"}</p>
        <p className="text-[11px] text-[#726D68] leading-snug">{pieces}{date ? ` · ${date}` : ""}</p>
      </div>
    </div>
  );
}
