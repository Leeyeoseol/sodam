//필터 기능

//- 카테고리별로 필터링
//- 전체 누르면 다른 카테고리 unchecked / 전체 상태에서 다른 카테고리 누르면 전체 unchecked /  다른 카테고리를 모두 해제하면 전체 checked

// 전체 체크박스
const all = document.getElementById("all");

// 카테고리 체크박스
const categoryChecks = document.querySelectorAll(".categoryFilter");

// 선택한 카테고리 배열
let filterArr = [];

// 선택된 카테고리 가져오기
function getFilterArr() {
  filterArr = [];

  categoryChecks.forEach((check) => {
    if (check.checked) {
      filterArr.push(check.value);
    }
  });
}

// json(로컬스토리지) 불러오기 후 선택한 카테고리만 필터링
function filterJson() {
  // 최신 데이터 불러오기
  loadRecords();

  // 체크된 카테고리 저장
  getFilterArr();

  // 전체 선택 또는 아무것도 선택하지 않았으면 전체 반환
  if (all.checked || filterArr.length === 0) {
    return records;
  }

  // 선택한 카테고리만 반환
  return records.filter((record) => {
    return filterArr.includes(record.category);
  });
}

// 값에 따라 필터링하고 화면 다시 출력
function updateFilter() {
  const result = filterJson();

  // 필터링된 목록 출력
  renderList(result);
}

//

// 전체 선택 시 다른 카테고리 해제
all.addEventListener("change", () => {
  if (all.checked) {
    categoryChecks.forEach((check) => {
      check.checked = false;
    });
  }

  updateFilter();
});

// 카테고리 선택 시
categoryChecks.forEach((check) => {
  check.addEventListener("change", () => {
    // 다른 카테고리를 선택하면 전체 해제
    all.checked = false;

    // 선택된 카테고리 개수 확인
    const checkedCount = document.querySelectorAll(
      ".categoryFilter:checked",
    ).length;

    // 아무것도 선택하지 않으면 전체 선택
    if (checkedCount === 0) {
      all.checked = true;
    }

    updateFilter();
  });
});
