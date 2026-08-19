//계산,문장
var now = new Date();

//상단 년/월 표시
function labelRender() {
  var targetLabel = document.getElementById("monthLabel");
  if (targetLabel) {
    targetLabel.innerText =
      now.getFullYear() + "년 " + (now.getMonth() + 1) + "월";
  }
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
  }
}

//처음 시작시 실행 시키는것들
window.onload = function () {
  labelRender();
  initDateInput();
};
