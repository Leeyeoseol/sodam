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

const CATEGORY_LABELS = STAT_CATEGORIES.map((category) => category.label);
const CATEGORY_COLORS = STAT_CATEGORIES.map((category) => category.color);

// 금액 표시
function formatMoney(amount) {
  return Number(amount || 0).toLocaleString() + "원";
}

//그 달의 카테고리 지출

function getCategoryExpenseData() {
  const monthRecords = getRecordsOfMonth(
    records,
    now.getFullYear(),
    now.getMonth() + 1,
  );

  const categories = {
    food: 0,
    shopping: 0,
    transport: 0,
    living: 0,
    leisure: 0,
    fixed: 0,
    other: 0,
  };

  monthRecords.forEach((record) => {
    if (
      record.type === "expense" &&
      Object.prototype.hasOwnProperty.call(categories, record.category)
    ) {
      categories[record.category] += Number(record.amount) || 0;
    }
  });

  return STAT_CATEGORIES.map((category) => categories[category.key]);
}

//도넛 차트

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
      cutout: "48%", //도넛 두께

      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              const value = context.raw || 0;
              return " " + formatMoney(value);
            },
          },
        },
      },
    },
  });
  renderCategoryList(CATEGORY_LABELS, CATEGORY_COLORS, expenseData);
}

// 도넛 차트 오른 카테고리 목록

function renderCategoryList(labels, colors, dataArray) {
  const container = document.getElementById("statList");
  if (!container) return;
  container.innerHTML = "";
  const total = dataArray.reduce((sum, value) => sum + Number(value || 0), 0);

  labels.forEach((label, index) => {
    const amount = Number(dataArray[index] || 0);
    const percentage = total > 0 ? Math.round((amount / total) * 100) : 0;

    const row = document.createElement("div");
    row.className = "stat-row";

    row.innerHTML = `
            <span
                class="stat-dot"
                style="background: ${colors[index]}"
            ></span>

            <span class="stat-name">
                ${label}
            </span>

            <span class="stat-pct">
                ${percentage}%
            </span>

            <span class="stat-amount">
                ${formatMoney(amount)}
            </span>
        `;
    container.appendChild(row);
  });
}

//통계 요약

function renderStatisticsSummary() {
  const monthRecords = getRecordsOfMonth(
    records,
    now.getFullYear(),
    now.getMonth() + 1,
  );

  let income = 0;
  let expense = 0;
  monthRecords.forEach((record) => {
    const amount = Number(record.amount) || 0;
    if (record.type === "income") {
      income += amount;
    } else {
      expense += amount;
    }
  });

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

// 이번 달 분석 문장 (가장 많이 쓴 날 / 하루 평균 / 가장 많이 쓴 카테고리)

function renderAnalysisSummary() {
  const monthRecords = getRecordsOfMonth(
    records,
    now.getFullYear(),
    now.getMonth() + 1,
  );

  // 날짜별 지출 합계 구하기
  let dayTotals = {};
  monthRecords.forEach((record) => {
    if (record.type !== "expense") return;
    if (!dayTotals[record.date]) dayTotals[record.date] = 0;
    dayTotals[record.date] += Number(record.amount) || 0;
  });

  // 가장 많이 쓴 날 찾기
  let maxDate = null;
  let maxAmount = 0;
  for (let date in dayTotals) {
    if (dayTotals[date] > maxAmount) {
      maxAmount = dayTotals[date];
      maxDate = date;
    }
  }

  // 하루 평균 지출 (지출 있었던 날 기준)
  const totalExpense = Object.values(dayTotals).reduce((a, b) => a + b, 0);
  const spentDayCount = Object.keys(dayTotals).length;
  const avgPerDay = spentDayCount > 0 ? totalExpense / spentDayCount : 0;

  // 가장 많이 쓴 카테고리
  let categoryTotals = {};
  monthRecords.forEach((record) => {
    if (record.type !== "expense") return;
    if (!categoryTotals[record.category]) categoryTotals[record.category] = 0;
    categoryTotals[record.category] += Number(record.amount) || 0;
  });

  let maxCategory = null;
  let maxCategoryAmount = 0;
  for (let cat in categoryTotals) {
    if (categoryTotals[cat] > maxCategoryAmount) {
      maxCategoryAmount = categoryTotals[cat];
      maxCategory = cat;
    }
  }
  const categoryInfo = STAT_CATEGORIES.find((c) => c.key === maxCategory);

  // 화면에 표시
  const text1 = document.getElementById("analysisText");
  const text2 = document.getElementById("analysisText2");
  const text3 = document.getElementById("analysisText3");

  if (text1) {
    text1.textContent = maxDate
      ? `이번달 가장 많이 지출한 날은 ${maxDate.slice(8, 10)}일, ${formatMoney(maxAmount)} 썼어요`
      : "이번달 지출 기록이 없어요";
  }

  if (text2) {
    text2.textContent = `이번달 하루 평균 ${formatMoney(Math.round(avgPerDay))} 썼어요`;
  }

  if (text3) {
    text3.textContent = categoryInfo
      ? `이번 달은 ${categoryInfo.label}에 가장 많이 썼어요 (${formatMoney(maxCategoryAmount)})`
      : "이번달 지출 기록이 없어요";
  }
}

//기간 계산하는거

function getMonthList(period) {
  const result = [];
  const endDate = new Date(now.getFullYear(), now.getMonth(), 1);
  let startMonth;
  if (period === "1y") {
    startMonth = 0;
  } else {
    startMonth = Math.max(0, endDate.getMonth() - 5);
  }

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

// 월별 수입/지출

function getMonthlyTotals(period) {
  const months = getMonthList(period);
  return months.map((item) => {
    const monthRecords = getRecordsOfMonth(records, item.year, item.month + 1);

    let income = 0;
    let expense = 0;
    monthRecords.forEach((record) => {
      const amount = Number(record.amount) || 0;
      if (record.type === "income") {
        income += amount;
      } else {
        expense += amount;
      }
    });
    return {
      year: item.year,
      month: item.month,
      income: income,
      expense: expense,
    };
  });
}

// 월별 카테고리 지출
function getMonthlyCategoryTotals(period, category) {
  const months = getMonthList(period);
  return months.map((item) => {
    const monthRecords = getRecordsOfMonth(records, item.year, item.month + 1);
    let total = 0;
    monthRecords.forEach((record) => {
      if (record.type === "expense" && record.category === category) {
        total += Number(record.amount) || 0;
      }
    });

    return total;
  });
}

// 월 이름

function getMonthLabels(period) {
  const months = getMonthList(period);
  return months.map((item) => {
    return `${item.month + 1}월`;
  });
}

// 월별 소비

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
  // 전체
  if (category === "all") {
    const monthlyData = getMonthlyTotals(period);
    barChartInstance = new Chart(context, {
      type: "bar",
      data: {
        labels: labels,
        datasets: [
          {
            label: "수입",
            data: monthlyData.map((item) => item.income),
            backgroundColor: "#0071e3",
            borderRadius: 5,
            barPercentage: 0.65,
            categoryPercentage: 0.7,
          },
          {
            label: "지출",
            data: monthlyData.map((item) => item.expense),

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

  //카테고리
  else {
    const categoryData = getMonthlyCategoryTotals(period, category);
    const categoryInfo = STAT_CATEGORIES.find((item) => item.key === category);
    barChartInstance = new Chart(context, {
      type: "line",
      data: {
        labels: labels,
        datasets: [
          {
            label: categoryInfo ? categoryInfo.label : "지출",
            data: categoryData,
            borderColor: categoryInfo?.color || "#0071e3",
            backgroundColor: categoryInfo?.color || "#0071e3",
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

//막대 그래프
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

// 선 그래프

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

// 이번 달 며칠까지 있는지

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

// 이번 달 날짜별 지출 계산

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
    records.forEach((record) => {
      if (record.type === "expense" && record.date === dateStr) {
        total += Number(record.amount) || 0;
      }
    });

    dailyTotals.push({ day: day, amount: total });
  }
  return dailyTotals;
}

// 지출 금액에 따라 색깔 진하기 정하기

function getHeatColor(amount, maxAmount) {
  if (amount === 0) return "var(--bg)";

  const ratio = amount / maxAmount;

  if (ratio > 0.75) return "#d7263d";
  if (ratio > 0.5) return "#e2828a";
  if (ratio > 0.25) return "#f3b7bc";
  return "#fbe1e3";
}

// 소비 패턴 히트맵 그리기

function createHeatmap() {
  const container = document.getElementById("heatmapGrid");
  if (!container) return;

  container.innerHTML = "";

  const year = now.getFullYear();
  const month = now.getMonth();
  const firstDay = new Date(year, month, 1).getDay(); // 1일이 무슨 요일인지

  const dailyTotals = getMonthDailyExpense();
  const maxAmount = Math.max(...dailyTotals.map((d) => d.amount), 1);

  // 1일 앞에 빈 칸 채우기
  for (let i = 0; i < firstDay; i++) {
    const emptyCell = document.createElement("div");
    emptyCell.className = "heatmap-cell empty";
    container.appendChild(emptyCell);
  }

  dailyTotals.forEach((item) => {
    const cell = document.createElement("div");
    cell.className = "heatmap-cell";
    cell.style.background = getHeatColor(item.amount, maxAmount);
    cell.textContent = item.day;
    cell.title = formatMoney(item.amount);
    container.appendChild(cell);
  });
}

//버튼
function setupChartControls() {
  //최근 6개월/올해
  document.querySelectorAll(".period-btn").forEach((button) => {
    button.addEventListener("click", function () {
      document.querySelectorAll(".period-btn").forEach((btn) => {
        btn.classList.remove("active");
      });

      this.classList.add("active");

      createBarChart();
    });
  });

  //카테고리 선택하는거
  document
    .querySelectorAll("#barCategoryFilter .filter-chip")
    .forEach((chip) => {
      chip.addEventListener("click", function () {
        document
          .querySelectorAll("#barCategoryFilter .filter-chip")
          .forEach((item) => {
            item.classList.remove("active");
          });

        this.classList.add("active");

        createBarChart();
      });
    });
}

//전체 새로고침
function refreshStatistics() {
  renderStatisticsSummary();
  renderAnalysisSummary();
  createDoughnutChart();
  createBarChart();
  createHeatmap();
}

//처음 실행
document.addEventListener("DOMContentLoaded", function () {
  setupChartControls();
  refreshStatistics();

  let lastMonth = now.getMonth();
  setInterval(() => {
    if (now.getMonth() !== lastMonth) {
      lastMonth = now.getMonth();
      refreshStatistics();
    }
  }, 1000); //1초
});
