//기록, 로컬스토리지 등
var records = [];

//폼   제출 시
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
    date: dateValue,
    time: timeValue,
    category: categoryValue,
    amount: amountValue,
    content: contentValue,
  };
  records.push(newRecord);
  renderList();

  console.log(records);
});