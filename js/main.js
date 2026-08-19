//실행

//가계부/통계 화면 전환
document.querySelectorAll(".nav-btn").forEach(function (btn) {
  btn.addEventListener("click", function () {
    document
      .querySelectorAll(".nav-btn")
      .forEach((b) => b.classList.remove("active"));

    btn.classList.add("active");

    document
      .querySelectorAll(".screen")
      .forEach((s) => s.classList.remove("active"));

    const targetId = btn.dataset.target; //ledger 아니면 stats
    document.getElementById(targetId).classList.add("active");
  });
});
