import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export const stylistModel = genAI.getGenerativeModel({ 
  model: "gemini-1.5-flash",
  systemInstruction: "You are a high-end AI fashion stylist. Suggest outfits based on user prompts and uploaded images. Return your suggestions in a clear, structured format.",
}); 