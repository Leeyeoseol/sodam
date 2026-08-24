// 사용자가 '질문하기' 버튼을 누르면 실행되는 함수
async function sendAIQuestion() {
    const inputElement = document.getElementById('ai-user-input');
    const chatBox = document.getElementById('ai-chat-box');
    const message = inputElement.value.trim();

    if (!message) return;

    // 화면에 내 질문 표시하기
    chatBox.innerHTML += `<p><strong>나:</strong> ${message}</p>`;
    inputElement.value = '';
    chatBox.scrollTop = chatBox.scrollHeight;

    // 로딩 표시
    chatBox.innerHTML += `<p id="ai-loading" style="color: gray;">🤖 AI가 가계부를 분석 중입니다...</p>`;

    // 원래 작성하려던 askAI 함수를 호출하여 답변을 받아옵니다.
    const reply = await askAI(message);

    // 로딩 표시 제거
    const loadingText = document.getElementById('ai-loading');
    if (loadingText) loadingText.remove();

    // 화면에 AI 답변 표시하기
    chatBox.innerHTML += `<p><strong>AI 헬퍼:</strong> ${reply}</p>`;
    chatBox.scrollTop = chatBox.scrollHeight;
}

// ----------------------------------------------------
// ★ 원하셨던 askAI 함수 구조 그대로 구현한 부분입니다!
// ----------------------------------------------------
async function askAI(question) {
    try {
        // TODO 1: 질문에 답하는 데 필요한 실제 데이터 계산하기
        // (기존에 만드신 가계부 함수들을 활용해 이번 달 기록과 카테고리별 합계를 냅니다)
        const currentYearMonth = currentMonth.toISOString().slice(0, 7); // 예: "2026-08"
        const monthlyRecords = getRecordsOfMonth(currentYearMonth);
        const categoryTotals = calculateCategoryTotals(monthlyRecords);

        // TODO 2: 계산된 데이터를 문자열로 요약하기
        // 예: "식비: 40000원, 쇼핑: 15000원..." 처럼 문자열로 변환합니다.
        let dataSummary = Object.entries(categoryTotals)
            .map(([category, amount]) => `${category}: ${amount}원`)
            .join(', ');

        if (!dataSummary) dataSummary = "이번 달 기록된 가계부 데이터가 없습니다.";

        // TODO 3: fetch로 OpenAI API 호출하기 (★API 키 숨기기 핵심 수정지점)
        // 원래 가이드(https://api.openai.com...) 대신 '내가 만든 안전한 서버 주소'로 바꿉니다.
        // 이렇게 하면 프론트엔드 코드(AI.js)에는 그 어디에도 API_KEY가 적히지 않으므로 안전합니다!
        const response = await fetch("/api/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
                // ⚠ "Authorization": "Bearer " + API_KEY 코드가 필요 없어집니다!
            },
            body: JSON.stringify({
                userMessage: question,  // 사용자의 질문
                ledgerData: dataSummary  // TODO 2에서 계산한 가계부 데이터 요약본
            })
        });

        // TODO 4: response.json()으로 답변 꺼내서 반환하기
        const data = await response.json();
        return data.reply;

    } catch (error) {
        console.error("AI 질문 중 오류 발생:", error);
        return "오류가 발생하여 AI 답변을 가져오지 못했습니다.";
    }
}
