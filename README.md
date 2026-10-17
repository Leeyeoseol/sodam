# SODAM

## 2026 2학기 웹응용 가계부 프로젝트

### 프로젝트 소개

SODAM은 HTML, CSS, JavaScript를 활용하여 개발한 웹 기반 개인 가계부 서비스입니다.

수입과 지출을 기록하고, 월별 통계와 카테고리별 소비 현황을 확인할 수 있으며, AI 질문 기능을 통해 소비 내역을 분석할 수 있습니다.

---

# 개발 환경

- HTML5
- CSS3
- JavaScript (ES6)
- Chart.js
- Browser LocalStorage
- Netlify Functions
- OpenAI API

---

# 실행 방법

## 1. 배포 사이트 실행 (권장)

배포 주소에 접속하면 별도의 설치 없이 바로 사용할 수 있습니다.

> 배포 주소  
> (Netlify URL 입력)

AI 질문 기능을 포함한 모든 기능을 사용할 수 있습니다.

---

## 2. 로컬 실행

프로젝트 폴더에서 `index.html` 파일을 실행하면 사용할 수 있습니다.

단, AI 질문 기능은 Netlify Functions를 사용하므로 로컬 환경에서는 정상적으로 동작하지 않을 수 있습니다.

---

# 테스트 데이터 불러오기

발표 및 시연을 위해 준비한 LocalStorage 데이터를 사용할 수 있습니다.

### 사용 방법

1. 브라우저에서 프로젝트를 실행합니다.
2. 개발자도구(F12)를 엽니다.
3. **Console** 탭을 선택합니다.
4. 아래 코드의 `jsonData` 부분에 제공된 JSON 데이터를 붙여넣습니다.
5. Enter를 누르면 데이터가 자동으로 저장되고 새로고침됩니다.

```javascript
(function () {
  const jsonData = "여기에 JSON 데이터 붙여넣기";

  try {
    const content = JSON.parse(jsonData);

    localStorage.clear();

    for (const key in content) {
      localStorage.setItem(key, content[key]);
    }

    alert("데이터가 정상적으로 불러와졌습니다.");
    location.reload();
  } catch (e) {
    alert("JSON 형식을 다시 확인해주세요.");
  }
})();
```

---

# 주요 기능

## 가계부

- 수입 및 지출 기록 추가
- 기록 수정 및 삭제
- 날짜별 내역 조회
- 월별 수입·지출 합계 확인

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

# 테스트 환경

정상 동작이 확인된 환경입니다.

- Google Chrome
- Microsoft Edge

최신 Chromium 기반 브라우저 사용을 권장합니다.

---

# 환경 변수

OpenAI API Key는 보안을 위해 코드에 포함되어 있지 않습니다.

`.env.example`

```env
OPENAI_API_KEY=
```

실제 API Key는 Netlify 환경 변수(Environment Variables)에 등록하여 사용합니다.

---

# 프로젝트 구조

```text
sodam
├── css/
├── js/
├── images/
├── netlify/
│   └── functions/
├── index.html
├── README.md
├── .env.example
├── package.json
└── package-lock.json
```

---

# 주의사항

- 데이터는 브라우저 LocalStorage에 저장됩니다.
- 브라우저 데이터를 삭제하면 저장된 가계부 데이터도 함께 삭제됩니다.
- AI 질문 기능은 Netlify 배포 환경에서만 정상적으로 동작합니다.

---

# 개발자

- 2207 안지호
- 2208 이여설

---

# 저장소

GitHub Repository

(저장소 URL 입력)

---

# 배포

Netlify

(배포 URL 입력)

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
- 체크박스 하나만 선택 : https://hianna.tistory.com/434

### git 커밋방법

- git add .
- git commit -m "자세한 설명"
- git push
