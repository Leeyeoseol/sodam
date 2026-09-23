/*
1. 상단 년/월 표시
2. 날짜 선택 현재 날짜 가져오기 + 미래선택 불가
3. 왼쪽 화살표 클릭 이벤트
4. 오른쪽 화살표 클릭 이벤트
5. 현재시간 가져오기/시간 입력 기본값
6. 처음 시작시 실행 시키는것들
7. 일주일 이름 함수
8. 년/월 기록만
9. 수입합계/지출합계/잔액 계산
10. 날짜별로 묶기
11. 카테고리별 합계 계산
12. 수입/지출 선택 변경 시 카테고리 옵션 업데이트
13. 기존 initDateInput 실행 시 카테고리도 초기 세팅되도록 호출
*/
//날짜랑 왼쪽 오른쪽 이동, 계산, 카테고리, 일주일 등

var now = new Date();

//상단 년/월 표시
function labelRender() {
  var targetLabels = document.querySelectorAll(".month-label");

  targetLabels.forEach(function (label) {
    label.innerText =
      now.getFullYear() + "년 " + (now.getMonth() + 1) + "월";
  });
}

//날짜 선택 현재 날짜 가져오기 + 미래선택 불가
function initDateInput() {
  var dateInput = document.getElementById("inputDate");
  if (dateInput) {
    var year = now.getFullYear();
    var month = String(now.getMonth() + 1).padStart(2, "0");
    var day = String(now.getDate()).padStart(2, "0");

    const formatToday = `${year}-${month}-${day}`;

    dateInput.value = formatToday;
    dateInput.max = formatToday; //미래 제한
  }
}

//왼쪽 화살표 클릭 이벤트
function leftArrowClick() {
  now.setMonth(now.getMonth() - 1); //자동임
  labelRender();
  renderList();
  renderSummary();
  createDoughnutChart();
  createBarChart();
}//클릭할때 다시 호출하기

//오른쪽 화살표 클릭 이벤트
function rightArrowClick() {
  var realToday = new Date(); //오늘 날짜

  now.setMonth(now.getMonth() + 1); //다음달로 이동

  //미래로 가면 빼기
  if (
    now.getFullYear() > realToday.getFullYear() ||
    (now.getFullYear() === realToday.getFullYear() &&
      now.getMonth() > realToday.getMonth())
  ) {
    now.setMonth(now.getMonth() - 1);
  } else {
    labelRender();
    renderList();
    renderSummary();
  }
}

//현재시간 가져오기/시간 입력 기본값
function setCurrentTime() {
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");

  document.getElementById("inputTime").value = `${hours}:${minutes}`;
}

//처음 시작시 실행 시키는것들
window.onload = function () {
  setCurrentTime();
  labelRender();
  initDateInput();
  loadRecords();
  renderList();
  renderSummary();
};

function getWeekdayName(dateStr) {//일주일 이름 함수
  const days = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
  const date = new Date(dateStr);
  return days[date.getDay()];
}

//년/월 기록만
function getRecordsOfMonth(recordArray, year, month) {
  const monthStr = String(month).padStart(2, "0"); // 3 을 "03"으로
  const prefix = year + "-" + monthStr;
  return recordArray.filter(function (record) {
    return record.date.startsWith(prefix);
  });
}

//수입합계/지출합계/잔액 계산
function calculateTotals(recordArray) {
  let income = 0;
  let expense = 0;
  recordArray.forEach(function (record) {
    if (record.type === "income") {
      income += record.amount;
    } else {
      expense += record.amount;
    }
  });
  return { income: income, expense: expense, balance: income - expense };
}

//날짜별로 묶어서
function groupByDate(recordArray) {
  const groups = {};
  recordArray.forEach(function (record) {
    if (!groups[record.date]) {
      groups[record.date] = [];
    }
    groups[record.date].push(record);
  });
  return groups;
}

//카테고리별 합계 계산
function calculateCategoryTotals(recordArray) {
  const categoryTotals = {};

  recordArray.forEach(function (record) {
    const category = record.category || "other";
    const amount = Number(record.amount) || 0;

    if (!categoryTotals[category]) {
      categoryTotals[category] = 0;
    }
    categoryTotals[category] += amount;
  });

  return categoryTotals;
}

// 카테고리 목록 정의
const categories = {
  expense: [
    { value: "food", label: "식비" },
    { value: "shopping", label: "쇼핑" },
    { value: "transport", label: "교통" },
    { value: "living", label: "생활" },
    { value: "leisure", label: "문화·여가" },
    { value: "fixed", label: "고정지출" },
    { value: "other", label: "기타" }
  ],
  income: [
    { value: "salary", label: "월급" },
    { value: "side", label: "부업·알바" },
    { value: "allowance", label: "용돈" },
    { value: "carryover", label: "이월" },
    { value: "other_income", label: "기타수입" }
  ]
};

// 수입/지출 선택 변경 시 카테고리 옵션 업데이트
function updateCategoryOptions() {
  const typeSelect = document.getElementById("inputType");
  const categorySelect = document.getElementById("inputCategory");

  if (!typeSelect || !categorySelect) return;

  const selectedType = typeSelect.value;
  const options = categories[selectedType];

  categorySelect.innerHTML = ""; // 기존 옵션 비우기

  options.forEach(cat => {
    const opt = document.createElement("option");
    opt.value = cat.value;
    opt.textContent = cat.label;
    categorySelect.appendChild(opt);
  });
}

// 기존 initDateInput 실행 시 카테고리도 초기 세팅되도록 호출
window.addEventListener("DOMContentLoaded", function () {
  updateCategoryOptions();
});