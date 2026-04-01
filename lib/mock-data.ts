import type { ClothingItem, Outfit, ShopItem, UserProfile } from "@/types";

export const mockUser: UserProfile = {
  id: "u1", name: "Alex", gender: "all", location: "Vancouver, BC",
};

export const mockClosetItems: ClothingItem[] = [
  { id:"c1",  name:"Black Blazer",     category:"outerwear",   wearCount:14 },
  { id:"c2",  name:"White Tee",        category:"tops",        wearCount:32 },
  { id:"c3",  name:"Slim Trousers",    category:"bottoms",     wearCount:18 },
  { id:"c4",  name:"Dark Denim",       category:"bottoms",     wearCount:24 },
  { id:"c5",  name:"White Sneakers",   category:"shoes",       wearCount:40 },
  { id:"c6",  name:"Linen Dress",      category:"dresses",     wearCount:7  },
  { id:"c7",  name:"Wool Coat",        category:"outerwear",   wearCount:11 },
  { id:"c8",  name:"Oxford Shirt",     category:"tops",        wearCount:16 },
  { id:"c9",  name:"Chelsea Boots",    category:"shoes",       wearCount:20 },
  { id:"c10", name:"Cashmere Sweater", category:"tops",        wearCount:9  },
  { id:"c11", name:"Linen Trousers",   category:"bottoms",     wearCount:6  },
  { id:"c12", name:"Leather Belt",     category:"accessories", wearCount:28 },
];

export const mockDailyOutfits: Outfit[] = [
  { id:"o1", items:[mockClosetItems[0],mockClosetItems[2],mockClosetItems[8]], occasion:"work",         source:"ai-daily" },
  { id:"o2", items:[mockClosetItems[1],mockClosetItems[3],mockClosetItems[4]], occasion:"casual",       source:"ai-daily" },
  { id:"o3", items:[mockClosetItems[7],mockClosetItems[2],mockClosetItems[8]], occasion:"smart-casual", source:"ai-daily", includesShopItem:true },
];

export const mockSavedLooks: Outfit[] = [
  { id:"s1", name:"Weekend edit", items:[mockClosetItems[0],mockClosetItems[2],mockClosetItems[8]], occasion:"casual", source:"style-builder", savedAt:"2025-03-28", anchorItemId:"c9" },
  { id:"s2", name:"Office ready", items:[mockClosetItems[7],mockClosetItems[2],mockClosetItems[4]], occasion:"work",   source:"ai-daily",      savedAt:"2025-03-25" },
  { id:"s3", name:"Evening out",  items:[mockClosetItems[5],mockClosetItems[4]],                   occasion:"evening",source:"style-builder", savedAt:"2025-03-20", anchorItemId:"c6" },
];

export const mockShopItems: ShopItem[] = [
  { id:"sh1", name:"Slim Chinos",       brand:"Everlane",        price:89,  pairsWithCount:8,  fillsGap:false },
  { id:"sh2", name:"Cashmere Crewneck", brand:"Quince",          price:145, pairsWithCount:12, fillsGap:true  },
  { id:"sh3", name:"Low Sneakers",      brand:"Common Projects", price:410, pairsWithCount:10, fillsGap:true  },
  { id:"sh4", name:"Linen Shirt",       brand:"& Other Stories", price:75,  pairsWithCount:9,  fillsGap:false },
  { id:"sh5", name:"Wide-Leg Trousers", brand:"Arket",           price:115, pairsWithCount:7,  fillsGap:false },
  { id:"sh6", name:"Canvas Tote",       brand:"Baggu",           price:44,  pairsWithCount:14, fillsGap:true  },
  { id:"sh7", name:"Ribbed Turtleneck", brand:"COS",             price:69,  pairsWithCount:11, fillsGap:true  },
  { id:"sh8", name:"Derby Shoes",       brand:"Clarks",          price:130, pairsWithCount:9,  fillsGap:false },
];

export const mockWardrobeGaps = ["Light wash denim","Neutral knitwear","Versatile loafer"];
