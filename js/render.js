//화면에 표시 / 불러오기
function renderList() {
  const container = document.getElementById("recordList");
  container.innerHTML = ""; //지우고 다시 그리기

  records.forEach(function (record) {
    const div = document.createElement("div"); //생성
    div.textContent = record.content + " : " + record.amount + "원"; //내용
    container.appendChild(div); // 화면안에ㅍ 표시
  });
}
