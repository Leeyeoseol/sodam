# SODAM

본 문서는 SODAM의 실행 방법 및 테스트 계정 가이드를 위한 문서입니다

## 실행 방법

- SODAM은 Vercel을 통해 배포된 웹 애플리케이션입니다.
- 아래 링크를 통해 접속하여 사용할 수 있습니다.
  - 배포 주소 : https://sodam-nu.vercel.app/

## 사용 안내

- SODAM은 로그인 없이 사용할 수 있습니다.
- 사용자의 데이터는 브라우저의 Local Storage에 저장됩니다.
- 같은 브라우저와 같은 기기에서 접속하면 기존 기록을 이어서 사용할 수 있습니다.
- 브라우저 데이터를 삭제하거나 Local Storage가 초기화되면 저장된 데이터는 복구할 수 없습니다.
- SODAM은 브라우저의 Local Storage를 사용합니다.
- 따라서 다른 브라우저나 다른 도메인(예: localhost → Vercel)에서는 기존 데이터가 자동으로 이어지지 않습니다.

- Local Storage에서 데이터를 옮길때

1. 기존 localStorage를 복사
   로컬에서 개발자 도구(F12) → Console에서
   `localStorage.getItem("sodam-records")`

를 실행해서 나온 긴 문자열을 복사.

2. 그다음 Vercel 사이트에서 F12 → Console에
   `localStorage.setItem("sodam-records", '복사한문자열');`
   `location.reload();`

## 테스트 계정

- 별도의 테스트 계정은 필요하지 않습니다.
- 로그인 없이 모든 기능을 이용할 수 있습니다.
