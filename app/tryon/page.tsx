"use client";

import { useState, useRef } from "react";
import { mockSavedLooks, mockDailyOutfits } from "@/lib/mock-data";
import type { Outfit, BodyShape } from "@/types";

const BODY_SHAPES: BodyShape[] = ["athletic", "slim", "curvy", "straight"];

const previewOutfits: Outfit[] = [
  { ...mockDailyOutfits[1], name: "Today's top pick" },
  { ...mockSavedLooks[0] },
  { ...mockSavedLooks[1] },
];

export default function TryOnPage() {
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [bodyShape, setBodyShape] = useState<BodyShape>("athletic");
  const [selectedOutfit, setSelectedOutfit] = useState<string>(previewOutfits[0].id);
  const [generated, setGenerated] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const [photoName, setPhotoName] = useState<string | null>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) setPhotoName(file.name);
  }

  return (
    <div>
      <h1 className="text-[22px] font-medium">Try On</h1>
      <p className="text-[14px] text-forme-muted mb-6">
        See any outfit on your avatar before you wear it
      </p>

      <div className="grid grid-cols-2 gap-5">

        {/* ── Avatar preview ── */}
        <div className="aspect-[9/16] max-h-[480px] bg-forme-secondary border-forme rounded-card flex flex-col items-center justify-center gap-3 text-forme-subtle">
          {generated ? (
            <>
              <div className="w-16 h-16 rounded-full bg-black/[0.1]" />
              <div className="w-20 h-36 bg-black/[0.1] rounded-lg" />
              <div className="w-20 h-20 bg-black/[0.08] rounded" />
              <p className="text-[12px] mt-2">Avatar generated</p>
            </>
          ) : (
            <>
              <div className="w-16 h-16 rounded-full bg-black/[0.08]" />
              <div className="w-20 h-36 bg-black/[0.08] rounded-lg" />
              <div className="w-20 h-20 bg-black/[0.06] rounded" />
              <p className="text-[12px] mt-2">Avatar preview</p>
            </>
          )}
        </div>

        {/* ── Controls ── */}
        <div className="flex flex-col gap-4">

          {/* Profile card */}
          <div className="bg-forme-card border-forme rounded-card p-5">
            <p className="label-caps mb-4">Your profile</p>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="flex flex-col gap-1">
                <label className="text-[12px] text-forme-muted">Height</label>
                <input
                  type="text"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  placeholder="5'10""
                  className="border-forme rounded-lg px-3 py-2 text-[13px] bg-forme-card text-forme-ink placeholder:text-forme-subtle outline-none focus:border-forme-strong transition-colors"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[12px] text-forme-muted">Weight</label>
                <input
                  type="text"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="160 lbs"
                  className="border-forme rounded-lg px-3 py-2 text-[13px] bg-forme-card text-forme-ink placeholder:text-forme-subtle outline-none focus:border-forme-strong transition-colors"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1 mb-3">
              <label className="text-[12px] text-forme-muted">Body shape</label>
              <select
                value={bodyShape}
                onChange={(e) => setBodyShape(e.target.value as BodyShape)}
                className="border-forme rounded-lg px-3 py-2 text-[13px] bg-forme-card text-forme-ink outline-none focus:border-forme-strong transition-colors capitalize"
              >
                {BODY_SHAPES.map((s) => (
                  <option key={s} value={s} className="capitalize">{s}</option>
                ))}
              </select>
            </div>

            {/* Photo upload */}
            <div className="flex flex-col gap-1">
              <label className="text-[12px] text-forme-muted">Profile photo</label>
              <button
                onClick={() => fileRef.current?.click()}
                className="border-dashed border-forme-md rounded-lg p-4 text-center hover:bg-forme-secondary transition-colors w-full"
              >
                {photoName ? (
                  <p className="text-[12px] text-forme-ink">{photoName}</p>
                ) : (
                  <>
                    <p className="text-[12px] text-forme-muted">Upload a face photo</p>
                    <p className="text-[11px] text-forme-subtle mt-0.5">JPG or PNG</p>
                  </>
                )}
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="image/jpeg,image/png"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          </div>

          {/* Outfit selector */}
          <div className="bg-forme-card border-forme rounded-card p-5">
            <p className="label-caps mb-3">Choose outfit to preview</p>
            <div className="flex flex-col gap-2 mb-4">
              {previewOutfits.map((outfit) => (
                <button
                  key={outfit.id}
                  onClick={() => { setSelectedOutfit(outfit.id); setGenerated(false); }}
                  className={`flex items-center gap-3 p-2.5 rounded-lg border text-left transition-colors ${
                    selectedOutfit === outfit.id
                      ? "border-forme-strong bg-forme-secondary"
                      : "border-forme hover:border-forme-md"
                  }`}
                >
                  <div className="w-9 h-9 bg-forme-secondary rounded border-forme flex-shrink-0" />
                  <div>
                    <p className="text-[13px] text-forme-ink">{outfit.name ?? "Untitled look"}</p>
                    <p className="text-[11px] text-forme-muted">
                      {outfit.items.map((i) => i.name).join(" · ")}
                    </p>
                  </div>
                </button>
              ))}
            </div>

            <button
              onClick={() => setGenerated(true)}
              className="w-full py-2.5 bg-forme-ink text-forme-card rounded-lg text-[13px] hover:opacity-90 transition-opacity"
            >
              Generate avatar look
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
