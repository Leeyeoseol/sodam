//ai

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-3-flash-preview";

export async function sendAIQuestion(question, expenses = []) {
  //우선 사용자의 질문 추가
  let quest = document.createElement("li");
  quest.setAttribute("id", question);
  const textNode = document.createTextNode(question);
  quest.appendChild(textNode);
  document.getElementById("id").appendChild(quest);

  //   pulsUI.innerHTML = "<li>" + question + "</li>";
  //   document.getElementById("list").appendChild(plusUl);

  if (!GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY가 설정되지 않았습니다.");
  }

  if (!question || !question.trim()) {
    throw new Error("질문을 입력해주세요.");
  }

  const expenseData = JSON.stringify(expenses, null, 2);

  const prompt = `
너는 가계부 서비스 '모담'의 소비 분석 AI야.

사용자가 자신의 지출에 대해 질문하면 제공된 지출 데이터를 바탕으로 답변해줘.

    규칙:
- 반드시 제공된 지출 데이터만 사용해.
- 데이터에 없는 내용은 추측하지 마.
- 사용자가 이해하기 쉽게 한국어로 답변해.
- 금액을 계산할 수 있다면 정확하게 계산해.
- 소비 패턴에서 눈에 띄는 특징이 있다면 함께 알려줘.
- 답변은 너무 길지 않게 핵심적으로 해.

사용자 질문:
${question}

지출 데이터:
${expenseData}
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
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
      }),
    },
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API 오류: ${errorText}`);
  }

  const data = await response.json();

  const answer = data?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!answer) {
    throw new Error("Gemini에서 답변을 받지 못했습니다.");
  }

  return answer;
}

//ul.리스트로 하여서 내가 클릭하면 사용자의 q질문이 들어가면 동시에 ai한테도 물어봐지게끔.
