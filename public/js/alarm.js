// 알림 띄우기
//여기다가 랜덤 메세지 넣기
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

  playToastSound(); //소리재생

  // 4초 뒤 자동으로 사라지기
  setTimeout(function () {
    toast.remove();
  }, 4000);
}

// 알림 소리
function playToastSound() {
  try {
    const audio = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audio.createOscillator();
    const gainNode = audio.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audio.destination);

    oscillator.frequency.value = 800;
    gainNode.gain.value = 0.1;

    oscillator.start();
    oscillator.stop(audio.currentTime + 0.15);
  } catch (e) {}
}

// 여러 버전 문구 중 하나 랜덤으로 고르기
function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)];
}

// 연속 며칠 기록했는지 계산
function getStreakDays() {
  // 기록된 날짜들만 중복없이 뽑기
  let dateSet = new Set();
  records.forEach((r) => dateSet.add(r.date));
  let dateList = Array.from(dateSet).sort().reverse(); // 최신순

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

// 지출/수입 입력하고 계산해서 알림 띄우기
function checkSpendingInsight(record) {
  // 수입 입력했을 때
  if (record.type === "income") {
    showToast(
      pickRandom([
        "수입이 들어왔어요! 💰",
        "수입 기록 완료했어요",
        "좋은 소식이네요, 수입 추가됐어요",
      ]),
      "success",
    );
    return;
  }

  const thisYear = now.getFullYear();
  const thisMonth = now.getMonth();

  // 이번달 이 카테고리 지출 합계
  const thisMonthRecords = getRecordsOfMonth(records, thisYear, thisMonth + 1);
  let thisMonthCategoryTotal = 0;
  let categoryRecordCount = 0;
  thisMonthRecords.forEach((r) => {
    if (r.type === "expense" && r.category === record.category) {
      thisMonthCategoryTotal += Number(r.amount) || 0;
      categoryRecordCount++;
    }
  });

  // 지난달 같은 카테고리 지출 합계
  let lastMonth = thisMonth - 1;
  let lastMonthYear = thisYear;
  if (lastMonth < 0) {
    lastMonth = 11;
    lastMonthYear = thisYear - 1;
  }
  const lastMonthRecords = getRecordsOfMonth(
    records,
    lastMonthYear,
    lastMonth + 1,
  );
  let lastMonthCategoryTotal = 0;
  lastMonthRecords.forEach((r) => {
    if (r.type === "expense" && r.category === record.category) {
      lastMonthCategoryTotal += Number(r.amount) || 0;
    }
  });

  const categoryInfo = STAT_CATEGORIES.find((c) => c.key === record.category);
  const categoryLabel = categoryInfo ? categoryInfo.label : "지출";

  // 오늘 지출 / 하루 평균 계산
  let dayTotals = {};
  thisMonthRecords.forEach((r) => {
    if (r.type !== "expense") return;
    if (!dayTotals[r.date]) dayTotals[r.date] = 0;
    dayTotals[r.date] += Number(r.amount) || 0;
  });
  const totalExpense = Object.values(dayTotals).reduce((a, b) => a + b, 0);
  const spentDayCount = Object.keys(dayTotals).length;
  const avgPerDay = spentDayCount > 0 ? totalExpense / spentDayCount : 0;
  const todayTotal = dayTotals[record.date] || 0;

  if (
    lastMonthCategoryTotal > 0 &&
    thisMonthCategoryTotal > lastMonthCategoryTotal
  ) {
    const diff = thisMonthCategoryTotal - lastMonthCategoryTotal;
    showToast(
      `이번 달 ${categoryLabel}, 지난달보다 벌써 ${formatMoney(diff)} 더 썼어요`,
      "warning",
    );
    return;
  }

  if (avgPerDay > 0 && todayTotal > avgPerDay * 1.5) {
    showToast(
      `오늘 지출이 하루 평균(${formatMoney(Math.round(avgPerDay))})보다 많아요`,
      "warning",
    );
    return;
  }

  if (categoryRecordCount === 1) {
    showToast(`이번 달 첫 ${categoryLabel} 지출이에요`, "success");
    return;
  }

  if (avgPerDay > 0 && todayTotal < avgPerDay * 0.5) {
    showToast(
      pickRandom([
        "오늘 절약 잘하고 계세요 👍",
        "오늘은 지출이 적네요, 좋아요!",
        "알뜰하게 쓰고 계시네요",
      ]),
      "success",
    );
    return;
  }

  const streak = getStreakDays();
  if (streak >= 3) {
    showToast(`${streak}일 연속 기록 중이에요! 🔥`, "success");
    return;
  }

  showToast(
    pickRandom(["저장했어요", "기록 완료!", "잘 기록했어요"]),
    "success",
  );
}
