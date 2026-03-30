import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: {
    default: 'FestaPlan - 나만의 축제 여행 플래너',
    template: '%s | FestaPlan',
  },
  description: 'AI가 추천하는 축제 기반 최적의 여행 플랜 서비스',
  keywords: ['축제', '여행', '플래너', 'AI', 'FestaPlan'],
  openGraph: {
    title: 'FestaPlan',
    description: 'AI가 추천하는 축제 기반 최적의 여행 플랜',
    locale: 'ko_KR',
    type: 'website',
  },
}
