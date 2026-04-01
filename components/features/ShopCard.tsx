import type { ShopItem } from "@/types";

export default function ShopCard({ item }: { item: ShopItem }) {
  return (
    <div className="bg-white border border-black/[0.08] rounded-xl overflow-hidden">
      <div className="bg-[#F0EDE8] flex items-center justify-center" style={{aspectRatio:"3/4"}}>
        <span className="text-[11px] text-[#A8A39E]">{item.name}</span>
      </div>
      <div className="p-3">
        <p className="text-[13px] mb-0.5">{item.name}</p>
        <p className="text-[12px] text-[#726D68]">${item.price} · {item.brand}</p>
        <p className="text-[11px] text-[#A8A39E] mt-1">
          {item.fillsGap ? "Fills a closet gap" : `Pairs with ${item.pairsWithCount} items you own`}
        </p>
        <a
          href={item.affiliateUrl ?? "#"}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 block w-full py-1.5 text-center border border-black/[0.15] rounded-lg text-[12px] text-[#111110] hover:bg-[#F0EDE8] transition-colors"
        >
          View item
        </a>
      </div>
    </div>
  );
}
