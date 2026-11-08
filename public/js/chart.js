let doughnutChartInstance = null;
let barChartInstance = null;

const STAT_CATEGORIES = [
  { key: "food", label: "식비", color: "#e2828a" },
  { key: "shopping", label: "쇼핑", color: "#efb26b" },
  { key: "transport", label: "교통", color: "#93cb8c" },
  { key: "living", label: "생활", color: "#7ed0c4" },
  { key: "leisure", label: "문화·여가", color: "#8fb4e8" },
  { key: "fixed", label: "고정지출", color: "#b39ddb" },
  { key: "other", label: "기타", color: "#98989d" },
];

let CATEGORY_LABELS = [];
let CATEGORY_COLORS = [];

for (let i = 0; i < STAT_CATEGORIES.length; i++) {
  CATEGORY_LABELS.push(STAT_CATEGORIES[i].label);
  CATEGORY_COLORS.push(STAT_CATEGORIES[i].color);
}

// 금액 표시
function formatMoney(amount) {
  return Number(amount || 0).toLocaleString() + "원";
}

// 카테고리별 지출
function getCategoryExpenseData() {
  const monthRecords = getRecordsOfMonth(
    records,
    now.getFullYear(),
    now.getMonth() + 1,
  );

  let categories = {
    food: 0,
    shopping: 0,
    transport: 0,
    living: 0,
    leisure: 0,
    fixed: 0,
    other: 0,
  };

  for (let i = 0; i < monthRecords.length; i++) {
    let record = monthRecords[i];

    if (
      record.type === "expense" &&
      categories[record.category] !== undefined
    ) {
      categories[record.category] += Number(record.amount) || 0;
    }
  }

  let result = [];

  for (let i = 0; i < STAT_CATEGORIES.length; i++) {
    result.push(categories[STAT_CATEGORIES[i].key]);
  }

  return result;
}

// 도넛 차트
function createDoughnutChart() {
  const canvas = document.getElementById("doughnutChart");
  if (!canvas) return;

  const context = canvas.getContext("2d");
  const expenseData = getCategoryExpenseData();

  if (doughnutChartInstance) {
    doughnutChartInstance.destroy();
  }

  doughnutChartInstance = new Chart(context, {
    type: "doughnut",
    data: {
      labels: CATEGORY_LABELS,
      datasets: [
        {
          data: expenseData,
          backgroundColor: CATEGORY_COLORS,
          borderColor: "#ffffff",
          borderWidth: 3,
          hoverOffset: 5,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: "48%",
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              return " " + formatMoney(context.raw || 0);
            },
          },
        },
      },
    },
  });

  renderCategoryList(CATEGORY_LABELS, CATEGORY_COLORS, expenseData);
}

// 도넛 차트 옆 카테고리 목록
function renderCategoryList(labels, colors, dataArray) {
  const container = document.getElementById("statList");
  if (!container) return;

  container.innerHTML = "";

  let total = 0;

  for (let i = 0; i < dataArray.length; i++) {
    total += Number(dataArray[i]) || 0;
  }

  for (let i = 0; i < labels.length; i++) {
    let amount = Number(dataArray[i]) || 0;
    let percentage = 0;

    if (total > 0) {
      percentage = Math.round((amount / total) * 100);
    }

    const row = document.createElement("div");
    row.className = "stat-row";

    row.innerHTML = `
      <span class="stat-dot" style="background: ${colors[i]}"></span>
      <span class="stat-name">${labels[i]}</span>
      <span class="stat-pct">${percentage}%</span>
      <span class="stat-amount">${formatMoney(amount)}</span>
    `;

    container.appendChild(row);
  }
}

// 통계 요약
function renderStatisticsSummary() {
  const monthRecords = getRecordsOfMonth(
    records,
    now.getFullYear(),
    now.getMonth() + 1,
  );

  let income = 0;
  let expense = 0;

  for (let i = 0; i < monthRecords.length; i++) {
    let record = monthRecords[i];
    let amount = Number(record.amount) || 0;

    if (record.type === "income") {
      income += amount;
    } else {
      expense += amount;
    }
  }

  const balance = income - expense;

  const incomeElement = document.getElementById("statIncome");
  const expenseElement = document.getElementById("statExpense");
  const balanceElement = document.getElementById("statBalance");

  if (incomeElement) {
    incomeElement.textContent = formatMoney(income);
  }

  if (expenseElement) {
    expenseElement.textContent = formatMoney(expense);
  }

  if (balanceElement) {
    balanceElement.textContent = formatMoney(balance);

    balanceElement.classList.remove("positive", "negative");

    if (balance >= 0) {
      balanceElement.classList.add("positive");
    } else {
      balanceElement.classList.add("negative");
    }
  }
}

// 이번 달 분석
function renderAnalysisSummary() {
  const monthRecords = getRecordsOfMonth(
    records,
    now.getFullYear(),
    now.getMonth() + 1,
  );

  // 날짜별 지출 합계
  let dayTotals = {};

  for (let i = 0; i < monthRecords.length; i++) {
    let record = monthRecords[i];

    if (record.type !== "expense") continue;

    if (!dayTotals[record.date]) {
      dayTotals[record.date] = 0;
    }

    dayTotals[record.date] += Number(record.amount) || 0;
  }

  // 가장 많이 쓴 날
  let maxDate = null;
  let maxAmount = 0;
  let totalExpense = 0;
  let spentDayCount = 0;

  for (let date in dayTotals) {
    let amount = dayTotals[date];

    totalExpense += amount;
    spentDayCount++;

    if (amount > maxAmount) {
      maxAmount = amount;
      maxDate = date;
    }
  }

  let avgPerDay = 0;

  if (spentDayCount > 0) {
    avgPerDay = totalExpense / spentDayCount;
  }

  // 가장 많이 쓴 카테고리
  let categoryTotals = {};

  for (let i = 0; i < monthRecords.length; i++) {
    let record = monthRecords[i];

    if (record.type !== "expense") continue;

    if (!categoryTotals[record.category]) {
      categoryTotals[record.category] = 0;
    }

    categoryTotals[record.category] += Number(record.amount) || 0;
  }

  let maxCategory = null;
  let maxCategoryAmount = 0;

  for (let category in categoryTotals) {
    if (categoryTotals[category] > maxCategoryAmount) {
      maxCategoryAmount = categoryTotals[category];
      maxCategory = category;
    }
  }

  let categoryInfo = null;

  for (let i = 0; i < STAT_CATEGORIES.length; i++) {
    if (STAT_CATEGORIES[i].key === maxCategory) {
      categoryInfo = STAT_CATEGORIES[i];
      break;
    }
  }

  // 화면에 표시
  const text1 = document.getElementById("analysisText");
  const text2 = document.getElementById("analysisText2");
  const text3 = document.getElementById("analysisText3");

  if (text1) {
    if (maxDate) {
      text1.textContent = `이번달 가장 많이 지출한 날은 ${maxDate.slice(8, 10)}일, ${formatMoney(maxAmount)} 썼어요`;
    } else {
      text1.textContent = "이번달 지출 기록이 없어요";
    }
  }

  if (text2) {
    text2.textContent = `이번달 하루 평균 ${formatMoney(Math.round(avgPerDay))} 썼어요`;
  }

  if (text3) {
    if (categoryInfo) {
      text3.textContent = `이번 달은 ${categoryInfo.label}에 가장 많이 썼어요 (${formatMoney(maxCategoryAmount)})`;
    } else {
      text3.textContent = "이번달 지출 기록이 없어요";
    }
  }
}

// 기간 계산
function getMonthList(period) {
  const result = [];
  const endDate = new Date(now.getFullYear(), now.getMonth(), 1);

  if (period === "1y") {
    for (let month = 0; month <= endDate.getMonth(); month++) {
      result.push({
        year: endDate.getFullYear(),
        month: month,
      });
    }
  } else {
    for (let i = 5; i >= 0; i--) {
      const date = new Date(endDate.getFullYear(), endDate.getMonth() - i, 1);

      result.push({
        year: date.getFullYear(),
        month: date.getMonth(),
      });
    }
  }

  return result;
}

// 월별 수입 / 지출
function getMonthlyTotals(period) {
  const months = getMonthList(period);
  let result = [];

  for (let i = 0; i < months.length; i++) {
    let item = months[i];

    const monthRecords = getRecordsOfMonth(records, item.year, item.month + 1);

    let income = 0;
    let expense = 0;

    for (let j = 0; j < monthRecords.length; j++) {
      let record = monthRecords[j];
      let amount = Number(record.amount) || 0;

      if (record.type === "income") {
        income += amount;
      } else {
        expense += amount;
      }
    }

    result.push({
      year: item.year,
      month: item.month,
      income: income,
      expense: expense,
    });
  }

  return result;
}

// 월별 카테고리 지출
function getMonthlyCategoryTotals(period, category) {
  const months = getMonthList(period);
  let result = [];

  for (let i = 0; i < months.length; i++) {
    let item = months[i];

    const monthRecords = getRecordsOfMonth(records, item.year, item.month + 1);

    let total = 0;

    for (let j = 0; j < monthRecords.length; j++) {
      let record = monthRecords[j];

      if (record.type === "expense" && record.category === category) {
        total += Number(record.amount) || 0;
      }
    }

    result.push(total);
  }

  return result;
}

// 월 이름
function getMonthLabels(period) {
  const months = getMonthList(period);
  let labels = [];

  for (let i = 0; i < months.length; i++) {
    labels.push(months[i].month + 1 + "월");
  }

  return labels;
}

// 월별 소비 그래프
function createBarChart() {
  const canvas = document.getElementById("barChart");
  if (!canvas) return;

  const context = canvas.getContext("2d");

  const activePeriodButton = document.querySelector(".period-btn.active");
  const period = activePeriodButton?.dataset.period || "6m";

  const activeCategoryChip = document.querySelector(
    "#barCategoryFilter .filter-chip.active",
  );

  const category = activeCategoryChip?.dataset.cat || "all";

  if (barChartInstance) {
    barChartInstance.destroy();
  }

  const labels = getMonthLabels(period);

  // 전체 수입 / 지출
  if (category === "all") {
    const monthlyData = getMonthlyTotals(period);

    let incomeData = [];
    let expenseData = [];

    for (let i = 0; i < monthlyData.length; i++) {
      incomeData.push(monthlyData[i].income);
      expenseData.push(monthlyData[i].expense);
    }

    barChartInstance = new Chart(context, {
      type: "bar",
      data: {
        labels: labels,
        datasets: [
          {
            label: "수입",
            data: incomeData,
            backgroundColor: "#0071e3",
            borderRadius: 5,
            barPercentage: 0.65,
            categoryPercentage: 0.7,
          },
          {
            label: "지출",
            data: expenseData,
            backgroundColor: "#d7263d",
            borderRadius: 5,
            barPercentage: 0.65,
            categoryPercentage: 0.7,
          },
        ],
      },
      options: getBarChartOptions(),
    });
  }

  // 카테고리별 지출
  else {
    const categoryData = getMonthlyCategoryTotals(period, category);

    let categoryInfo = null;

    for (let i = 0; i < STAT_CATEGORIES.length; i++) {
      if (STAT_CATEGORIES[i].key === category) {
        categoryInfo = STAT_CATEGORIES[i];
        break;
      }
    }

    let color = "#0071e3";
    let label = "지출";

    if (categoryInfo) {
      color = categoryInfo.color;
      label = categoryInfo.label;
    }

    barChartInstance = new Chart(context, {
      type: "line",
      data: {
        labels: labels,
        datasets: [
          {
            label: label,
            data: categoryData,
            borderColor: color,
            backgroundColor: color,
            borderWidth: 3,
            pointRadius: 4,
            pointHoverRadius: 6,
            tension: 0.35,
            fill: false,
          },
        ],
      },
      options: getLineChartOptions(),
    });
  }
}

// 막대 그래프 설정
function getBarChartOptions() {
  return {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: "index",
      intersect: false,
    },
    plugins: {
      legend: {
        display: true,
        position: "top",
        align: "end",
        labels: {
          usePointStyle: true,
          pointStyle: "circle",
          boxWidth: 8,
          padding: 15,
          font: {
            size: 11,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return (
              " " + context.dataset.label + ": " + formatMoney(context.raw)
            );
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 11,
          },
          color: "#6e6e73",
        },
      },
      y: {
        beginAtZero: true,
        border: {
          display: false,
        },
        grid: {
          color: "#eeeeee",
        },
        ticks: {
          font: {
            size: 10,
          },
          color: "#98989d",
          callback: function (value) {
            if (value >= 10000) {
              return value / 10000 + "만";
            }

            return value;
          },
        },
      },
    },
  };
}

// 선 그래프 설정
function getLineChartOptions() {
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return " " + formatMoney(context.raw);
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 11,
          },
          color: "#6e6e73",
        },
      },
      y: {
        beginAtZero: true,
        border: {
          display: false,
        },
        grid: {
          color: "#eeeeee",
        },
        ticks: {
          font: {
            size: 10,
          },
          color: "#98989d",
          callback: function (value) {
            if (value >= 10000) {
              return value / 10000 + "만";
            }

            return value;
          },
        },
      },
    },
  };
}

// 이번 달 날짜 수
function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

// 날짜별 지출 계산
function getMonthDailyExpense() {
  const year = now.getFullYear();
  const month = now.getMonth();
  const daysInMonth = getDaysInMonth(year, month);

  let dailyTotals = [];

  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr =
      year +
      "-" +
      String(month + 1).padStart(2, "0") +
      "-" +
      String(day).padStart(2, "0");

    let total = 0;

    for (let i = 0; i < records.length; i++) {
      let record = records[i];

      if (record.type === "expense" && record.date === dateStr) {
        total += Number(record.amount) || 0;
      }
    }

    dailyTotals.push({
      day: day,
      amount: total,
    });
  }

  return dailyTotals;
}

// 히트맵 색상
function getHeatColor(amount, maxAmount) {
  if (amount === 0) return "var(--bg)";

  const ratio = amount / maxAmount;

  if (ratio > 0.75) return "#d7263d";
  if (ratio > 0.5) return "#e2828a";
  if (ratio > 0.25) return "#f3b7bc";

  return "#fbe1e3";
}

// 히트맵 만들기
function createHeatmap() {
  const container = document.getElementById("heatmapGrid");
  if (!container) return;

  container.innerHTML = "";

  const year = now.getFullYear();
  const month = now.getMonth();
  const firstDay = new Date(year, month, 1).getDay();

  const dailyTotals = getMonthDailyExpense();

  let maxAmount = 1;

  for (let i = 0; i < dailyTotals.length; i++) {
    if (dailyTotals[i].amount > maxAmount) {
      maxAmount = dailyTotals[i].amount;
    }
  }

  // 1일 앞의 빈 칸
  for (let i = 0; i < firstDay; i++) {
    const emptyCell = document.createElement("div");
    emptyCell.className = "heatmap-cell empty";
    container.appendChild(emptyCell);
  }

  // 날짜별 칸 만들기
  for (let i = 0; i < dailyTotals.length; i++) {
    let item = dailyTotals[i];

    const cell = document.createElement("div");
    cell.className = "heatmap-cell";
    cell.style.background = getHeatColor(item.amount, maxAmount);
    cell.textContent = item.day;
    cell.title = formatMoney(item.amount);

    container.appendChild(cell);
  }
}

// 그래프 버튼 설정
function setupChartControls() {
  // 최근 6개월 / 올해
  document.querySelectorAll(".period-btn").forEach(function (button) {
    button.addEventListener("click", function () {
      document.querySelectorAll(".period-btn").forEach(function (btn) {
        btn.classList.remove("active");
      });

      this.classList.add("active");
      createBarChart();
    });
  });

  // 카테고리 선택
  document
    .querySelectorAll("#barCategoryFilter .filter-chip")
    .forEach(function (chip) {
      chip.addEventListener("click", function () {
        document
          .querySelectorAll("#barCategoryFilter .filter-chip")
          .forEach(function (item) {
            item.classList.remove("active");
          });

        this.classList.add("active");
        createBarChart();
      });
    });
}

// 통계 새로고침
function refreshStatistics() {
  renderStatisticsSummary();
  renderAnalysisSummary();
  createDoughnutChart();
  createBarChart();
  createHeatmap();
}

// 처음 실행
document.addEventListener("DOMContentLoaded", function () {
  setupChartControls();
  refreshStatistics();

  let lastMonth = now.getMonth();

  setInterval(function () {
    if (now.getMonth() !== lastMonth) {
      lastMonth = now.getMonth();
      refreshStatistics();
    }
  }, 1000);
});
