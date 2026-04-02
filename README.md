# FORME — AI Personal Stylist

> Dress with confidence. FORME is an AI-powered personal styling platform that knows your wardrobe inside out — generating outfits for today's weather, building looks around your favourite pieces, and helping you shop smarter.

---

## Features

### Today
AI-generated daily outfit suggestions based on real-time weather and occasion. Like, dislike, or save looks directly to your wardrobe.

### My Closet
Your digital wardrobe. Add items by searching any product online or uploading a photo. Items persist across sessions.

### Style Builder
Pick any piece as your anchor — AI builds a complete outfit around it using your closet, suggests items to fill the gaps, and provides styling tips.

### Saved Looks
Every outfit you save lives here. Filter by source, remove looks, and send any outfit straight to the preview.

### Outfit Preview
See your saved looks in an editorial moodboard layout or toggle to a mannequin view with your outfit colours applied to each body zone.

### Shop
Discover fashion that matches your style. Filter by aesthetic (Minimalist, Streetwear, Classic, Casual, Formal), gender, and budget. Powered by real-time product search.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| AI | Google Gemini 2.5 Flash |
| Product Search | SerpAPI (Google Shopping) |
| Storage | localStorage (client-side) |

---

## Getting Started

### Prerequisites
- Node.js 18+
- A [Gemini API key](https://aistudio.google.com)
- A [SerpAPI key](https://serpapi.com)

### Installation
```bash
git clone https://github.com/YOUR_USERNAME/SHProject.git
cd SHProject
npm install
```

### Environment Variables

Create a `.env.local` file in the project root:
```
GEMINI_API_KEY=your_gemini_key_here
SERPAPI_KEY=your_serpapi_key_here
```

### Run
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Project Structure
```
SHProject/
├── app/
│   ├── page.tsx              # Today — AI daily outfits
│   ├── closet/               # My Closet
│   ├── builder/              # Style Builder
│   ├── saved/                # Saved Looks
│   ├── tryon/                # Outfit Preview
│   ├── shop/                 # Shop
│   └── api/
│       ├── today-outfits/    # Gemini outfit generation
│       ├── build-outfit/     # Gemini style builder
│       ├── search-products/  # SerpAPI closet search
│       └── shop-products/    # SerpAPI shop search
├── components/
│   ├── layout/               # Nav
│   ├── features/             # OutfitCard, ClosetItem, etc.
│   └── ui/                   # Pill, AiBadge
├── lib/
│   ├── closet-context.tsx    # Global closet state
│   ├── saved-looks-context.tsx # Global saved looks state
│   └── mock-data.ts          # Development data
└── types/
    └── index.ts              # Shared TypeScript types
```

---

## Team
Derek Kang, Rayyen Fateh

Built for SillyHacks · 2026


