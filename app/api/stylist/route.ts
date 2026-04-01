import { NextResponse } from 'next/server';
import { stylistModel } from '@/lib/gemini';

// This function handles "POST" requests (when the frontend sends data)
export async function POST(req: Request) {
  try {
    // 1. Extract the "prompt" from the incoming JSON body
    const { prompt } = await req.json();

    // 2. Safety check: If there's no prompt, tell the user
    if (!prompt) {
      return NextResponse.json({ error: "No style prompt provided" }, { status: 400 });
    }

    // 3. Send the prompt to the Gemini model we defined in /lib/gemini.ts
    // In C++, this would be like calling a method on a class instance
    const result = await stylistModel.generateContent(prompt);
    
    // 4. Wait for the AI to finish "thinking" and get the text
    const response = await result.response;
    const text = response.text();

    // 5. Send the AI's advice back to your website frontend
    return NextResponse.json({ text });

  } catch (error) {
    // If the API key is wrong or the internet cuts out, this catches the "crash"
    console.error("Gemini API Error:"   , error);
    return NextResponse.json(
      { error: "The stylist is busy. Please try again later." }, 
      { status: 500 }
    );
  }
}