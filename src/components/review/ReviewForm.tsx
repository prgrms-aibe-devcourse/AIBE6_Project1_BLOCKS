"use client";

import { useState } from "react";
import { buttonVariants } from "@/components/common/Button";
import { useAuth } from "@/components/providers/AuthProvider";
import { supabase } from "@/lib/supabase";
import Badge from "@/components/common/Badge";

interface ReviewFormProps {
    festivalId: number;
    onReviewAdded?: () => void;
}

const RATING_LABELS = [
    { value: 1, label: "별로에요", emoji: "😞" },
    { value: 2, label: "그저 그래요", emoji: "😐" },
    { value: 3, label: "좋아요", emoji: "🙂" },
    { value: 4, label: "매우 좋아요", emoji: "😊" },
    { value: 5, label: "최고예요!", emoji: "🤩" },
];

function ReviewForm({ festivalId, onReviewAdded }: ReviewFormProps) {
    const { user } = useAuth();
    const [rating, setRating] = useState(0);
    const [content, setContent] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const selected = RATING_LABELS.find((r) => r.value === rating);

    const handleSubmit = async () => {
        // 수정 — setTimeout으로 렌더링 이후에 실행
        if (!user) {
            setTimeout(() => alert("로그인을 먼저 해주세요"), 0);
            return;
        }
        if (rating === 0) {
            setTimeout(() => alert("별점을 선택해주세요."), 0);
            return;
        }
        if (!content.trim()) {
            setTimeout(() => alert("리뷰 내용을 입력해주세요."), 0);
            return;
        }

        try {
            setIsSubmitting(true);

            const { data, error } = await supabase
                .from('reviews')
                .insert([
                    {
                        festival_id: festivalId,
                        user_id: user.id,
                        contents: content,
                        rating,
                    }
                ])
                .select() // ✅ 추가: 응답을 명시적으로 요청해야 pending 방지

            if (error) {
                console.error("리뷰 등록 오류:", error.message, error.code);
                // RLS 오류 시 error.code === '42501'
                setTimeout(() => alert(`리뷰 등록에 실패했습니다. (${error.message})`), 0);
                return;
            }

            setRating(0);
            setContent("");
            onReviewAdded?.(); // 부모의 fetchReviews 재실행 → 목록 즉시 갱신

        } catch (error) {
            console.error("예외 발생:", error);
            setTimeout(() => alert(`오류가 발생했습니다: ${error instanceof Error ? error.message : "알 수 없는 오류"}`), 0);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="bg-white border border-[var(--color-border)] rounded-card p-5">
            <h3 className="text-sm font-semibold text-[var(--color-neutral-900)] mb-4">
                리뷰 작성
            </h3>
            {/* 별점 선택 */}
            <div className="mb-5">
                <p className="text-muted text-xs mb-2.5">이 축제는 어떠셨나요?</p>

                <div className="flex gap-2">
                    {RATING_LABELS.map((item) => {
                        const isActive = rating === item.value;
                        return (
                            <button
                                key={item.value}
                                type="button"
                                onClick={() => setRating(item.value)}
                                className={`rating-btn ${isActive ? "active" : ""}`}
                            >
                                <span className="text-xl leading-none">{item.emoji}</span>
                                <span
                                    className={`text-[11px] font-medium text-center leading-tight ${isActive ? "text-primary" : "text-muted"
                                        }`}
                                >
                                    {item.label}
                                </span>
                                <span className={`text-[10px] ${isActive ? "text-primary" : "text-[var(--color-neutral-300)]"}`}>
                                    {"★".repeat(item.value)}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* 선택 확인 */}
                <div className="h-6 mt-2.5 flex justify-center items-center">
                    {selected && (
                        <Badge variant="primary">
                            {selected.emoji} {selected.label} ({selected.value}점)
                        </Badge>
                    )}
                </div>
            </div>

            {/* 텍스트 입력 */}
            <div className="mb-4">
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="축제에 대한 솔직한 후기를 남겨주세요."
                    rows={4}
                    maxLength={500}
                    className={[
                        "w-full text-sm resize-none rounded-card px-4 py-3",
                        "border border-[var(--color-border)]",
                        "placeholder:text-[var(--color-neutral-400)]",
                        "text-[var(--color-neutral-900)]",
                        "focus:outline-none focus:border-[var(--color-primary)]",
                        "focus:ring-2 focus:ring-[var(--color-primary-light)]",
                        "transition-all duration-200",
                    ].join(" ")}
                />
                <div className="flex justify-end mt-1">
                    <span className="text-[11px] text-[var(--color-neutral-400)]">
                        {content.length} / 500
                    </span>
                </div>
            </div>

            {/* 제출 버튼 */}
            <button
                className={buttonVariants({ variant: "primary", size: "lg", fullWidth: true })}
                onClick={handleSubmit}
                disabled={isSubmitting}
            >
                {isSubmitting ? "등록 중..." : "리뷰 등록"}
            </button>
        </div>
    )
}

export default ReviewForm