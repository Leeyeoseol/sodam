// Gemini API 연결
import { GoogleGenAI } from "@google/genai";

export default async function handler(req, res) {
  // POST 요청만 허용
  if (req.method !== "POST") {
    return res.status(405).json({ reply: "잘못된 요청입니다." });
  }

  try {
    const { prompt } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ reply: "API 키가 등록되지 않았습니다." });
    }

    if (!prompt) {
      return res.status(400).json({ reply: "질문이 없습니다." });
    }

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
    });

    res.status(200).json({
      reply: response.text || "답변을 생성하지 못했습니다.",
    });
  } catch (error) {
    console.error("Gemini 오류:", error);

    res.status(500).json({
      reply: "AI 응답을 가져오지 못했습니다.",
    });
  }
}
