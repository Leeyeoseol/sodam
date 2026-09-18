//기록, 로컬스토리지 등
var records = [];

// 저장하기
function saveRecords() {
  localStorage.setItem("sodam-records", JSON.stringify(records));
  // 데이터가 바뀔 때 차트도 새로고침
  if (typeof createDoughnutChart === 'function') {
    createDoughnutChart();
    createBarChart();
  }
}

// 불러오기
function loadRecords() {
  const saved = localStorage.getItem("sodam-records");
  if (saved) {
    records = JSON.parse(saved);
  }
}

//폼 제출 시 기록추가
document.getElementById("entryForm").addEventListener("submit", function (e) {
  e.preventDefault();

  //값 읽어오기
  const dateValue = document.getElementById("inputDate").value;
  const timeValue = document.getElementById("inputTime").value;

  // typeValue 정의 추가 /없을 경우 expense
  const typeInput = document.getElementById("inputType");
  const typeValue = typeInput ? typeInput.value : "expense";

  const categoryValue = document.getElementById("inputCategory").value;
  const amountValue = Number(document.getElementById("inputAmount").value); //숫자로
  const contentValue = document.getElementById("inputContent").value;

  const formError = document.getElementById("formError");
  //빈 값 찾기
  if (!dateValue || !timeValue || !categoryValue || !amountValue || !contentValue.trim()) {
    formError.textContent = "모든 항목을 입력해주세요.";
    formError.classList.add("show");
    return;
  }

  formError.classList.remove("show");

  const newRecord = {
    id: Date.now(),
    type: typeValue,
    date: dateValue,
    time: timeValue,
    category: categoryValue,
    amount: amountValue,
    content: contentValue,
  };
  records.push(newRecord);
  saveRecords();
  renderList();
  renderSummary();

  console.log(records);
});