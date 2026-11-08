# SODAM

본 문서는 **SODAM**의 실행 방법 및 테스트 계정 안내를 위한 문서입니다.

## 실행 방법

### 배포된 서비스

SODAM은 Vercel을 통해 배포된 웹 애플리케이션입니다.

- 서비스 주소 : https://sodam-nu.vercel.app/

### 로컬 실행

1. `npm install`
2. `.env` 파일 생성
3. `GEMINI_API_KEY` 입력
4. `npm start`

## 사용 안내

- SODAM은 로그인 없이 사용할 수 있습니다.
- 사용자의 데이터는 브라우저의 Local Storage에 저장됩니다.
- 같은 브라우저와 같은 기기에서 접속하면 기존 기록을 이어서 사용할 수 있습니다.
- 브라우저 데이터를 삭제하거나 Local Storage가 초기화되면 저장된 데이터는 복구할 수 없습니다.
- Local Storage를 사용하므로 다른 브라우저나 다른 도메인(예: `localhost` → Vercel)에서는 기존 데이터가 자동으로 이어지지 않습니다.

## 테스트 계정

- 로그인 기능이 없습니다.
