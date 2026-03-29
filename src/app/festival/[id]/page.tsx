'use client'

import ReviewSection from "@/components/review/ReviewSection"


export default function FestivalDetailPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-8 bg-surface">
      {/* 축제 상세 내용 영역 (추후 구현) */}
      <div className="h-12 mb-8 flex items-center">
        축제 상세 내용 영역 (추후 구현)
      </div>

      {/* 구분선 */}
      <hr className="border-[var(--color-border)] mb-8" />

      {/* 리뷰 섹션 */}
      <ReviewSection />
    </div>
  )
}
