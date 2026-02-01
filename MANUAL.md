# L'Onde Web Application - Deployment Guide

이 문서는 L'Onde 웹사이트를 Firebase 백엔드와 연동하고, GitHub와 Vercel을 통해 배포하는 방법을 설명합니다.

## 1. Firebase 설정 (먼저 하세요!)

웹사이트의 데이터(메뉴, 이미지 등)를 저장하기 위해 Firebase 프로젝트가 필요합니다.

1. [Firebase Console](https://console.firebase.google.com/)에 접속하여 로그인합니다.
2. **"프로젝트 추가"**를 클릭하여 새 프로젝트를 만듭니다 (예: `londe-web`).
3. 프로젝트 개요 페이지에서 **웹 아이콘(</>)**을 클릭하여 앱을 등록합니다.
   - 앱 닉네임 입력 (예: `Londe Web`).
   - 등록 후 나오는 `const firebaseConfig = { ... }` 내용을 따로 복사해둡니다.

### Firestore 데이터베이스 설정
1. 좌측 메뉴에서 **Build > Firestore Database**를 클릭합니다.
2. **"데이터베이스 만들기"**를 클릭합니다.
3. 위치를 선택하고 (예: `asia-northeast3` 등 가까운 곳), **"테스트 모드에서 시작"**을 선택하여 생성합니다.
   - *주의: 테스트 모드는 누구나 읽기/쓰기가 가능합니다. 실제 운영 시에는 보안 규칙을 설정해야 합니다.*

### Storage (이미지 저장소) 설정
1. 좌측 메뉴에서 **Build > Storage**를 클릭합니다.
2. **"시작하기"**를 클릭합니다.
3. **"테스트 모드에서 시작"**을 선택하고 완료합니다.

## 2. 환경 변수 설정 (.env.local)

프로젝트 루트 폴더에 `.env.local` 파일이 생성되어 있습니다. 이 파일을 열고, 위에서 복사한 Firebase 설정값을 채워넣으세요.

```env
VITE_FIREBASE_API_KEY=복사한_apiKey
VITE_FIREBASE_AUTH_DOMAIN=복사한_authDomain
VITE_FIREBASE_PROJECT_ID=복사한_projectId
VITE_FIREBASE_STORAGE_BUCKET=복사한_storageBucket
VITE_FIREBASE_MESSAGING_SENDER_ID=복사한_messagingSenderId
VITE_FIREBASE_APP_ID=복사한_appId
```
*주의: `=` 뒤에 공백 없이 값을 붙여넣으세요.*

## 3. 로컬에서 실행하기

터미널에서 다음 명령어를 실행하여 웹사이트가 정상 작동하는지 확인합니다.

```bash
# 의존성 설치 (최초 1회)
npm install

# 개발 서버 실행
npm run dev
```
브라우저에서 `http://localhost:5173` (또는 표시된 포트)으로 접속합니다.
- `http://localhost:5173/admin.html` : 관리자 페이지 (이미지 업로드 및 텍스트 수정)
- `http://localhost:5173/` : 메인 웹사이트

## 4. GitHub에 업로드

코드를 저장하고 버전을 관리하기 위해 GitHub에 업로드합니다.

1. GitHub에서 새 Repository(저장소)를 생성합니다.
2. 터미널에서 다음 명령어를 순서대로 입력합니다:

```bash
git init
git add .
git commit -m "Initial commit with Firebase setup"
git branch -M main
git remote add origin https://github.com/사용자아이디/저장소이름.git
git push -u origin main
```

## 5. Vercel 배포 (웹에 공개하기)

Vercel을 사용하면 GitHub에 올린 코드를 자동으로 웹사이트로 만들어줍니다.

1. [Vercel Dashboard](https://vercel.com/dashboard)에 로그인합니다.
2. **"Add New..." > "Project"**를 클릭합니다.
3. GitHub의 `londe-web` (방금 만든 저장소)를 **Import** 합니다.
4. **Configure Project** 화면에서:
   - **Framework Preset**: `Vite` (자동으로 잡힙니다).
   - **Environment Variables**: 중요합니다! `.env.local`에 적었던 내용들을 여기에 똑같이 추가해야 합니다.
     - `VITE_FIREBASE_API_KEY` : 값...
     - `VITE_FIREBASE_PROJECT_ID` : 값...
     - (나머지 4개도 모두 추가)
5. **"Deploy"** 버튼을 클릭합니다.

잠시 후 배포가 완료되면 `https://your-project.vercel.app` 형태의 주소가 생성됩니다. 이제 전 세계 어디서든 접속할 수 있습니다!

---

## 관리자 페이지 사용 팁

- 배포된 주소 뒤에 `/admin.html`을 붙이면 관리자 패널에 접속할 수 있습니다.
- 이미지를 업로드하면 자동으로 Firebase Storage에 저장되고, 텍스트를 수정하면 Firestore에 저장됩니다.
- 메인 페이지를 새로고침하면 관리자에서 수정한 내용이 반영됩니다.
