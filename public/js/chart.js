// 글로벌 차트 인스턴스 변수
let doughnutChartInstance = null;
let barChartInstance = null;

// 카테고리별 지출 합계 계산 함수
function getCategoryExpenseData() {
    const monthRecords = getRecordsOfMonth(records, now.getFullYear(), now.getMonth() + 1);

    // 카테고리 초기화
    const categories = {
        food: 0,      // 식비
        shopping: 0,  // 쇼핑
        transport: 0, // 교통
        living: 0,    // 생활
        leisure: 0,   // 문화·여가
        fixed: 0,     // 고정지출
        other: 0      // 기타
    };

    // 이번 달 지출만 카테고리별 합계
    monthRecords.forEach(record => {
        if (record.type === "expense" && categories.hasOwnProperty(record.category)) {
            categories[record.category] += Number(record.amount) || 0;
        }
    });

    // 배열로 반환
    return [
        categories.food,
        categories.shopping,
        categories.transport,
        categories.living,
        categories.leisure,
        categories.fixed,
        categories.other
    ];
}

//도넛 차트 생성
function createDoughnutChart() {
    const canvas = document.getElementById('doughnutChart');
    if (!canvas) return;

    const context = canvas.getContext('2d');
    const expenseData = getCategoryExpenseData();
    const labels = ['식비', '쇼핑', '교통', '생활', '문화·여가', '고정지출', '기타'];
    const colors = ['#e2828a', '#efb26b', '#93cb8c', '#7ed0c4', '#8fb4e8', '#b39ddb', '#98989d'];

    if (doughnutChartInstance) {
        doughnutChartInstance.destroy();
    }

    doughnutChartInstance = new Chart(context, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                label: '지출 금액',
                data: expenseData,
                backgroundColor: colors,
                borderColor: '#fff',
                borderWidth: 1,
                hoverOffset: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            }
        }
    });

    renderCategoryList(labels, colors, expenseData);  // 추가
}

// 카테고리 리스트 만들기 (도넛 옆)
function renderCategoryList(labels, colors, dataArray) {
    const container = document.getElementById("statList");
    if (!container) return;
    container.innerHTML = "";

    const total = dataArray.reduce((sum, val) => sum + val, 0);

    labels.forEach(function (label, i) {
        const amount = dataArray[i];
        const pct = total > 0 ? Math.round((amount / total) * 100) : 0;

        const row = document.createElement("div");
        row.className = "stat-row";

        row.innerHTML = `
      <span class="stat-dot" style="background: ${colors[i]};"></span>
      <span class="stat-name">${label}</span>
      <span class="stat-pct">${pct}%</span>
      <span class="stat-amount">${amount.toLocaleString()}원</span>
    `;

        container.appendChild(row);
    });
}

//막대 차트 생성
function createBarChart() {
    const canvas = document.getElementById('barChart');
    if (!canvas) return;

    const context = canvas.getContext('2d');
    const expenseData = getCategoryExpenseData();

    if (barChartInstance) {
        barChartInstance.destroy();
    }

    barChartInstance = new Chart(context, {
        type: 'bar',
        data: {
            labels: ['식비', '쇼핑', '교통', '생활', '문화·여가', '고정지출', '기타'],
            datasets: [{
                label: '지출 금액',
                data: expenseData,
                borderWidth: 1,
                backgroundColor: ['#e2828a', '#efb26b', '#93cb8c', '#7ed0c4', '#8fb4e8', '#b39ddb', '#98989d'],
                borderColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// 초기
document.addEventListener("DOMContentLoaded", function () {
    createDoughnutChart();
    createBarChart();
});