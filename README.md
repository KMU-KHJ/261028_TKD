# 태권도 연구실 아카이브

태권도학과의 **연구자료·수업자료**를 모아 두고, 대학원생들이 **댓글로 토론**할 수 있는 웹사이트입니다.

- 관리자(교수): 글 작성·수정·삭제, 모든 댓글 삭제
- 로그인 사용자(대학원생): 댓글 작성, 본인 댓글 삭제
- 로그인하지 않은 방문자: 글 읽기만 가능

> **두 가지 모드로 동작합니다**
> - **실제 모드**(현재 설정): `src/lib/siteSettings.ts`의 Firebase 설정값으로 Google 로그인과 온라인 데이터베이스(Firestore)를 사용합니다.
> - **테스트 모드**: 위 파일의 `apiKey`를 비우면 데이터가 *지금 사용하는 브라우저에만* 저장됩니다. 화면 맨 위에 노란 안내 띠가 보입니다.

파일 첨부는 무료 요금제 유지를 위해 **외부 링크(Google Drive, YouTube, DOI 등)** 로만 받습니다.

---

## 1. 내 컴퓨터에서 실행해 보기

### 준비물
- [Node.js](https://nodejs.org/ko) **LTS 버전** 설치 (설치 후 컴퓨터 재시작 권장)

### 실행 순서
1. 이 폴더에서 터미널(맥: 터미널, 윈도우: PowerShell)을 엽니다.
2. 필요한 프로그램을 내려받습니다. (처음 한 번만)
   ```bash
   npm install
   ```
3. 개발 서버를 실행합니다.
   ```bash
   npm run dev
   ```
4. 화면에 나온 주소(보통 `http://localhost:5173`)를 브라우저로 엽니다.
5. 실제 Firebase에 연결된 상태로 열립니다. (내 컴퓨터 주소 `localhost`는 Firebase 승인된 도메인에 기본으로 들어 있습니다)

---

## 2. GitHub에 올리기

1. [github.com](https://github.com)에 로그인 → 오른쪽 위 **+** → **New repository**
2. 저장소 이름(예: `taekwondo-archive`)을 입력하고 **Create repository**
3. 이 폴더에서 아래 명령을 차례로 실행합니다. (`내아이디`, `저장소이름`은 바꿔 주세요)
   ```bash
   git remote add origin https://github.com/내아이디/저장소이름.git
   ```
   ```bash
   git branch -M main
   ```
   ```bash
   git push -u origin main
   ```

---

## 3. Netlify로 배포하기 (무료)

1. [app.netlify.com](https://app.netlify.com)에 GitHub 계정으로 가입/로그인
2. **Add new site** → **Import an existing project** → **GitHub** 선택
3. 방금 올린 저장소를 선택
4. 빌드 설정은 `netlify.toml` 파일에 이미 들어 있으므로 그대로 두고 **Deploy** 클릭
   - Build command: `npm run build`
   - Publish directory: `dist`
5. 1~2분 뒤 `https://무작위이름.netlify.app` 주소가 생깁니다.
6. (선택) **Site configuration → Change site name** 에서 주소 앞부분을 바꿀 수 있습니다.

이후 GitHub에 변경 사항을 올리면 Netlify가 **자동으로 다시 배포**합니다.

---

## 4. Firebase 연결하기 (실제 로그인·데이터 저장)

Firebase는 **Spark(무료) 요금제**를 그대로 사용합니다. 결제 정보를 등록할 필요가 없습니다.

1. **프로젝트 만들기**: [console.firebase.google.com](https://console.firebase.google.com) → **프로젝트 추가** → 이름 입력 → (Google 애널리틱스는 꺼도 됨) → 만들기
2. **웹 앱 등록**: 프로젝트 개요 화면의 **`</>` (웹)** 아이콘 → 앱 닉네임 입력 → **앱 등록**
   → 화면에 나오는 `firebaseConfig` 값(apiKey, authDomain …)을 메모장에 복사
3. **Google 로그인 켜기**: 왼쪽 메뉴 **빌드 → Authentication** → **시작하기** → **로그인 방법** 탭 → **Google** → **사용 설정** → 지원 이메일 선택 → **저장**
4. **승인된 도메인 추가**: Authentication → **설정** 탭 → **승인된 도메인** → **도메인 추가** → `무작위이름.netlify.app` 입력 (`https://` 없이)
   ⚠️ 이걸 빠뜨리면 배포된 사이트에서 로그인이 실패합니다.
5. **데이터베이스 만들기**: **빌드 → Firestore Database** → **데이터베이스 만들기** → 위치 `asia-northeast3 (서울)` → **프로덕션 모드**로 시작
6. **보안 규칙 붙여넣기**: Firestore → **규칙** 탭 → 기존 내용을 모두 지우고 이 저장소의 `firestore.rules` 내용을 붙여넣기
   → 그 안의 `professor@example.com` 을 **교수님 Google 이메일**로 바꾸기 → **게시**
7. **설정 파일 확인**: `src/lib/siteSettings.ts` 파일에 Firebase 설정값(`firebaseConfig`)과 관리자 이메일이 들어 있습니다.
   다른 Firebase 프로젝트로 바꾸거나 관리자를 추가할 때는 이 파일만 고치면 됩니다. (Netlify 환경변수는 필요 없습니다)
   - Firebase 웹 설정값은 브라우저에 공개되는 값이라 코드에 넣어도 안전합니다. 데이터 보호는 보안 규칙이 담당합니다.
8. **배포**: 바뀐 코드를 GitHub에 올리면 Netlify가 자동으로 다시 배포합니다.
9. **확인**: 교수님 계정으로 Google 로그인 → 이름 옆에 "(관리자)"가 보이면 상단 **글쓰기** 메뉴로 첫 글 작성

> `siteSettings.ts`에서 `apiKey`를 빈 값(`''`)으로 바꾸면 Firebase 없이 **테스트 모드**로 동작합니다.

### 무료 한도를 아끼는 방식
- 실시간 구독(onSnapshot)을 쓰지 않고, 필요할 때만 읽습니다.
- 목록은 20개씩 불러오고 "더 보기"를 눌렀을 때만 추가로 읽습니다.
- 댓글은 글 상세 화면에 들어갔을 때만 읽고, 작성·삭제 후에는 다시 읽지 않습니다.
- 목록의 카테고리 필터와 검색은 이미 불러온 글 안에서 처리합니다.

---

## 폴더 구조 (참고)

```
src/
  components/   화면 조각 (머리말, 댓글, 카드 등)
  pages/        페이지 (홈, 목록, 상세, 글쓰기, 로그인, 404)
  services/     데이터 처리 (화면은 이곳만 사용)
    mock/       테스트 모드: 브라우저(localStorage)에 저장
    firebase/   실제 모드: Firebase에 저장
    index.ts    설정값 유무에 따라 둘 중 하나를 자동 선택
  lib/          설정값(siteSettings.ts), Firebase 초기화
  types/        데이터 형태 정의
  utils/        날짜·링크 등 도우미 함수
firestore.rules Firebase 보안 규칙 (콘솔에 붙여넣는 파일)
netlify.toml    Netlify 배포 설정
```
