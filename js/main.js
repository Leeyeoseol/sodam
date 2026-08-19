//실행

//가계부/통계 화면 전환
document.querySelectorAll(".nav-btn").forEach(function (btn) {
  btn.addEventListener("click", function () {
    // TODO 1: 모든 .nav-btn에서 active 클래스 제거
    document
      .querySelectorAll(".nav-btn")
      .forEach((b) => b.classList.remove("active"));

    // TODO 2: 지금 클릭한 btn에 active 클래스 추가
    btn.classList.add("active");

    // TODO 3: 모든 .screen에서 active 클래스 제거
    document
      .querySelectorAll(".screen")
      .forEach((s) => s.classList.remove("active"));

    // TODO 4: btn의 data-target 값을 읽어 해당 화면에 active 추가
    const targetId = btn.dataset.target; //ledger 아니면 stats
    document.getElementById(targetId).classList.add("active");
  });
});
