import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export interface TodayOutfit {
  id: string;
  name: string;
  occasion: string;
  description: string;
  stylingNote: string;
  closetItemIds: string[];
  suggestedItems: { name: string; searchQuery: string }[];
}

async function fetchWeather(location: string) {
  try {
    const res = await fetch(
      `https://wttr.in/${encodeURIComponent(location)}?format=j1`,
      { next: { revalidate: 1800 } }
    );
    const data = await res.json();
    const current = data.current_condition?.[0];
    return {
      temp: current?.temp_C ?? "15",
      condition: current?.weatherDesc?.[0]?.value ?? "Clear",
      location,
    };
  } catch {
    return { temp: "15", condition: "Clear", location };
  }
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "GEMINI_API_KEY not configured" }, { status: 500 });
  }

  const { closetItems, location = "Vancouver" } = await req.json();
  const weather = await fetchWeather(location);

  const closetList = closetItems && closetItems.length > 0
    ? closetItems.map((item: { id: string; name: string; color?: string; category: string; brand?: string }) =>
        `- ID: ${item.id} | ${item.name}${item.color ? ` (${item.color})` : ""} | ${item.category}${item.brand ? ` | ${item.brand}` : ""}`
      ).join("\n")
    : "No items in closet yet.";

  const prompt = `You are an expert personal stylist. Generate 3 outfit suggestions for today.

WEATHER: ${weather.temp}°C, ${weather.condition} in ${weather.location}
DATE: ${new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}

USER'S CLOSET:
${closetList}

Generate 3 outfits for different occasions that suit today's weather. Consider temperature and conditions when suggesting layers, fabrics, etc.

Respond ONLY with valid JSON in this exact format:
{
  "outfits": [
    {
      "id": "outfit_1",
      "name": "Short catchy outfit name",
      "occasion": "casual",
      "description": "One sentence describing the overall look and why it works for today's weather.",
      "stylingNote": "One specific styling tip for this outfit.",
      "closetItemIds": ["id1", "id2"],
      "suggestedItems": [
        { "name": "Item name", "searchQuery": "search query" }
      ]
    }
  ]
}

Use occasions from: casual, work, evening, smart-casual, date, brunch.
Make 3 outfits with different occasions.
If closet is empty, use empty closetItemIds and suggest items to buy instead.
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

    const parsed = JSON.parse(cleaned);
    return NextResponse.json({ outfits: parsed.outfits, weather });
  } catch (err) {
    console.error("Today outfits error:", err);
    return NextResponse.json({ error: "Failed to generate outfits" }, { status: 500 });
  }
}