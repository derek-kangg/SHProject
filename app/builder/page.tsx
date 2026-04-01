"use client";

import { useState } from "react";
import Pill from "@/components/ui/Pill";
import AiBadge from "@/components/ui/AiBadge";
import ClosetItem from "@/components/features/ClosetItem";
import { mockClosetItems } from "@/lib/mock-data";
import type { ClothingItem, Occasion } from "@/types";

const OCCASIONS: { label: string; value: Occasion }[] = [
  { label: "Casual",       value: "casual"       },
  { label: "Work",         value: "work"         },
  { label: "Evening",      value: "evening"      },
  { label: "Smart casual", value: "smart-casual" },
];

export default function BuilderPage() {
  const [anchor, setAnchor] = useState<ClothingItem | null>(null);
  const [occasion, setOccasion] = useState<Occasion>("casual");
  const [customOpen, setCustomOpen] = useState(false);
  const [customText, setCustomText] = useState("");
  const [generated, setGenerated] = useState(false);
  
  // New states for Gemini Integration
  const [aiAdvice, setAiAdvice] = useState("");
  const [loading, setLoading] = useState(false);

  // Mock generated outfit pieces (everything except the anchor)
  const generatedPieces = anchor
    ? mockClosetItems.filter((i) => i.id !== anchor.id).slice(0, 2)
    : [];

  async function handleGenerate() {
    const anchorName = anchor ? anchor.name : customText;
    if (!anchorName) return;

    setLoading(true);
    setGenerated(false); 

    // Build the prompt for Gemini
    const prompt = `I want to build an outfit around this anchor piece: "${anchorName}". 
      The occasion is ${occasion}. 
      Please suggest a complete outfit including a top, bottom, shoes, and one accessory. 
      Explain briefly why these work together.`;

    try {
      const response = await fetch('/api/stylist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      
      const data = await response.json();
      setAiAdvice(data.text);
      setGenerated(true);
    } catch (error) {
      console.error("Stylist Error:", error);
      alert("The stylist is currently unavailable.");
    } finally {
      setLoading(false);
    }
  }

  function handleReset() {
    setAnchor(null);
    setCustomText("");
    setGenerated(false);
    setCustomOpen(false);
    setAiAdvice("");
  }

  return (
    <div>
      <h1 className="text-[22px] font-medium">Style Builder</h1>
      <p className="text-[14px] text-forme-muted mb-6">
        Pick a piece — AI builds the outfit around it
      </p>

      <div className="grid grid-cols-[1fr_1.4fr] gap-5 items-start">

        {/* ── Left panel: anchor selection ── */}
        <div className="bg-forme-card border-forme rounded-card p-5">
          <p className="label-caps mb-3">1 · Choose your anchor piece</p>

          {/* Closet grid + custom tile */}
          <div className="grid grid-cols-4 gap-2 mb-4">
            {mockClosetItems.slice(0, 7).map((item) => (
              <ClosetItem
                key={item.id}
                item={item}
                selected={anchor?.id === item.id}
                onClick={(i) => {
                  setAnchor(anchor?.id === i.id ? null : i);
                  setCustomOpen(false);
                  setCustomText("");
                  setGenerated(false);
                }}
              />
            ))}

            {/* Custom anchor tile */}
            <button
              onClick={() => {
                setCustomOpen((v) => !v);
                setAnchor(null);
                setGenerated(false);
              }}
              className={`aspect-square rounded-[8px] border flex flex-col items-center justify-center gap-1 transition-colors text-left
                ${customOpen
                  ? "border-[1.5px] border-forme-ink bg-forme-secondary"
                  : "border-dashed border-forme-md bg-forme-card hover:bg-forme-secondary"
                }`}
            >
              <span className="text-[18px] text-forme-subtle leading-none">+</span>
              <span className="text-[10px] text-forme-subtle text-center leading-tight px-1">
                Describe a piece
              </span>
            </button>
          </div>

          {/* Custom text input */}
          {customOpen && (
            <div className="mb-4 bg-forme-secondary border-forme-md rounded-lg p-3">
              <p className="text-[11px] text-forme-muted mb-2">
                Describe the piece you want to build around
              </p>
              <textarea
                value={customText}
                onChange={(e) => { setCustomText(e.target.value); setGenerated(false); }}
                placeholder="e.g. a cream ribbed turtleneck, olive cargo trousers..."
                rows={3}
                className="w-full bg-transparent border-none outline-none text-[13px] text-forme-ink placeholder:text-forme-subtle resize-none font-sans"
              />
            </div>
          )}

          <div className="divider mb-4" />

          <p className="label-caps mb-2">2 · Set the occasion (optional)</p>
          <div className="flex gap-1.5 flex-wrap">
            {OCCASIONS.map(({ label, value }) => (
              <Pill
                key={value}
                active={occasion === value}
                onClick={() => { setOccasion(value); setGenerated(false); }}
              >
                {label}
              </Pill>
            ))}
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading || (!anchor && !customText.trim())}
            className="mt-5 w-full py-2.5 rounded-lg text-[13px] font-medium bg-forme-ink text-forme-card disabled:opacity-30 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
          >
            {loading ? "Consulting Gemini..." : "Build outfit"}
          </button>
        </div>

        {/* ── Right panel: generated outfit ── */}
        <div className="bg-forme-card border-forme rounded-card p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="label-caps">3 · Your outfit</p>
            <AiBadge label="AI-generated" />
          </div>

          {/* Outfit preview / Gemini Response Area */}
          <div className="aspect-[2/3] bg-forme-secondary rounded-lg flex flex-col items-center justify-center gap-1.5 relative mb-4 p-5 overflow-y-auto">
            {loading ? (
              <div className="flex flex-col items-center gap-2">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-forme-ink"></div>
                <p className="text-[12px] text-forme-subtle">Stylist is thinking...</p>
              </div>
            ) : generated ? (
              <div className="h-full w-full">
                <p className="text-[13px] text-forme-ink leading-relaxed whitespace-pre-wrap">
                  {aiAdvice}
                </p>
                <span className="absolute bottom-3 right-3 px-2 py-1 bg-forme-card border-forme rounded-pill text-[10px] text-forme-muted">
                  Built around: {anchor?.name ?? "Custom piece"}
                </span>
              </div>
            ) : (
              <p className="text-[13px] text-forme-subtle text-center px-6">
                {anchor || customText.trim()
                  ? 'Click "Build outfit" to generate'
                  : "Select an anchor piece to get started"}
              </p>
            )}
          </div>

          {/* Pieces list */}
          {generated && (
            <>
              <p className="label-caps mb-3">Pieces used</p>
              <div className="flex flex-col gap-2 mb-4">
                {generatedPieces.map((item) => (
                  <div key={item.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 bg-forme-secondary rounded border-forme flex-shrink-0" />
                      <span className="text-[13px]">{item.name}</span>
                    </div>
                    <span className="text-[11px] text-forme-subtle">your closet</span>
                  </div>
                ))}
                {anchor && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 bg-forme-secondary rounded border-forme-md flex-shrink-0" />
                      <span className="text-[13px]">{anchor.name} ✦</span>
                    </div>
                    <span className="text-[11px] text-forme-subtle">anchor</span>
                  </div>
                )}
              </div>

              <div className="divider mb-4" />

              <div className="flex gap-2">
                <button
                  onClick={handleReset}
                  className="flex-1 py-2.5 border-forme-md rounded-lg text-[13px] text-forme-ink hover:bg-forme-secondary transition-colors"
                >
                  Regenerate
                </button>
                <button className="flex-1 py-2.5 bg-forme-ink text-forme-card rounded-lg text-[13px] hover:opacity-90 transition-opacity">
                  Save look
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}