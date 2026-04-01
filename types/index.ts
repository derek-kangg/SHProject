export type ClothingCategory = "tops"|"bottoms"|"outerwear"|"shoes"|"accessories"|"dresses";
export type Gender = "men"|"women"|"all";
export type Occasion = "casual"|"work"|"evening"|"smart-casual"|"gym"|"brunch"|"date"|"custom";
export type BodyShape = "athletic"|"slim"|"curvy"|"straight";
export type OutfitSource = "ai-daily"|"style-builder"|"manual";

export interface ClothingItem {
  id: string;
  name: string;
  category: ClothingCategory;
  color?: string;
  brand?: string;
  imageUrl?: string;
  wearCount?: number;
  purchasePrice?: number;
}

export interface Outfit {
  id: string;
  name?: string;
  items: ClothingItem[];
  occasion?: Occasion;
  source: OutfitSource;
  savedAt?: string;
  anchorItemId?: string;
  includesShopItem?: boolean;
}

export interface ShopItem {
  id: string;
  name: string;
  brand: string;
  price: number;
  imageUrl?: string;
  pairsWithCount?: number;
  fillsGap?: boolean;
  affiliateUrl?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  gender: Gender;
  location?: string;
  heightCm?: number;
  weightKg?: number;
  bodyShape?: BodyShape;
  avatarPhotoUrl?: string;
}
