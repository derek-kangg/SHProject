"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import type { ClothingItem } from "@/types";

const STORAGE_KEY = "forme_closet_items";

interface ClosetContextType {
  items: ClothingItem[];
  addItem: (item: Omit<ClothingItem, "id">) => void;
  removeItem: (id: string) => void;
}

const ClosetContext = createContext<ClosetContextType>({
  items: [],
  addItem: () => {},
  removeItem: () => {},
});

export function ClosetProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ClothingItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setItems(JSON.parse(saved));
    } catch { /* ignore */ }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, loaded]);

  function addItem(newItem: Omit<ClothingItem, "id">) {
    const item: ClothingItem = { ...newItem, id: `c${Date.now()}` };
    setItems((prev) => [item, ...prev]);
  }

  function removeItem(id: string) {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  return (
    <ClosetContext.Provider value={{ items, addItem, removeItem }}>
      {children}
    </ClosetContext.Provider>
  );
}

export function useCloset() {
  return useContext(ClosetContext);
}