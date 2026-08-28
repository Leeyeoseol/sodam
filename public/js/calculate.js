//계산,문장
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
}

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

//현재시간 가져오기 / 시간 입력 기본값
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

function getWeekdayName(dateStr) {
  const days = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
  const date = new Date(dateStr);
  return days[date.getDay()];
}

// 지금 년/월 기록만
function getRecordsOfMonth(recordArray, year, month) {
  const monthStr = String(month).padStart(2, "0"); // 3 을 "03"로
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

// 날짜별로 묶음
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
