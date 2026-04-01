"use client";

import { useState, useRef, useCallback } from "react";
import type { ClothingItem, ClothingCategory } from "@/types";

const CATEGORIES: { value: ClothingCategory; label: string }[] = [
  { value: "tops",        label: "Tops"        },
  { value: "bottoms",     label: "Bottoms"     },
  { value: "outerwear",   label: "Outerwear"   },
  { value: "shoes",       label: "Shoes"       },
  { value: "dresses",     label: "Dresses"     },
  { value: "accessories", label: "Accessories" },
];

const COLORS = [
  "Black", "White", "Grey", "Navy", "Blue", "Brown",
  "Beige", "Cream", "Green", "Red", "Pink", "Yellow",
  "Orange", "Purple", "Multicolor", "Other",
];

type Tab = "search" | "upload";

interface ProductResult {
  id: string;
  title: string;
  brand?: string;
  price?: string;
  imageUrl?: string;
  source?: string;
}

interface FormState {
  name: string;
  category: ClothingCategory | "";
  color: string;
  brand: string;
  purchasePrice: string;
}

const emptyForm: FormState = {
  name: "", category: "", color: "", brand: "", purchasePrice: "",
};

interface AddItemModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (item: Omit<ClothingItem, "id">) => void;
}

export default function AddItemModal({ open, onClose, onAdd }: AddItemModalProps) {
  const [tab, setTab] = useState<Tab>("search");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ProductResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [selected, setSelected] = useState<ProductResult | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);

  function resetAll() {
    setQuery(""); setResults([]); setSearchError(""); setSelected(null);
    setPhotoPreview(null); setForm(emptyForm); setShowForm(false);
    setTab("search");
  }

  function handleClose() { resetAll(); onClose(); }

  function setField(field: keyof FormState, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function handleSubmit() {
    if (!form.name || !form.category) return;
    onAdd({
      name: form.name,
      category: form.category as ClothingCategory,
      color: form.color || undefined,
      brand: form.brand || undefined,
      purchasePrice: form.purchasePrice ? parseFloat(form.purchasePrice) : undefined,
      imageUrl: selected?.imageUrl ?? photoPreview ?? undefined,
      wearCount: 0,
    });
    handleClose();
  }

  async function handleSearch(e?: React.FormEvent) {
    e?.preventDefault();
    if (query.trim().length < 2) return;
    setSearching(true); setSearchError(""); setResults([]);
    try {
      const res = await fetch(`/api/search-products?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Search failed");
      setResults(data.results ?? []);
    } catch (err) {
      setSearchError(err instanceof Error ? err.message : "Search failed");
    } finally {
      setSearching(false);
    }
  }

  function handleSelectResult(result: ProductResult) {
    setSelected(result);
    setForm({
      ...emptyForm,
      name: result.title,
      brand: result.brand ?? "",
      purchasePrice: result.price ? result.price.replace(/[^0-9.]/g, "") : "",
    });
    setShowForm(true);
  }

  function handleFile(file: File) {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      setPhotoPreview(e.target?.result as string);
      setShowForm(true);
    };
    reader.readAsDataURL(file);
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, []);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
      onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
    >
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-black/[0.08]">
          <h2 className="text-[17px] font-medium">Add item</h2>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-full bg-[#F0EDE8] flex items-center justify-center text-[#726D68] hover:bg-[#E8E4DF] transition-colors text-[18px]"
          >
            ×
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-black/[0.08] px-6">
          {(["search", "upload"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => { setTab(t); setShowForm(false); setSelected(null); setPhotoPreview(null); }}
              className={`py-3 px-4 text-[13px] border-b-[1.5px] transition-colors -mb-px ${
                tab === t
                  ? "border-[#111110] text-[#111110] font-medium"
                  : "border-transparent text-[#726D68] hover:text-[#111110]"
              }`}
            >
              {t === "search" ? "Search online" : "Upload photo"}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 p-6">

          {/* Search tab */}
          {tab === "search" && !showForm && (
            <div>
              <form onSubmit={handleSearch} className="flex gap-2 mb-5">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="e.g. black slim trousers, white linen shirt..."
                  className="flex-1 border border-black/[0.12] rounded-lg px-4 py-2.5 text-[13px] outline-none focus:border-black/[0.3] transition-colors"
                />
                <button
                  type="submit"
                  disabled={searching || query.trim().length < 2}
                  className="px-5 py-2.5 bg-[#111110] text-white rounded-lg text-[13px] disabled:opacity-40 hover:opacity-90 transition-opacity"
                >
                  {searching ? "Searching..." : "Search"}
                </button>
              </form>

              {searchError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-lg text-[13px] text-red-600">
                  {searchError}
                </div>
              )}


              {results.length > 0 && (
                <div className="grid grid-cols-3 gap-3">
                  {results.map((result) => (
                    <button
                      key={result.id}
                      onClick={() => handleSelectResult(result)}
                      className="bg-white border border-black/[0.08] rounded-xl overflow-hidden text-left hover:border-black/[0.2] transition-colors"
                    >
                      <div className="aspect-square bg-[#F0EDE8] flex items-center justify-center overflow-hidden">
                        {result.imageUrl ? (
                          <img src={result.imageUrl} alt={result.title} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-[10px] text-[#A8A39E]">No image</span>
                        )}
                      </div>
                      <div className="p-2.5">
                        <p className="text-[11px] text-[#111110] leading-tight line-clamp-2 mb-1">{result.title}</p>
                        <div className="flex items-center justify-between">
                          {result.price && <span className="text-[11px] font-medium">{result.price}</span>}
                          {result.source && <span className="text-[10px] text-[#A8A39E] truncate ml-1">{result.source}</span>}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Upload tab */}
          {tab === "upload" && !showForm && (
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-xl p-10 text-center transition-colors ${
                isDragging ? "border-[#111110] bg-[#F0EDE8]" : "border-black/[0.12] bg-[#F9F7F4]"
              }`}
            >
              <p className="text-[15px] text-[#111110] mb-1">Drag a photo here</p>
              <p className="text-[13px] text-[#726D68] mb-5">JPG or PNG of your clothing item</p>
              <div className="flex gap-2 justify-center">
                <button
                  onClick={() => fileRef.current?.click()}
                  className="px-4 py-2 border border-black/[0.15] rounded-lg text-[13px] text-[#111110] hover:bg-white transition-colors"
                >
                  Browse files
                </button>
                <button
                  onClick={() => cameraRef.current?.click()}
                  className="px-4 py-2 border border-black/[0.15] rounded-lg text-[13px] text-[#111110] hover:bg-white transition-colors"
                >
                  Take photo
                </button>
              </div>
              <input ref={fileRef} type="file" accept="image/*" className="hidden"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
              <input ref={cameraRef} type="file" accept="image/*" capture="environment" className="hidden"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
            </div>
          )}

          {/* Details form */}
          {showForm && (
            <div>
              <div className="flex gap-4 mb-6">
                <div className="w-24 h-24 rounded-xl bg-[#F0EDE8] border border-black/[0.08] flex-shrink-0 overflow-hidden flex items-center justify-center">
                  {(selected?.imageUrl || photoPreview) ? (
                    <img src={selected?.imageUrl ?? photoPreview ?? ""} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-[10px] text-[#A8A39E]">No image</span>
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-[13px] text-[#726D68] leading-snug">Fill in the details to add this item to your closet.</p>
                  <button onClick={() => { setShowForm(false); setSelected(null); setPhotoPreview(null); }}
                    className="mt-2 text-[12px] text-[#726D68] underline">
                    ← Go back
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div>
                  <label className="text-[12px] text-[#726D68] block mb-1">Item name <span className="text-red-400">*</span></label>
                  <input type="text" value={form.name} onChange={(e) => setField("name", e.target.value)}
                    placeholder="e.g. Black slim trousers"
                    className="w-full border border-black/[0.12] rounded-lg px-3 py-2.5 text-[13px] outline-none focus:border-black/[0.3] transition-colors" />
                </div>

                <div>
                  <label className="text-[12px] text-[#726D68] block mb-1">Category <span className="text-red-400">*</span></label>
                  <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map(({ value, label }) => (
                      <button key={value} onClick={() => setField("category", value)}
                        className={`px-3 py-1.5 rounded-full text-[12px] border transition-colors ${
                          form.category === value
                            ? "bg-[#111110] text-white border-[#111110]"
                            : "bg-white text-[#726D68] border-black/[0.08] hover:border-black/[0.2]"
                        }`}>
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-[12px] text-[#726D68] block mb-1">Colour</label>
                  <div className="flex flex-wrap gap-2">
                    {COLORS.map((c) => (
                      <button key={c} onClick={() => setField("color", c)}
                        className={`px-3 py-1.5 rounded-full text-[12px] border transition-colors ${
                          form.color === c
                            ? "bg-[#111110] text-white border-[#111110]"
                            : "bg-white text-[#726D68] border-black/[0.08] hover:border-black/[0.2]"
                        }`}>
                        {c}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[12px] text-[#726D68] block mb-1">Brand</label>
                    <input type="text" value={form.brand} onChange={(e) => setField("brand", e.target.value)}
                      placeholder="e.g. Zara, Nike..."
                      className="w-full border border-black/[0.12] rounded-lg px-3 py-2.5 text-[13px] outline-none focus:border-black/[0.3] transition-colors" />
                  </div>
                  <div>
                    <label className="text-[12px] text-[#726D68] block mb-1">Price paid ($)</label>
                    <input type="number" value={form.purchasePrice} onChange={(e) => setField("purchasePrice", e.target.value)}
                      placeholder="0.00" min="0" step="0.01"
                      className="w-full border border-black/[0.12] rounded-lg px-3 py-2.5 text-[13px] outline-none focus:border-black/[0.3] transition-colors" />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {showForm && (
          <div className="px-6 py-4 border-t border-black/[0.08] flex gap-3">
            <button onClick={handleClose}
              className="flex-1 py-2.5 border border-black/[0.12] rounded-lg text-[13px] text-[#726D68] hover:bg-[#F0EDE8] transition-colors">
              Cancel
            </button>
            <button onClick={handleSubmit} disabled={!form.name || !form.category}
              className="flex-1 py-2.5 bg-[#111110] text-white rounded-lg text-[13px] disabled:opacity-30 hover:opacity-90 transition-opacity">
              Add to closet
            </button>
          </div>
        )}
      </div>
    </div>
  );
}