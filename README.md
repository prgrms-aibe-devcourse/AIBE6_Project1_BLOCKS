# 🎪 Festa Plan

> **국내 축제 정보를 한 곳에서 탐색하고, AI가 나만의 여행 일정을 자동으로 만들어주는 서비스**

---

## 📌 프로젝트 소개

**Festa Plan**은 국내 다양한 축제 정보를 한눈에 확인하고, 사용자의 취향(카테고리·여행 스타일·동행자)을 입력하면 **Google Gemini AI**가 맞춤형 여행 일정을 자동 생성해주는 웹 서비스입니다.

- 🔍 축제 탐색 및 상세 정보 조회
- 🤖 AI 기반 개인 맞춤형 여행 플래너 자동 생성
- ⭐ 축제 리뷰 및 별점 작성
- 📅 내 여행 플랜 저장 및 D-day 관리
- 🗺️ 카카오맵 기반 위치 검색

---

## 🛠️ 기술 스택

| 분류 | 기술 |
|------|------|
| **Framework** | Next.js 16, React 19 |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS v4 |
| **Database / Auth** | Supabase (PostgreSQL, Storage, Auth) |
| **AI** | Google Gemini 2.5 Flash API |
| **지도** | Kakao Map API, Leaflet |
| **기타** | NextAuth, react-daum-postcode, react-icons |

---

## 📁 프로젝트 구조

```
src/
├── app/
│   ├── api/
│   │   ├── festivals/        # 축제 목록 조회 API
│   │   ├── plan/             # AI 여행 플랜 생성 API
│   │   ├── signup/           # 회원가입 API
│   │   └── delete-account/   # 계정 삭제 API
│   ├── planner/
│   │   ├── step1/            # 취향 입력 (카테고리, 스타일, 동행자)
│   │   ├── step2/            # 축제 선택 및 날짜 입력
│   │   └── result/           # AI 생성 플랜 결과
│   ├── festival/[id]/        # 축제 상세 페이지
│   ├── mypage/               # 내 플랜 / 리뷰 / 계정 관리
│   ├── login/ signup/        # 인증 페이지
│   └── ...
├── components/
│   ├── planner/              # 플래너 관련 컴포넌트
│   ├── festival/             # 축제 관련 컴포넌트
│   ├── review/               # 리뷰 관련 컴포넌트
│   ├── mypage/               # 마이페이지 컴포넌트
│   ├── layout/               # Navbar, Footer
│   └── common/               # 공통 UI 컴포넌트
├── hooks/planner/            # 플래너 커스텀 훅
├── lib/                      # Supabase 클라이언트
├── types/                    # TypeScript 타입 정의
└── utils/                    # 날짜, 이미지 URL 유틸
```

---

## ✨ 주요 기능

### 1. 🎉 축제 탐색
- 전체 축제 목록 조회 (최신순 / 평점순 정렬)
- 카테고리 필터링으로 관심 축제 검색
- 축제 상세 정보 확인 (일정, 위치, 사진)

### 2. 🤖 AI 여행 플래너
- **Step 1**: 관심 카테고리 · 여행 스타일 · 동행자 선택
- **Step 2**: 원하는 축제 선택, 출발지 · 날짜 입력
- **Result**: Gemini AI가 일별 상세 여행 일정 자동 생성
  - 예상 이동 거리, 플랜 신뢰도 제공
  - 일정 항목 추가 · 수정 · 삭제 가능

### 3. ⭐ 리뷰 시스템
- 축제별 별점(1~5) 및 후기 작성
- 사진 최대 3장 첨부
- 작성한 리뷰 수정 · 삭제

### 4. 👤 마이페이지
- 저장된 여행 플랜 목록 조회 및 D-day 확인
- 내가 작성한 리뷰 관리
- 프로필 정보 수정 / 비밀번호 변경 / 계정 탈퇴

### 5. 🔐 인증
- 이메일 회원가입 · 로그인
- 비밀번호 찾기 및 재설정

---

## 🚀 로컬 실행 방법

### 1. 레포지토리 클론

```bash
git clone https://github.com/prgrms-aibe-devcourse/AIBE6_Project1_BLOCKS.git
cd AIBE6_Project1_BLOCKS
```

### 2. 패키지 설치

```bash
npm install
```

### 3. 환경변수 설정

프로젝트 루트에 `.env.local` 파일을 생성하고 아래 내용을 작성합니다.

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

GEMINI_API_KEY=your_gemini_api_key

NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
```

> ⚠️ `GEMINI_API_KEY`가 없으면 AI 플래너는 목업 데이터로 동작합니다.

### 4. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 접속

---

## 📦 설치된 주요 패키지

```bash
npm install class-variance-authority   # 컴포넌트 스타일 변형 관리
```

---

## 🗄️ 데이터베이스 구조 (Supabase)

| 테이블 | 설명 |
|--------|------|
| `festivals` | 축제 정보 (제목, 날짜, 장소, 사진, 평점 등) |
| `planner` | AI 생성 여행 플랜 헤더 (제목, 기간, 이동거리 등) |
| `plans` | 플랜 상세 일정 (일차, 시간, 장소, 내용) |
| `reviews` | 축제 리뷰 (별점, 내용, 사진) |

---

## 🔧 개발 명령어

```bash
npm run dev      # 개발 서버 실행
npm run build    # 프로덕션 빌드
npm run start    # 프로덕션 서버 실행
npm run lint     # ESLint 검사
```

---

## 📄 라이선스

본 프로젝트는 프로그래머스 AI 백엔드 데브코스 6기 1차 팀 프로젝트입니다.
