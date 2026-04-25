# 회룡역 파크뷰 랜딩페이지

`Patioforet` 프로젝트를 기반으로 복제한 독립 작업본입니다.
원본 `Patioforet` 폴더에는 영향을 주지 않고, 이 폴더에서만 이미지, 문구, 연락처, 메타데이터를 새 현장 기준으로 수정해 사용할 수 있습니다.

## 시작하기

- `npm install`
- `npm run preview`

## 현재 상태

- `Patioforet`의 현재 작업본 기준으로 소스 구조를 복제
- 새 폴더명은 `HillstateParkView`
- 원본과 완전히 분리하기 위해 `.git`, `node_modules`, 로컬 워크스페이스 폴더는 제외하고 생성
- 패키지 이름은 `hillstate-park-view`로 분리

## 먼저 바꾸면 좋은 항목

- `index.html`의 제목과 Open Graph 메타데이터
- 메인 페이지와 메뉴 페이지 내부의 현장명 텍스트
- 상담 연락처, 개인정보 문구, 외부 스크립트 설정값
- 대표 이미지와 배포 URL

## 실행 스크립트

- `npm run preview`: Gulp 기반 미리보기 실행
- `npm run serve`: temha 서버 실행
