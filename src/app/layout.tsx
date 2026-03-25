import type { Metadata } from "next";
import "@/app/globals.css"
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: {
    default: "FestaPlан – 나만의 축제 여행 플래너",
    template: "%s | FestaPlан",
  },
  description: "AI가 추천하는 축제 기반 최적의 여행 플랜 서비스",
  keywords: ["축제", "여행", "플래너", "AI", "FestaPlан"],
  openGraph: {
    title: "FestaPlан",
    description: "AI가 추천하는 축제 기반 최적의 여행 플랜",
    locale: "ko_KR",
    type: "website",
  },
};

/* ─────────────────────────────────────────────
   Root Layout
   ───────────────────────────────────────────── */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}