import express from "express";
import path from "path";
import cors from "cors";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

// .env 파일 로드
dotenv.config();

const app = express();

// ES 모듈 환경에서는 __dirname이 기본 제공되지 않으므로 아래와 같이 정의해야 합니다.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 미들웨어 설정
app.use(cors());
app.use(express.json());

// 브라우저 접속 시 public 폴더의 index.html과 정적 파일(CSS/JS)을 불러오도록 설정
// server.js가 public/js 폴더에 있으므로, 상위 폴더인 public 폴더를 지정합니다.
app.use(express.static(path.join(__dirname, "..")));

// Gemini AI 초기화
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// AI 채팅 API 라우트
app.post("/api/chat", async (req, res) => {
  try {
    const {
      userMessage,
      currentMonth,
      records,
      categoryTotals,
      totalIncome,
      totalExpense,
      balance,
    } = req.body;

    const prompt = `
너는 친절하고 유능한 AI 가계부 소비 분석 상담사이다.

사용자가 자신의 지출에 대해 질문하면 제공된 지출 데이터를 바탕으로 답변해줘.

규칙:
- 반드시 제공된 지출 데이터만 사용해.
- 데이터에 없는 내용은 추측하지 마.
- 사용자가 이해하기 쉽게 한국어로 답변해.
- 금액을 계산할 수 있다면 정확하게 계산해.
- 소비 패턴에서 눈에 띄는 특징이 있다면 함께 알려줘.
- 답변은 너무 길지 않게 핵심적으로 해.

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
      model: "gemini-2.5-flash", // 사용 가능한 올바른 모델명으로 지정
      contents: prompt,
    });

    // SDK 버전에 따라 함수 호출 방식에 대응하도록 처리
    const replyText =
      typeof response.text === "function" ? response.text() : response.text;

    return res.json({ reply: replyText });
  } catch (err) {
    console.error("=== Gemini API 호출 에러 상세 ===");
    console.error(err);

    return res.status(500).json({
      reply: "AI 응답을 가져오지 못했습니다. 터미널 콘솔 로그를 확인해 주세요.",
    });
  }
});

// 서버 실행
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
