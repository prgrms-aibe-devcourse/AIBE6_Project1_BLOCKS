"use client";

import { useState } from "react";


function ReviewForm() {
    const [content, setContent] = useState("");


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
                className="w-full h-10 rounded-pill text-sm font-semibold transition-all">
                리뷰 등록
            </button>
        </div>
    )
}

export default ReviewForm