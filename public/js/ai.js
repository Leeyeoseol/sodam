//ai
const GEMINI_API_KEY = "";
const GEMINI_MODEL = "gemini-3-flash-preview";

// 로컬스토리지에서 실제 가계부 기록 가져오기
function getExpenses() {
  try {
    return JSON.parse(localStorage.getItem("sodam-records")) || [];
  } catch (error) {
    console.error("가계부 기록을 불러오지 못했습니다.", error);
    return [];
  }
}

// AI 질문 전송
export async function sendAIQuestion(question) {
  const input = document.getElementById("ai-user-input");
  const chatBox = document.getElementById("ai-chat-box");
  if (!input || !chatBox) {
    console.error("AI 화면의 HTML 요소를 찾을 수 없습니다.");
    return;
  }

  // 질문 가져오기
  if (question === undefined) {
    question = input.value;
  }

  question = question.trim();

  if (!question) {
    alert("질문을 입력해주세요.");
    return;
  }

  input.value = "";

  // 질문 목록에 추가

  //채팅창 추가
  const quest = document.createElement("div");
  quest.className = "message user";
  quest.textContent = question;
  chatBox.appendChild(quest);

  // 로딩 표시
  const loading = document.createElement("div");
  loading.className = "message ai";
  loading.textContent = "답변을 생성하고 있습니다...";
  chatBox.appendChild(loading);

  try {
    if (!GEMINI_API_KEY || GEMINI_API_KEY === "여기에_Gemini_API_키") {
      throw new Error("ai.js에 Gemini API 키를 설정해주세요.");
    }

    // 최신 로컬스토리지 기록 읽기
    const expenses = getExpenses();

    const prompt = `
너는 가계부 서비스 '모담'의 소비 분석 AI야.

사용자의 질문에 제공된 가계부 기록만을 바탕으로 답변해.

규칙:
- 반드시 제공된 가계부 데이터만 사용해.
- 질문의 의도에 맞는 정보만 답변해.
- 사용자가 전체 분석을 요청하지 않았다면 전체 요약을 출력하지 마.
- "?"처럼 의미를 파악할 수 없는 질문에는
  "어떤 소비 내역이 궁금하신가요? 예: 이번 달 최다 지출 항목"
  이라고 안내해.
- 질문과 관련된 기록만 참고해.
- 마크다운 기호(#, **, *)를 사용하지 마.
- 답변은 한국어로 1~5문장 이내로 작성해.

가계부 기록:
${JSON.stringify(expenses, null, 2)}

사용자 질문:
${question}
`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": GEMINI_API_KEY,
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Gemini API 오류:", data);

      if (response.status === 429) {
        throw new Error("AI 이용량이 초과됐어요. 나중에 다시 이용해 주세요.");
      }

      throw new Error("AI 답변을 가져오지 못했어요.");
    }

    const answer = data.candidates?.[0]?.content?.parts
      ?.map((part) => part.text || "")
      .join("");

    if (!answer) {
      throw new Error("AI 답변을 받지 못했어요. 다시 시도해 주세요.");
    }

    const answerElement = document.createElement("div");
    answerElement.className = "message ai";
    answerElement.textContent = answer;
    chatBox.appendChild(answerElement);
  } catch (error) {
    console.error("AI 질문 오류:", error);

    const errorElement = document.createElement("div");
    errorElement.className = "message ai";

    errorElement.textContent = error.message.includes("이용량")
      ? error.message
      : "오류가 발생했어요. 잠시 후 다시 시도해 주세요.";

    chatBox.appendChild(errorElement);
  } finally {
    loading.remove();
  }
}

// 전송 버튼 및 Enter 키 연결
const input = document.getElementById("ai-user-input");
const sendButton = document.getElementById("ai-send-btn");

if (input) {
  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      sendAIQuestion();
    }
  });
}

// HTML onclick에서도 호출할 수 있도록 연결
window.sendAIQuestion = sendAIQuestion;
