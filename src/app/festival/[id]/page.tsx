'use client'
import FestivalContentSection from '@/components/festival/FestivalContentSection'
import ReviewSection from '@/components/review/ReviewSection'
import { useParams } from 'next/navigation'

export default function FestivalDetailPage() {
  const { id } = useParams()
  const festivalId = Number(id)
  return (
    <div className="mx-auto max-w-2xl px-4 py-8 bg-surface">
      {/* 축제 상세 내용 영역 */}
      <FestivalContentSection id={Number(id)} />

      {/* 구분선 */}
      <hr className="border-[var(--color-border)] mb-8" />

      {/* 리뷰 섹션 */}
      {!isNaN(festivalId) && <ReviewSection festivalId={festivalId} />}
    </div>
  )
}
