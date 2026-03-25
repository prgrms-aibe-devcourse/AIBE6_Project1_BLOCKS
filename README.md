# Festa Plan

국내 축제 정보를 한 곳에서 탐색하고, AI 기반 여행 플래너를 통해 개인 맞춤형 여행 스케줄을 자동으로 생성해주는 서비스입니다. 사용자는 자신의 관심사를 입력하면 적합한 축제를 추천받고 해당 기간에 맞는 상세 여행 플랜을 손쉽게 얻을 수 있습니다.

```
src/
├── app/                        # Next.js App Router
│   ├── layout.tsx              # 루트 레이아웃 (GNB, Footer 포함)
│   ├── page.tsx                # 홈 (메인) 페이지
│   ├── auth/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── signup/
│   │       └── page.tsx
│   ├── festival/
│   │   ├── page.tsx            # 축제 목록
│   │   └── [id]/
│   │       └── page.tsx        # 축제 상세
│   ├── planner/
│   │   ├── page.tsx            # AI 플래너 스텝 UI
│   │   └── [id]/
│   │       └── page.tsx        # 플랜 상세/편집
│   ├── mypage/
│     └── page.tsx            # 마이페이지
│
│
├── components/                 # 공통 컴포넌트
│   ├── common/                 # Button, Modal, Card 등
│   ├── layout/                 # Header, Footer, BottomTab
│   ├── festival/               # 축제 관련 컴포넌트
│   ├── planner/                # 플래너 관련 컴포넌트
│   └── review/                 # 리뷰·댓글 관련 컴포넌트
│
├── hooks/                      # 커스텀 훅 (useAuth, usePlanner 등)
├── store/                      # Zustand 전역 상태
├── api/                        # Axios 인스턴스 + API 함수
├── types/                      # TypeScript 타입 정의
└── utils/                      # 날짜, 포맷 등 유틸 함수
```
