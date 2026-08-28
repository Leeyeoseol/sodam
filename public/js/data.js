//기록, 로컬스토리지 등
var records = [];

// 저장하기
function saveRecords() {
  localStorage.setItem("sodam-records", JSON.stringify(records));
}

// 불러오기 (페이지 열릴 때 실행되어야 함, main.js에서 호출)
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
    id: Date.now(),                                             // 추가: 삭제할 때 구분용 고유값
    type: categoryValue === "income" ? "income" : "expense",     // 추가: 수입/지출 구분
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

//펼쳐지는 목록에 날짜 띄우기 + 날짜별로 기록 띄우기 필요