import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export interface SuggestedItem {
  name: string;
  why: string;
  searchQuery: string;
}

export interface BuildOutfitResponse {
  closetItemIds: string[];
  suggestedItems: SuggestedItem[];
  stylingTips: string[];
  outfitDescription: string;
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "GEMINI_API_KEY not configured" }, { status: 500 });
  }

  const { anchorItem, customAnchor, closetItems, occasion } = await req.json();

  const anchorDescription = anchorItem
    ? `${anchorItem.name}${anchorItem.color ? ` in ${anchorItem.color}` : ""}${anchorItem.brand ? ` by ${anchorItem.brand}` : ""} (category: ${anchorItem.category})`
    : customAnchor;

  const closetList = closetItems && closetItems.length > 0
    ? closetItems.map((item: { id: string; name: string; color?: string; category: string; brand?: string }) =>
        `- ID: ${item.id} | ${item.name}${item.color ? ` (${item.color})` : ""} | ${item.category}${item.brand ? ` | ${item.brand}` : ""}`
      ).join("\n")
    : "No items in closet yet.";

  const prompt = `You are an expert personal stylist. A user wants to build an outfit around their anchor piece.

ANCHOR PIECE: ${anchorDescription}
OCCASION: ${occasion ?? "casual"}

THEIR CLOSET:
${closetList}

Your task:
1. Select 2-3 items from their closet that pair best with the anchor piece for the occasion. Only select items that genuinely work well together.
2. Suggest 1-2 additional items they could buy to complete or elevate the look (these are NOT in their closet).
3. Provide 3 concise, specific styling tips for wearing this outfit.
4. Write a short outfit description (1-2 sentences).

Respond ONLY with valid JSON in this exact format:
{
  "closetItemIds": ["id1", "id2"],
  "suggestedItems": [
    {
      "name": "Item name",
      "why": "One sentence on why this completes the look",
      "searchQuery": "search query to find this item online"
    }
  ],
  "stylingTips": [
    "Tip 1",
    "Tip 2",
    "Tip 3"
  ],
  "outfitDescription": "Short description of the overall look and vibe."
}

If the closet is empty or has no matching items, return empty closetItemIds and focus on suggested items.
Return ONLY the JSON object, no other text.`;

  try {
    const genAI  = new GoogleGenerativeAI(apiKey);
    const model  = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);
    const text   = result.response.text().trim();

    const cleaned = text
      .replace(/^```json\n?/, "")
      .replace(/^```\n?/, "")
      .replace(/\n?```$/, "")
      .trim();

    const parsed: BuildOutfitResponse = JSON.parse(cleaned);
    return NextResponse.json(parsed);
  } catch (err) {
    console.error("Gemini error:", err);
    return NextResponse.json({ error: "Failed to generate outfit" }, { status: 500 });
  }
}