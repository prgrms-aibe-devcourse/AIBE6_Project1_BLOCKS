import '@/app/globals.css'
import Footer from '@/components/layout/Footer'
import Navbar from '@/components/layout/Navbar'
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

/* ─────────────────────────────────────────────
   Root Layout
   ───────────────────────────────────────────── */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0"
        />
      </head>
      <body className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
