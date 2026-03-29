'use client'

import { Review } from "@/types/review"
import { useState } from "react";
import ReviewItem from "@/components/review/ReviewItem";


interface ReviewProps {
    festivalId: string,
    reviews: Review[],
    currentUserId: string,
}

type SortType = "recent" | "high" | "low";

const SORT_OPTIONS: { label: string; value: SortType }[] = [
    { label: "최신순", value: "recent" },
    { label: "별점 높은순", value: "high" },
    { label: "별점 낮은순", value: "low" },
];

function ReviewList({ festivalId, reviews, currentUserId }: ReviewProps) {
    const [sort, setSort] = useState<SortType>("recent");


    /* ── 정렬 ── */
    const sorted = [...reviews].sort((a, b) => {
        if (sort === "recent") return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        if (sort === "high") return b.rating - a.rating;
        return a.rating - b.rating;
    });

    return (
        <section>
            {/* ── 정렬 탭 ── */}
            {reviews.length > 0 && (
                <div className="flex gap-1 mb-4 border-b border-[var(--color-border)]">
                    {SORT_OPTIONS.map((opt) => (
                        <button
                            key={opt.value}
                            onClick={() => setSort(opt.value)}
                            className={[
                                "px-3 py-2.5 text-sm font-medium transition-all border-b-2 -mb-px",
                                sort === opt.value
                                    ? "text-[var(--color-primary)] border-[var(--color-primary)]"
                                    : "text-[var(--color-neutral-500)] border-transparent hover:text-[var(--color-neutral-700)]",
                            ].join(" ")}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
            )}

            {/* ── 리뷰 목록 ── */}
            {sorted.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                    <EmptyIcon />
                    <p className="mt-3 text-sm font-medium text-[var(--color-neutral-500)]">
                        아직 리뷰가 없습니다
                    </p>
                    <p className="text-xs text-[var(--color-neutral-400)] mt-1">
                        첫 번째 리뷰를 남겨보세요!
                    </p>
                </div>
            ) : (
                <div>
                    {sorted.map((review) => (
                        <ReviewItem key={review.id} review={review} currentUserId={currentUserId} />
                    ))}
                </div>
            )}
        </section>
    );
}


function EmptyIcon() {
    return (
        <svg
            className="w-12 h-12 text-[var(--color-neutral-300)]"
            fill="none" stroke="currentColor" strokeWidth={1.2} viewBox="0 0 24 24"
        >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
    );
}



export default ReviewList