//화면에 표시 / 불러오기
function renderList() {
  const container = document.getElementById("recordList");
  container.innerHTML = ""; //지우고 다시 그리기

  for (let i = 0; i < records.length; i++) {
    const record = records[i];

    // 날짜
    const row = document.createElement("div");
    row.className = "record-row";

    // 왼쪽 영역
    const left = document.createElement("div");
    left.className = "record-left";

    // 카테고리 점
    const dot = document.createElement("span");
    dot.className = "cat-dot " + record.category;

    // 내용 + 시간
    const info = document.createElement("div");

    const nameText = document.createElement("p");
    nameText.className = "record-name";
    nameText.textContent = record.content;

    const timeText = document.createElement("p");
    timeText.className = "record-time";
    timeText.textContent = record.time;

    info.appendChild(nameText);
    info.appendChild(timeText);

    left.appendChild(dot);
    left.appendChild(info);

    // 오른쪽 영역
    const right = document.createElement("div");
    right.className = "record-right";

    // 금액
    const amountText = document.createElement("span");
    amountText.className = "record-amount";

    if (record.category === "income") {
      amountText.classList.add("income");
      amountText.textContent = "+" + record.amount.toLocaleString() + "원";
    } else {
      amountText.classList.add("expense");
      amountText.textContent = "-" + record.amount.toLocaleString() + "원";
    }

    // 삭제 버튼
    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-btn";
    deleteBtn.textContent = "🗑";

    deleteBtn.addEventListener("click", function () {
      records.splice(i, 1);
      renderList();
    });

    right.appendChild(amountText);
    right.appendChild(deleteBtn);

    // 최종
    row.appendChild(left);
    row.appendChild(right);

    container.appendChild(row);
  }
}


