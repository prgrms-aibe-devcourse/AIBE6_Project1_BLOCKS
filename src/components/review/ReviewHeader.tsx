import StarRating from "@/components/common/StarRating";
import { Review } from "@/types/review";

interface ReviewHeaderProps {
    reviews: Review[];
}

function ReviewHeader({ reviews }: ReviewHeaderProps) {
    /* ── 평균 별점 계산 ── */
    const avgRating =
        reviews.length > 0
            ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
            : 0;

    /* ── 별점 분포 계산 ── */
    const distribution = [5, 4, 3, 2, 1].map((star) => ({
        star,
        count: reviews.filter((r) => r.rating === star).length,
        ratio:
            reviews.length > 0
                ? (reviews.filter((r) => r.rating === star).length / reviews.length) * 100
                : 0,
    }));

    return (<>
        <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-bold text-[var(--color-neutral-900)]">
                리뷰
                <span className="ml-1.5 text-sm font-normal text-[var(--color-neutral-400)]">
                    {reviews.length}개
                </span>
            </h2>
        </div>
        {/* ── 별점 요약 ── */}
        {reviews.length > 0 && (
            <div className="flex gap-6 items-center mb-6 p-4 bg-[var(--color-neutral-50)] rounded-card">
                {/* 평균 */}
                <div className="flex flex-col items-center gap-1 shrink-0">
                    <span className="text-4xl font-bold text-[var(--color-neutral-900)]">
                        {avgRating.toFixed(1)}
                    </span>
                    <StarRating rating={avgRating} size="sm" />
                    <span className="text-xs text-[var(--color-neutral-400)]">
                        {reviews.length}개 리뷰
                    </span>
                </div>
                {/* 분포 */}
                <div className="flex-1 flex flex-col gap-1.5">
                    {distribution.map(({ star, count, ratio }) => (
                        <div key={star} className="flex items-center gap-2">
                            <span className="text-xs text-[var(--color-neutral-500)] w-3 shrink-0">
                                {star}
                            </span>
                            <div className="flex-1 h-1.5 bg-[var(--color-neutral-200)] rounded-pill overflow-hidden">
                                <div
                                    className="h-full bg-[var(--color-star)] rounded-pill transition-all duration-500"
                                    style={{ width: `${ratio}%` }}
                                />
                            </div>
                            <span className="text-xs text-[var(--color-neutral-400)] w-4 text-right shrink-0">
                                {count}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        )}
    </>

    )
}

export default ReviewHeader