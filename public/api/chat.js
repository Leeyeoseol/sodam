import { GoogleGenAI } from "@google/genai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { prompt } = req.body;

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const text =
      typeof response.text === "function" ? response.text() : response.text;

    res.status(200).json({ reply: text });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      reply: "AI 응답을 가져오지 못했습니다.",
    });
  }
}
