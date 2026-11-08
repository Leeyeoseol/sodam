// 현재 날짜
var now = new Date();

// 상단 년/월 표시
function labelRender() {
  var targetLabels = document.querySelectorAll(".month-label");

  for (let i = 0; i < targetLabels.length; i++) {
    targetLabels[i].innerText =
      now.getFullYear() + "년 " + (now.getMonth() + 1) + "월";
  }
}

// 날짜 선택 및 미래 날짜 제한
function initDateInput() {
  var dateInput = document.getElementById("inputDate");

  if (!dateInput) return;

  var year = now.getFullYear();
  var month = String(now.getMonth() + 1).padStart(2, "0");
  var day = String(now.getDate()).padStart(2, "0");

  var formatToday = year + "-" + month + "-" + day;

  dateInput.value = formatToday;
  dateInput.max = formatToday;
}

// 왼쪽 화살표
function leftArrowClick() {
  now.setDate(1);
  now.setMonth(now.getMonth() - 1);

  labelRender();
  renderList();
  renderSummary();
  createDoughnutChart();
  createBarChart();
}

// 오른쪽 화살표
function rightArrowClick() {
  var realToday = new Date();

  now.setDate(1);
  now.setMonth(now.getMonth() + 1);

  if (
    now.getFullYear() > realToday.getFullYear() ||
    (now.getFullYear() === realToday.getFullYear() &&
      now.getMonth() > realToday.getMonth())
  ) {
    now.setMonth(now.getMonth() - 1);
    return;
  }

  labelRender();
  renderList();
  renderSummary();
}

// 현재 시간 입력
function setCurrentTime() {
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");

  document.getElementById("inputTime").value = hours + ":" + minutes;
}

// 처음 실행
window.onload = function () {
  setCurrentTime();
  labelRender();
  initDateInput();
  loadRecords();
  renderList();
  renderSummary();
};

// 요일 이름
function getWeekdayName(dateStr) {
  const days = [
    "일요일",
    "월요일",
    "화요일",
    "수요일",
    "목요일",
    "금요일",
    "토요일",
  ];

  const date = new Date(dateStr);
  return days[date.getDay()];
}

// 해당 년도와 월의 기록 가져오기
function getRecordsOfMonth(recordArray, year, month) {
  const monthStr = String(month).padStart(2, "0");
  const prefix = year + "-" + monthStr;
  let result = [];

  for (let i = 0; i < recordArray.length; i++) {
    if (recordArray[i].date.startsWith(prefix)) {
      result.push(recordArray[i]);
    }
  }

  return result;
}

// 수입, 지출, 잔액 계산
function calculateTotals(recordArray) {
  let income = 0;
  let expense = 0;

  for (let i = 0; i < recordArray.length; i++) {
    let record = recordArray[i];

    if (record.type === "income") {
      income += record.amount;
    } else {
      expense += record.amount;
    }
  }

  return {
    income: income,
    expense: expense,
    balance: income - expense,
  };
}

// 날짜별로 기록 묶기
function groupByDate(recordArray) {
  const groups = {};

  for (let i = 0; i < recordArray.length; i++) {
    let record = recordArray[i];

    if (!groups[record.date]) {
      groups[record.date] = [];
    }

    groups[record.date].push(record);
  }

  return groups;
}

// 카테고리별 합계 계산
function calculateCategoryTotals(recordArray) {
  const categoryTotals = {};

  for (let i = 0; i < recordArray.length; i++) {
    let record = recordArray[i];
    let category = record.category || "other";
    let amount = Number(record.amount) || 0;

    if (!categoryTotals[category]) {
      categoryTotals[category] = 0;
    }

    categoryTotals[category] += amount;
  }

  return categoryTotals;
}

// 카테고리 목록
const categories = {
  expense: [
    { value: "food", label: "식비" },
    { value: "shopping", label: "쇼핑" },
    { value: "transport", label: "교통" },
    { value: "living", label: "생활" },
    { value: "leisure", label: "문화·여가" },
    { value: "fixed", label: "고정지출" },
    { value: "other", label: "기타" },
  ],

  income: [
    { value: "salary", label: "월급" },
    { value: "side", label: "부업·알바" },
    { value: "allowance", label: "용돈" },
    { value: "carryover", label: "이월" },
    { value: "other_income", label: "기타수입" },
  ],
};

// 수입/지출에 따른 카테고리 변경
function updateCategoryOptions() {
  const typeSelect = document.getElementById("inputType");
  const categorySelect = document.getElementById("inputCategory");

  if (!typeSelect || !categorySelect) return;

  const options = categories[typeSelect.value];

  categorySelect.innerHTML = "";

  for (let i = 0; i < options.length; i++) {
    const opt = document.createElement("option");

    opt.value = options[i].value;
    opt.textContent = options[i].label;

    categorySelect.appendChild(opt);
  }
}

// 처음 카테고리 설정
window.addEventListener("DOMContentLoaded", function () {
  updateCategoryOptions();
});
