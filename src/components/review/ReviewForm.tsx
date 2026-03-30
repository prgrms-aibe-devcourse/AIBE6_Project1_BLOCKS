"use client";

import { useState } from "react";
import { buttonVariants } from "../common/Button";
import { useAuth } from "@/components/providers/AuthProvider";
import { supabase } from "@/lib/supabase";

interface ReviewFormProps {
    festivalId: number;
}

function ReviewForm({ festivalId }: ReviewFormProps) {
    const { user } = useAuth();
    const [content, setContent] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (!user) {
            alert("로그인을 먼저 해주세요");
            return;
        }
        if (!content.trim()) {
            alert("리뷰 내용을 입력해주세요.");
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
                        rating: 5,
                    }
                ])
                .select() // ✅ 추가: 응답을 명시적으로 요청해야 pending 방지

            if (error) {
                console.error("리뷰 등록 오류:", error.message, error.code);
                // RLS 오류 시 error.code === '42501'
                alert(`리뷰 등록에 실패했습니다. (${error.message})`);
                return;
            }

            alert("리뷰가 등록되었습니다.");
            setContent("");

        } catch (error) {
            console.error("예외 발생:", error);
            alert(`오류가 발생했습니다: ${error instanceof Error ? error.message : "알 수 없는 오류"}`);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="bg-white border border-[var(--color-border)] rounded-card p-5">
            <h3 className="text-sm font-semibold text-[var(--color-neutral-900)] mb-4">
                리뷰 작성
            </h3>

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