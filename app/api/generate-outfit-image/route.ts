import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "GEMINI_API_KEY not configured" }, { status: 500 });
  }

  const { outfitName, items, occasion } = await req.json();

  const itemDescriptions = items
    .map((i: { name: string; color?: string; category: string; brand?: string }) =>
      `${i.color ? i.color + " " : ""}${i.name}${i.brand ? ` by ${i.brand}` : ""}`
    )
    .join(", ");

  const prompt = `You are a fashion editor writing for Vogue. Write an editorial description for this outfit.

OUTFIT NAME: ${outfitName}
OCCASION: ${occasion ?? "casual"}
PIECES: ${itemDescriptions}

Write the following in JSON format:
{
  "headline": "A short punchy editorial headline (5-8 words)",
  "editorial": "Two sentences describing how this outfit looks on a person, the vibe it gives off, and why it works for the occasion. Write in the style of a fashion magazine.",
  "stylistNote": "One sentence from the stylist on the key detail that makes this outfit work.",
  "mood": "One word describing the aesthetic mood (e.g. Understated, Electric, Refined, Raw, Effortless)",
  "season": "Best season for this outfit (e.g. Autumn/Winter, Spring/Summer, Year-round)"
}

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
    return NextResponse.json({ editorial: parsed });
  } catch (err) {
    console.error("Editorial generation error:", err);
    return NextResponse.json({ error: "Failed to generate editorial" }, { status: 500 });
  }
}