import type { Metadata } from 'next'
import '@/app/globals.css'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { FestivalProvider } from '@/context/FestivalContext'
import Script from 'next/script'
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
    <html lang="ko" data-scroll-behavior="smooth">
      <head>
        <meta charSet="utf-8" />
        <meta content="width=device-width, initial-scale=1.0" name="viewport" />
        <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&amp;family=Be+Vietnam+Pro:wght@400;500;600;700&amp;display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="text-on-surface">
        <Navbar />
        <main className="pt-24 pb-20 px-4 md:px-8 max-w-7xl mx-auto">
          <div className="bg-white rounded-3xl border border-[#D1D5DB] overflow-hidden shadow-sm">
            <Script
              src="//dapi.kakao.com/v2/maps/sdk.js?appkey=dc37dc09b327ae5d0055aebf692b7f78&autoload=false&libraries=services"
              strategy="afterInteractive"
            />
            <FestivalProvider>{children}</FestivalProvider>
          </div>
        </main>
        <Footer />
      </body>
    </html>
  )
}
