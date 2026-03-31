"use client";

import { useEffect, useRef, useState } from "react";
import Button, { buttonVariants } from "@/components/common/Button";
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

const MAX_PICTURES = 3;

function ReviewForm({ festivalId, onReviewAdded }: ReviewFormProps) {
    const { user } = useAuth();
    const [rating, setRating] = useState(0);
    const [content, setContent] = useState("");
    const [pictures, setPictures] = useState<File[]>([]); //선택된 파일 배열
    const [previews, setPreviews] = useState<string[]>([]); //로컬 미리보기 url 배열
    const [isSubmitting, setIsSubmitting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const selected = RATING_LABELS.find((r) => r.value === rating);

    //로컬 ObjectURL 메모리 누수 방지
    useEffect(() => {
        return () => {
            previews.forEach(url => URL.revokeObjectURL(url))
        }
    }, [previews])

    //파일 선택 시, 미리보기 업데이트(업로드X)
    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files ?? [])
        if (!files.length) return

        //최대 장수 초과 체크
        if (pictures.length + files.length > MAX_PICTURES) {
            alert(`사진은 최대 ${MAX_PICTURES}장까지 첨부할 수 있어요.`)
            e.target.value = ''
            return
        }

        const invaildFiles = files.find(f => f.size > 5 * 1024 * 1024 || !f.type.startsWith('image/'))

        if (invaildFiles) {
            alert('이미지 파일만, 5MB 이하만 업로드 할 수 있어요.')
            e.target.value = ''
            return
        }

        setPictures(prev => [...prev, ...files])
        setPreviews(prev => [...prev, ...files.map(f => URL.createObjectURL(f))])
        e.target.value = '' //같은 파일 재선택 가능하도록 초기화 (안하면 onChange 발생하지 않음)
    }

    //개별 사진 제거
    const handleRemovePicture = (index: number) => {
        URL.revokeObjectURL(previews[index])
        setPictures(prev => prev.filter((_, i) => i !== index))
        setPreviews(prev => prev.filter((_, i) => i !== index))
    }

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

            //1)Storage에 사진 업로드
            const pictureUrls: string[] = []
            for (const file of pictures) {
                const ext = file.name.split('.').pop()
                const filePath = `reviews/${festivalId}/${user.id}/${Date.now()}.${ext}`

                const { data: uploadData, error: uploadError } = await supabase.storage
                    .from('review-images')
                    .upload(filePath, file, { upsert: true })

                if (uploadError) throw uploadError

                const { data: urlData } = supabase.storage
                    .from('review-images')
                    .getPublicUrl(uploadData.path)

                pictureUrls.push(urlData.publicUrl)
            }


            //2)리뷰 insert - pictures 컬럼에 URL 배열 저장
            const { data, error } = await supabase
                .from('reviews')
                .insert([
                    {
                        festival_id: festivalId,
                        user_id: user.id,
                        contents: content,
                        rating,
                        pictures: pictureUrls
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
            setPictures([]);
            setPreviews([]);
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

            {/* 사진 첨부 */}
            <div className="mb-5">
                <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-medium text-[var(--color-neutral-700)]">
                        사진 첨부
                    </label>
                    <span className="text-[11px] text-[var(--color-neutral-400)]">
                        {pictures.length} / {MAX_PICTURES}
                    </span>
                </div>
                <div className="flex gap-2 flex-wrap">
                    {previews.map((url, i) => (
                        <div key={i} className="relative w-20 h-20 rounded-[var(--radius-md)] overflow-hidden border border-[var(--color-border)]">
                            <img src={url} alt={`첨부 ${i + 1}`} className="w-full h-full object-cover" />
                            <button
                                type="button"
                                onClick={() => handleRemovePicture(i)}
                                className="absolute top-0.5 right-0.5 w-5 h-5 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-fast"
                            >
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    ))}
                    {pictures.length < MAX_PICTURES && (
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="w-20 h-20 rounded-[var(--radius-md)] border-2 border-dashed border-[var(--color-neutral-200)] flex flex-col items-center justify-center gap-1 hover:border-[var(--color-primary)] hover:bg-[var(--color-primary-light)] transition-fast"
                        >
                            <svg className="w-5 h-5 text-[var(--color-neutral-400)]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                            </svg>
                            <span className="text-[10px] text-[var(--color-neutral-400)]">사진 추가</span>
                        </button>
                    )}
                </div>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleFileSelect}
                />
            </div>


            {/* 제출 버튼 */}
            <Button
                variant="primary"
                size="lg"
                fullWidth
                loading={isSubmitting}
                onClick={handleSubmit}
            >
                {isSubmitting ? "등록 중..." : "리뷰 등록"}
            </Button>
        </div>
    )
}

export default ReviewForm