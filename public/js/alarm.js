// 알림 띄우기
function showToast(message, type) {
  const container = document.getElementById("toastContainer");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = "toast " + (type || "success");

  const text = document.createElement("span");
  text.textContent = message;

  const closeBtn = document.createElement("button");
  closeBtn.className = "toast-close";
  closeBtn.textContent = "✕";

  closeBtn.addEventListener("click", function () {
    toast.remove();
  });

  toast.appendChild(text);
  toast.appendChild(closeBtn);
  container.appendChild(toast);

  // 4초 뒤 알림 제거
  setTimeout(function () {
    toast.remove();
  }, 4000);
}

// 랜덤 문구 선택
function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)];
}

// 연속 기록 일수 계산
function getStreakDays() {
  let dateList = [];

  for (let i = 0; i < records.length; i++) {
    if (!dateList.includes(records[i].date)) {
      dateList.push(records[i].date);
    }
  }

  let streak = 0;
  let checkDate = new Date();

  for (let i = 0; i < dateList.length; i++) {
    const dateStr =
      checkDate.getFullYear() +
      "-" +
      String(checkDate.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(checkDate.getDate()).padStart(2, "0");

    if (dateList.includes(dateStr)) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}

// 지출 / 수입 알림
function checkSpendingInsight(record) {
  // 수입 입력
  if (record.type === "income") {
    showToast(
      pickRandom([
        "수입 기록이 저장되었습니다.",
        "수입 내역이 추가되었습니다.",
        "수입 등록이 완료되었습니다.",
      ]),
      "success",
    );
    return;
  }

  const thisYear = now.getFullYear();
  const thisMonth = now.getMonth();

  // 이번 달 카테고리 지출 합계
  const thisMonthRecords = getRecordsOfMonth(records, thisYear, thisMonth + 1);

  let thisMonthCategoryTotal = 0;
  let categoryRecordCount = 0;

  for (let i = 0; i < thisMonthRecords.length; i++) {
    const r = thisMonthRecords[i];

    if (r.type === "expense" && r.category === record.category) {
      thisMonthCategoryTotal += Number(r.amount) || 0;
      categoryRecordCount++;
    }
  }

  // 지난달 카테고리 지출 합계
  let lastMonth = thisMonth - 1;
  let lastMonthYear = thisYear;

  if (lastMonth < 0) {
    lastMonth = 11;
    lastMonthYear--;
  }

  const lastMonthRecords = getRecordsOfMonth(
    records,
    lastMonthYear,
    lastMonth + 1,
  );

  let lastMonthCategoryTotal = 0;

  for (let i = 0; i < lastMonthRecords.length; i++) {
    const r = lastMonthRecords[i];

    if (r.type === "expense" && r.category === record.category) {
      lastMonthCategoryTotal += Number(r.amount) || 0;
    }
  }

  // 카테고리 이름 가져오기
  const categoryInfo = STAT_CATEGORIES.find((c) => c.key === record.category);

  const categoryLabel = categoryInfo ? categoryInfo.label : "지출";

  // 하루 지출 합계
  let dayTotals = {};

  for (let i = 0; i < thisMonthRecords.length; i++) {
    const r = thisMonthRecords[i];

    if (r.type === "expense") {
      if (!dayTotals[r.date]) {
        dayTotals[r.date] = 0;
      }

      dayTotals[r.date] += Number(r.amount) || 0;
    }
  }

  let totalExpense = 0;
  let spentDayCount = 0;

  for (let date in dayTotals) {
    totalExpense += dayTotals[date];
    spentDayCount++;
  }

  const avgPerDay = spentDayCount > 0 ? totalExpense / spentDayCount : 0;

  const todayTotal = dayTotals[record.date] || 0;

  // 지난달보다 지출이 많은 경우
  if (
    lastMonthCategoryTotal > 0 &&
    thisMonthCategoryTotal > lastMonthCategoryTotal
  ) {
    const diff = thisMonthCategoryTotal - lastMonthCategoryTotal;

    showToast(
      `${categoryLabel} 지출이 전월보다 ${formatMoney(diff)} 증가했습니다.`,
      "warning",
    );
    return;
  }

  // 하루 평균보다 지출이 많은 경우
  if (avgPerDay > 0 && todayTotal > avgPerDay * 1.5) {
    showToast(
      `오늘 지출이 일평균 지출(${formatMoney(Math.round(avgPerDay))})을 초과했습니다.`,
      "warning",
    );
    return;
  }

  // 이번 달 첫 카테고리 지출
  if (categoryRecordCount === 1) {
    showToast(`이번 달 첫 ${categoryLabel} 지출이 등록되었습니다.`, "success");
    return;
  }

  // 하루 평균보다 지출이 적은 경우
  if (avgPerDay > 0 && todayTotal < avgPerDay * 0.5) {
    showToast(
      pickRandom([
        "오늘 지출이 평균보다 적습니다.",
        "지출 금액이 안정적으로 유지되고 있습니다.",
        "소비 절감 상태입니다.",
      ]),
      "success",
    );
    return;
  }

  // 연속 기록 확인
  const streak = getStreakDays();

  if (streak >= 3) {
    showToast(`${streak}일 연속 기록이 유지되고 있습니다.`, "success");
    return;
  }

  showToast(
    pickRandom([
      "지출 내역이 저장되었습니다.",
      "기록이 정상적으로 등록되었습니다.",
      "저장이 완료되었습니다.",
    ]),
    "success",
  );
}
