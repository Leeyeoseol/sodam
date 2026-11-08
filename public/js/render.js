// 화면에 표시하고 불러오기
function renderList(list = records) {
  const container = document.getElementById("recordList");
  container.innerHTML = ""; // 지우고 다시 그리기

  const currentMonthRecords = getRecordsOfMonth(
    list,
    now.getFullYear(),
    now.getMonth() + 1,
  );

  // 날짜별로 묶기
  const grouped = groupByDate(currentMonthRecords);
  const sortedDates = Object.keys(grouped).sort(function (a, b) {
    return b.localeCompare(a);
  }); // 최신순

  for (let i = 0; i < sortedDates.length; i++) {
    const date = sortedDates[i];
    const dayRecords = grouped[date];

    // 그날 수입/지출 합계 계산
    let dayIncome = 0;
    let dayExpense = 0;

    for (let j = 0; j < dayRecords.length; j++) {
      if (dayRecords[j].type === "income") {
        dayIncome += dayRecords[j].amount;
      } else {
        dayExpense += dayRecords[j].amount;
      }
    }

    // 날짜 그룹
    const details = document.createElement("details");
    details.className = "day-group";

    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    if (date === today) {
      details.setAttribute("open", "");
    }

    const summary = document.createElement("summary");
    summary.className = "day-header";
    summary.innerHTML = `
      <span class="day-num">${date.slice(8, 10).replace(/^0/, "")}</span>
      <span class="day-name">${getWeekdayName(date)}</span>
      <span class="day-sums">
        <span class="day-sum income">+${dayIncome.toLocaleString()}</span>
        <span class="day-sum expense">-${dayExpense.toLocaleString()}</span>
      </span>
    `;
    details.appendChild(summary);

    const ul = document.createElement("ul");
    ul.className = "items";

    for (let j = 0; j < dayRecords.length; j++) {
      const record = dayRecords[j];

      // 날짜
      const row = document.createElement("li");
      row.className = "record-row";

      // 왼쪽 영역
      const left = document.createElement("div");
      left.className = "record-left";

      // 점
      const dot = document.createElement("span");
      dot.className = "cat-dot " + record.category;

      // 내용이랑 시간
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

      if (record.type === "income") {
        // category 대신 type으로 판단
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
        const newRecords = [];

        for (let k = 0; k < records.length; k++) {
          if (records[k].id !== record.id) {
            newRecords.push(records[k]);
          }
        }

        records = newRecords;
        saveRecords(); // 저장
        updateFilter(); // 필터 유지
      });

      right.appendChild(amountText);
      right.appendChild(deleteBtn);

      // 최종
      row.appendChild(left);
      row.appendChild(right);
      ul.appendChild(row);
    }

    details.appendChild(ul);
    container.appendChild(details);
  }

  // 데이터가 바뀔 때 차트도 새로고침
  if (typeof createDoughnutChart === "function") {
    createDoughnutChart();
    createBarChart();
  }
}

function groupByDate(recordArray) {
  const groups = {};

  for (let i = 0; i < recordArray.length; i++) {
    const record = recordArray[i];

    if (!groups[record.date]) {
      groups[record.date] = [];
    }

    groups[record.date].push(record);
  }

  return groups;
}

// 수입/지출/합계 보이게
function renderSummary() {
  const monthRecords = getRecordsOfMonth(
    records,
    now.getFullYear(),
    now.getMonth() + 1,
  );

  const totals = calculateTotals(monthRecords);

  document.getElementById("totalIncome").textContent =
    totals.income.toLocaleString();
  document.getElementById("totalExpense").textContent =
    totals.expense.toLocaleString();
  document.getElementById("totalBalance").textContent =
    totals.balance.toLocaleString();
}
