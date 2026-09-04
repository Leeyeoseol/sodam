import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

app.post("/api/chat", async (req, res) => {
    try {
        const {
            userMessage,
            currentMonth,
            records,
            categoryTotals,
            totalIncome,
            totalExpense,
            balance
        } = req.body;

        const prompt = `
너는 친절하고 유능한 AI 가계부 소비 분석 상담사이다.

[현재 가계부 데이터]
- 현재 월: ${currentMonth}
- 총 수입: ${totalIncome}원
- 총 지출: ${totalExpense}원
- 현재 잔액: ${balance}원
- 카테고리별 소비: ${JSON.stringify(categoryTotals)}
- 상세 소비 기록: ${JSON.stringify(records)}

사용자 질문: ${userMessage}
`;

        const response = await ai.models.generateContent({
            model: "gemini-3.6-flash",
            contents: prompt,
        });

        return res.json({ reply: response.text });

    } catch (err) {
        console.error("=== Gemini API 호출 에러 상세 ===");
        console.error(err);

        return res.status(500).json({
            reply: "AI 응답을 가져오지 못했습니다. 터미널 콘솔 로그를 확인해 주세요."
        });
    }
});

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});