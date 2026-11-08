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
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
      }),
    });

    const result = await response.text();
    let data = {};

    try {
      data = JSON.parse(result);
    } catch (error) {
      throw new Error("서버 응답 오류: " + result.slice(0, 200));
    }

    if (!response.ok) {
      throw new Error(data.reply || "AI 오류");
    }

    const answer = data.reply;

    if (!answer) {
      throw new Error("AI 답변을 받지 못했습니다.");
    }

    if (!response.ok) {
      throw new Error(data.reply || "AI 오류");
    }

    const answerElement = document.createElement("div");
    answerElement.className = "message ai";
    answerElement.textContent = answer;
    chatBox.appendChild(answerElement);
  } catch (error) {
    console.error("AI 질문 오류:", error);

    const errorElement = document.createElement("div");
    errorElement.className = "message ai";

    errorElement.textContent = error.message;
    ppendChild(errorElement);
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
