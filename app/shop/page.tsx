"use client";

import { useState, useEffect, useCallback } from "react";
import Pill from "@/components/ui/Pill";
import { mockWardrobeGaps } from "@/lib/mock-data";
import type { ShopProduct } from "@/app/api/shop-products/route";

type StylePref = "trending" | "minimalist" | "streetwear" | "classic" | "casual" | "formal";
type Gender    = "all" | "men" | "women";
type ShopTab   = "trending" | "gap";

const STYLES: { label: string; value: StylePref }[] = [
  { label: "Trending",   value: "trending"   },
  { label: "Minimalist", value: "minimalist" },
  { label: "Streetwear", value: "streetwear" },
  { label: "Classic",    value: "classic"    },
  { label: "Casual",     value: "casual"     },
  { label: "Formal",     value: "formal"     },
];

const GENDERS: { label: string; value: Gender }[] = [
  { label: "All",   value: "all"   },
  { label: "Men",   value: "men"   },
  { label: "Women", value: "women" },
];

const BUDGET_PRESETS = [
  { label: "Under $50",   min: 0,   max: 50   },
  { label: "$50 – $150",  min: 50,  max: 150  },
  { label: "$150 – $300", min: 150, max: 300  },
  { label: "$300 – $500", min: 300, max: 500  },
  { label: "$500+",       min: 500, max: 9999 },
];

function ProductCard({ product }: { product: ShopProduct }) {
  function handleClick() {
    if (product.link) window.open(product.link, "_blank");
  }
  return (
    <div
      onClick={handleClick}
      className="bg-white border border-black/[0.08] rounded-xl overflow-hidden hover:border-black/[0.2] transition-colors group cursor-pointer"
    >
      <div
        className="bg-[#F0EDE8] overflow-hidden flex items-center justify-center"
        style={{aspectRatio:"3/4"}}
      >
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <span className="text-[11px] text-[#A8A39E]">No image</span>
        )}
      </div>
      <div className="p-3">
        <p className="text-[13px] text-[#111110] leading-tight line-clamp-2 mb-1.5">
          {product.title}
        </p>
        <div className="flex items-center justify-between">
          {product.price  && (
            <span className="text-[12px] font-medium text-[#111110]">{product.price}</span>
          )}
          {product.source && (
            <span className="text-[11px] text-[#A8A39E] truncate ml-2">{product.source}</span>
          )}
        </div>
      </div>
    </div>
  );
}

function ProductGrid({ products, loading }: { products: ShopProduct[]; loading: boolean }) {
  if (loading) {
    return (
      <div className="grid grid-cols-4 gap-4">
        {Array.from({ length: 16 }).map((_, i) => (
          <div
            key={i}
            className="bg-white border border-black/[0.08] rounded-xl overflow-hidden animate-pulse"
          >
            <div className="bg-[#F0EDE8]" style={{aspectRatio:"3/4"}} />
            <div className="p-3 space-y-2">
              <div className="h-3 bg-[#F0EDE8] rounded w-3/4" />
              <div className="h-3 bg-[#F0EDE8] rounded w-1/3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="py-16 text-center">
        <p className="text-[14px] text-[#726D68]">
          No products found — try adjusting your filters.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-4 gap-4">
      {products.map((p) => <ProductCard key={p.id} product={p} />)}
    </div>
  );
}

export default function ShopPage() {
  const [activeTab,    setActiveTab]    = useState<ShopTab>("trending");
  const [activeStyle,  setActiveStyle]  = useState<StylePref>("trending");
  const [activeGender, setActiveGender] = useState<Gender>("all");
  const [activeGap,    setActiveGap]    = useState<string>(mockWardrobeGaps[0]);
  const [budgetMin,    setBudgetMin]    = useState(0);
  const [budgetMax,    setBudgetMax]    = useState(9999);
  const [activeBudget, setActiveBudget] = useState<string | null>(null);
  const [products,     setProducts]     = useState<ShopProduct[]>([]);
  const [loading,      setLoading]      = useState(true);

  const closetIsEmpty = true;

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setProducts([]);
    try {
      const params = new URLSearchParams({ gender: activeGender });
      if (activeTab === "gap") {
        params.set("gap", activeGap);
      } else {
        params.set("style", activeStyle);
      }
      if (budgetMin > 0)    params.set("min", String(budgetMin));
      if (budgetMax < 9999) params.set("max", String(budgetMax));

      const res  = await fetch(`/api/shop-products?${params.toString()}`);
      const data = await res.json();
      setProducts(data.products ?? []);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [activeTab, activeStyle, activeGender, activeGap, budgetMin, budgetMax]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  function handleBudgetPreset(label: string, min: number, max: number) {
    setActiveBudget(label);
    setBudgetMin(min);
    setBudgetMax(max);
  }

  function clearBudget() {
    setActiveBudget(null);
    setBudgetMin(0);
    setBudgetMax(9999);
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-end justify-between mb-6">
        <div>
          <h1 className="text-[22px] font-medium">Shop</h1>
          <p className="text-[14px] text-[#726D68]">
            {closetIsEmpty
              ? "Discover pieces that match your style"
              : "Curated picks to fill the gaps in your wardrobe"}
          </p>
        </div>
        <div className="flex gap-1.5">
          {GENDERS.map(({ label, value }) => (
            <Pill
              key={value}
              active={activeGender === value}
              onClick={() => setActiveGender(value)}
            >
              {label}
            </Pill>
          ))}
        </div>
      </div>

      {/* Gap banner */}
      {!closetIsEmpty && (
        <div className="bg-[#F0EDE8] border border-black/[0.08] rounded-xl p-4 flex items-center justify-between mb-6">
          <div>
            <p className="text-[13px] font-medium text-[#111110]">
              Your closet is missing a few key pieces
            </p>
            <p className="text-[12px] text-[#726D68] mt-0.5">
              Based on outfit patterns and style preferences
            </p>
          </div>
          <div className="flex gap-1.5 flex-wrap justify-end ml-4">
            {mockWardrobeGaps.map((gap) => (
              <span
                key={gap}
                className="px-2 py-1 bg-white border border-black/[0.08] rounded text-[11px] text-[#726D68]"
              >
                {gap}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Tabs */}
      {!closetIsEmpty && (
        <div className="flex border-b border-black/[0.08] mb-6">
          {([
            { value: "trending", label: "Trending for you" },
            { value: "gap",      label: "Fill the gap"     },
          ] as { value: ShopTab; label: string }[]).map((t) => (
            <button
              key={t.value}
              onClick={() => setActiveTab(t.value)}
              className={`py-2.5 px-4 text-[13px] border-b-[1.5px] transition-colors -mb-px ${
                activeTab === t.value
                  ? "border-[#111110] text-[#111110] font-medium"
                  : "border-transparent text-[#726D68] hover:text-[#111110]"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      )}

      {/* Gap selector */}
      {!closetIsEmpty && activeTab === "gap" && (
        <div className="flex gap-1.5 flex-wrap mb-5">
          {mockWardrobeGaps.map((gap) => (
            <Pill
              key={gap}
              active={activeGap === gap}
              onClick={() => setActiveGap(gap)}
            >
              {gap}
            </Pill>
          ))}
        </div>
      )}

      {/* Style filters */}
      {(closetIsEmpty || activeTab === "trending") && (
        <div className="flex gap-1.5 flex-wrap mb-5">
          {STYLES.map(({ label, value }) => (
            <Pill
              key={value}
              active={activeStyle === value}
              onClick={() => setActiveStyle(value)}
            >
              {label}
            </Pill>
          ))}
        </div>
      )}

      {/* Budget filter */}
      <div className="flex items-center gap-2 mb-6 flex-wrap">
        <span className="text-[12px] text-[#726D68] mr-1">Budget</span>
        {BUDGET_PRESETS.map(({ label, min, max }) => (
          <Pill
            key={label}
            active={activeBudget === label}
            onClick={() =>
              activeBudget === label
                ? clearBudget()
                : handleBudgetPreset(label, min, max)
            }
          >
            {label}
          </Pill>
        ))}
        {activeBudget && (
          <button
            onClick={clearBudget}
            className="text-[12px] text-[#726D68] underline ml-1"
          >
            Clear
          </button>
        )}
      </div>

      <ProductGrid products={products} loading={loading} />
    </div>
  );
}