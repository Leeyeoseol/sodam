const express = require('express');
const { OpenAI } = require('openai');
require('dotenv').config(); // .env 파일 안의 비밀키를 읽어옵니다.

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// ⚠️ 중요: 현재 작성하신 css, js, html 파일들이 있는 폴더명에 맞게 컴퓨터에게 알려주는 설정입니다.
// 만약 html 파일이 폴더 바깥에 따로 있다면 이 라인은 지워도 됩니다.
app.use(express.static('public'));

// OpenAI 초기화 (환경변수의 OPENAI_API_KEY를 자동으로 가져옴)
const openai = new OpenAI();

// 웹페이지(main.js 등)에서 챗봇에게 질문을 보낼 때 주소창 역할을 할 통로입니다.
// server.js 내부의 app.post 부분을 아래와 같이 수정하세요
app.post('/api/chat', async (req, res) => {
    try {
        // AI.js가 보낸 질문(userMessage)과 가계부 요약 데이터(ledgerData)를 받습니다.
        const { userMessage, ledgerData } = req.body;

        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: "너는 사용자의 가계부 데이터를 분석해서 질문에 답변해주는 친절한 금융 전문가야. 주어진 실제 데이터에 기반해서만 답변해줘."
                },
                {
                    role: "user",
                    content: `사용자 질문: ${userMessage} \n[실제 가계부 데이터]: ${ledgerData}`
                }
            ],
        });

        res.json({ reply: response.choices.message.content });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "서버 오류가 발생했습니다." });
    }
});


app.listen(port, () => {
    console.log(`서버가 켜졌습니다! http://localhost:${port} 에서 확인하세요.`);
});
