'use client'
import ReviewSection from '@/components/review/ReviewSection'
import FestivalContentSection from '@/components/festival/FestivalContentSection'
import { useParams } from 'next/navigation'

export default function FestivalDetailPage() {
  const { id } = useParams()
  return (
    <div className="mx-auto max-w-2xl px-4 py-8 bg-surface">
      {/* 축제 상세 내용 영역 (추후 구현) */}
      <FestivalContentSection id={Number(id)} />

      {/* 구분선 */}
      <hr className="border-[var(--color-border)] mb-8" />

      {/* 리뷰 섹션 */}
      <ReviewSection />
    </div>
  )
}
