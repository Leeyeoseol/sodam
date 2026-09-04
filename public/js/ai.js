async function sendAIQuestion() {
    const inputElement = document.getElementById('ai-user-input');
    const chatBox = document.getElementById('ai-chat-box');
    const message = inputElement.value.trim();

    if (!message) return;

    chatBox.innerHTML += `<p><strong>나:</strong> ${message}</p>`;
    inputElement.value = '';
    chatBox.scrollTop = chatBox.scrollHeight;

    chatBox.innerHTML += `<p id="ai-loading" style="color: gray;">AI가 가계부를 분석 중입니다...</p>`;

    const reply = await askAI(message);

    const loadingText = document.getElementById('ai-loading');
    if (loadingText) loadingText.remove();

    chatBox.innerHTML += `<p><strong>AI 헬퍼:</strong> ${reply}</p>`;
    chatBox.scrollTop = chatBox.scrollHeight;
}

async function askAI(question) {
    try {
        const today = new Date();

        // 'now'를 'today'로 수정
        const currentYearMonth = today.toISOString().slice(0, 7);
        const monthlyRecords = getRecordsOfMonth(
            records,
            today.getFullYear(),
            today.getMonth() + 1
        );
        const categoryTotals = calculateCategoryTotals(monthlyRecords);
        const totals = calculateTotals(monthlyRecords);

        // API 호출
        const response = await fetch("http://localhost:3000/api/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                userMessage: question,
                currentMonth: currentYearMonth,
                records: monthlyRecords,
                categoryTotals,
                totalIncome: totals.income,
                totalExpense: totals.expense,
                balance: totals.balance
            })
        });

        // 결과 반환
        const data = await response.json();
        return data.reply;

    } catch (error) {
        console.error("AI 질문 중 오류 발생:", error);
        return "오류가 발생하여 AI 답변을 가져오지 못했습니다.";
    }
}