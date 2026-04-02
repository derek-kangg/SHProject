"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import type { ClothingItem, Occasion } from "@/types";

export interface SavedOutfit {
  id: string;
  name: string;
  occasion?: Occasion;
  description?: string;
  items: ClothingItem[];
  source: "ai-daily" | "style-builder" | "manual";
  savedAt: string;
}

interface SavedLooksContextType {
  savedLooks: SavedOutfit[];
  saveOutfit: (outfit: Omit<SavedOutfit, "id" | "savedAt">) => void;
  removeOutfit: (id: string) => void;
}

const SavedLooksContext = createContext<SavedLooksContextType>({
  savedLooks: [],
  saveOutfit: () => {},
  removeOutfit: () => {},
});

const STORAGE_KEY = "forme_saved_looks";

export function SavedLooksProvider({ children }: { children: ReactNode }) {
  const [savedLooks, setSavedLooks] = useState<SavedOutfit[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setSavedLooks(JSON.parse(saved));
    } catch { /* ignore */ }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(savedLooks));
  }, [savedLooks, loaded]);

  function saveOutfit(outfit: Omit<SavedOutfit, "id" | "savedAt">) {
    const newOutfit: SavedOutfit = {
      ...outfit,
      id: `look_${Date.now()}`,
      savedAt: new Date().toISOString(),
    };
    setSavedLooks((prev) => [newOutfit, ...prev]);
  }

  function removeOutfit(id: string) {
    setSavedLooks((prev) => prev.filter((o) => o.id !== id));
  }

  return (
    <SavedLooksContext.Provider value={{ savedLooks, saveOutfit, removeOutfit }}>
      {children}
    </SavedLooksContext.Provider>
  );
}

export function useSavedLooks() {
  return useContext(SavedLooksContext);
}