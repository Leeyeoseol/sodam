//실행, 전환

//가계부/통계 화면 전환
document.querySelectorAll(".nav-btn").forEach(function (btn) {
  btn.addEventListener("click", function () {//클릭이벤트
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












// // 통계 화면 안에서 카테고리 비율/기간별 추이 탭 전환
// document.querySelectorAll('.segment-btn').forEach(function (btn) {
//   btn.addEventListener('click', function () {
//     document.querySelectorAll('.segment-btn').forEach(b => b.classList.remove('active'));
//     btn.classList.add('active');

//     document.querySelectorAll('.stat-view').forEach(v => v.classList.remove('active'));
//     document.getElementById('view-' + btn.dataset.view).classList.add('active');
//   });
// });

// // 기간별 추이 안에서 전환
// document.querySelectorAll('.period-btn').forEach(function (btn) {
//   btn.addEventListener('click', function () {
//     document.querySelectorAll('.period-btn').forEach(b => b.classList.remove('active'));
//     btn.classList.add('active');
//   });
// });

// // 기간별 추이 안에서 카테고리 칩 선택
// document.querySelectorAll('#barCategoryFilter .filter-chip').forEach(function (chip) {
//   chip.addEventListener('click', function () {
//     document.querySelectorAll('#barCategoryFilter .filter-chip').forEach(c => c.classList.remove('active'));
//     chip.classList.add('active');
//   });
// });

loadRecords();
renderList();
renderSummary();