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

async function askAI(question) {
    try {
        const currentYearMonth = currentMonth.toISOString().slice(0, 7);
        const monthlyRecords = getRecordsOfMonth(currentYearMonth);
        const categoryTotals = calculateCategoryTotals(monthlyRecords);

        // 문자열로 요약하기
        let dataSummary = Object.entries(categoryTotals)
            .map(([category, amount]) => `${category}: ${amount}원`)
            .join(', ');

        if (!dataSummary) dataSummary = "이번 달 기록된 가계부 데이터가 없습니다.";

        //호출
        const response = await fetch("/api/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                userMessage: question,  //질문
                ledgerData: dataSummary  //가계부 데이터
            })
        });

        //반환하기
        const data = await response.json();
        return data.reply;

    } catch (error) {
        console.error("AI 질문 중 오류 발생:", error);
        return "오류가 발생하여 AI 답변을 가져오지 못했습니다.";
    }
}
