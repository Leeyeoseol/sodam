# SODAM

## 2026 2학기 웹응용 가계부 프로젝트

### 프로젝트 소개

SODAM은 HTML, CSS, JavaScript를 활용하여 개발한 웹 기반 개인 가계부 서비스입니다.

수입과 지출을 기록하고, 월별 통계와 카테고리별 소비 현황을 확인할 수 있으며, AI 질문 기능을 통해 소비 내역을 분석하고 상담할 수 있습니다.

---

# 개발 환경

- HTML5
- CSS3
- JavaScript (ES6)
- Chart.js
- Browser LocalStorage
- Gemini API

---

# 실행 방법

깃허브에서 파일을 다운 받은 뒤
프로젝트 폴더에서 `index.html` 파일을 실행하면 사용할 수 있습니다.

단, AI 질문 기능은 Gemini api 무료 키를 직접 입력해야합니다.

---

# 테스트 데이터 불러오기

발표 및 시연을 위해 준비한 LocalStorage 데이터를 사용할 수 있습니다.

---

# 주요 기능

## 가계부

- 수입 및 지출 기록 추가
- 기록 수정 및 삭제
- 날짜별 내역 조회
- 월별 수입, 지출 합계 확인

## 통계

- 카테고리별 소비 비율(도넛 차트)
- 기간별 소비 추이(막대 차트)
- 월별 소비 통계 확인

## AI 질문

가계부 데이터를 기반으로 소비 내역을 분석하여 자연어 질문에 답변합니다.

예시

- 이번 달 식비를 얼마나 사용했어?
- 가장 많이 지출한 카테고리는?
- 소비 습관을 분석해줘.
- 절약 방법을 알려줘.

---

# 환경 변수

OpenAI API Key는 보안을 위해 코드에 포함되어 있지 않습니다.
ai.js 파일에 직접 제미나이 무료 api를 넣어 사용합니다

---

# 주의사항

- 데이터는 브라우저 LocalStorage에 저장됩니다.
- 브라우저 데이터를 삭제하면 저장된 가계부 데이터도 함께 삭제됩니다.

---

# 참고 자료

- OpenAI API
- Chart.js
- Web Storage API(LocalStorage)

- (참고 자료 URL)
- oepn API 사용 : https://toyou101.tistory.com/28
- localStorage 사용 : https://patrick-f.tistory.com/41
- chart.js 사용 :
  https://deahan.tistory.com/16
  https://www.chartjs.org/docs/latest/charts/doughnut.html#doughnut
  - 도넛 차트 가운데 글자 :
  https://dev.mescius.co.kr/bbs/board.php?bo_table=wijmo_qna&wr_id=2085
  https://zizonemoi.tistory.com/82
  https://risha-lee.tistory.com/11
  <!-- - 체크박스 하나만 선택 : https://hianna.tistory.com/434 -->

### git 커밋방법

- git add .
- git commit -m "설명"
- git push

### Local Storage에서 데이터를 옮길때

1. 기존 localStorage를 복사
   로컬에서 개발자 도구(F12) → Console에서
   `localStorage.getItem("sodam-records")`

를 실행해서 나온 긴 문자열을 복사.

2. 그다음 Vercel 사이트에서 F12 → Console에
   `localStorage.setItem("sodam-records", '복사한문자열');`
   `location.reload();`
