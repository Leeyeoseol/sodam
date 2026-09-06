# sodam

## 2026 2학기 웹응용 가계부 프로젝트 레포지토리

### 프로젝트 구성
- **팀원**: 2207 안지호, 2208 이여설
- **주제**: 웹 기반 개인 지출 관리 서비스
- **기술 스택**: HTML, CSS, JavaScript(바닐라)
- **데이터 저장**: 브라우저 localStorage
- **AI 질문 기능**: OpenAI API + Netlify Functions (API 키를 서버 환경에서만 사용, 프론트엔드 코드에는 노출되지 않음)

### 프로젝트 프로그램 설치방법
- 별도 설치 없이 브라우저에서 바로 실행 가능합니다.
- `index.html` 파일을 열거나, 배포 주소로 접속하면 됩니다.
- (AI 질문 기능은 Netlify 배포 환경에서만 정상 동작합니다. 로컬에서 `index.html`을 직접 열면 해당 기능은 작동하지 않을 수 있습니다.)

### 프로젝트 기획 개발 일정
1주차: 프로젝트 환경 구축, 파일 구조 설계, GitHub 저장소 설정
2주차: 메인 화면 레이아웃 (사이드바 포함 틀)
3주차: 지출/수입 기록 추가 폼 구현 
4주차: localStorage 연동, 기록 삭제
5~6주차: 날짜별 그룹 목록 + 소계(기능 5) 계산
7주차: 월별 접기/펼치기 섹션 + 월별 총액 표시
8주차: 상단 월별 수입·지출·합계 요약 헤더
9주차: 전월 대비 문장형 비교
10주차: 카테고리별 색상 구분 + 원형그래프
11주차: 전체 기능 통합 및 테스트, 오류 수정
12주차: 최종 점검, 발표 자료 제작, 발표 준비

(수정 가능)


### 배포
- Netlify를 통해 배포합니다.
- 정적 파일(HTML/CSS/JS)은 그대로 호스팅되고, AI 질문 기능은 Netlify Functions(`netlify/functions/ask-ai.js`)를 통해 서버 측에서 처리됩니다.
- OpenAI API 키는 Netlify 대시보드의 환경변수(Environment variables)에 등록되어 있으며, 코드에는 포함되어 있지 않습니다.

### 프로젝트 프로그램 사용법
- 좌측 사이드바에서 **가계부 / 통계 / AI질문** 화면을 전환할 수 있습니다.
- **가계부**: 상단 폼에 날짜·시간·카테고리·금액·내용을 입력해 기록을 추가합니다.
- **통계**: 카테고리 비율(도넛그래프)과 기간별 추이(막대그래프)를 확인할 수 있습니다.
- **AI질문**: 가계부 데이터를 바탕으로 자연어 질문에 답변을 받을 수 있습니다.

### 저작권 및 사용권 정보
- 본 프로젝트는 학교 수업 과제로 제작되었습니다.

### 프로그래머 정보
- 

### 버그 및 디버그
- 발견된 버그나 이슈는 GitHub Issues에 등록해주세요.

### 참고 및 출처
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

### 버전 및 업데이트 정보 (X)

### FAQ (X)

### git 커밋방법

- git add .
- git commit -m "자세한 설명"
- git push

### API 관련 상세설명
- 수행평가 과제용으로 API key가 코드에 포함된 채 제출
- 그 후 재발급 후 node.js, Netlify등을 사용해 배포 후 사용자에게 배포 예정
- API는 한도 설정