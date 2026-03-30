//추후 use client : 눌렀을 때 댓글 나타나야함
import { Review } from '@/types/review'
import StarRating from '@/components/common/StarRating';
import { formatDate } from '@/utils/date';

interface ReviewItemProps {
    review: Review;
    currentUserId: string;
    onDeleteReview?: (reviewId: number) => void;
}

function ReviewItem({ review, currentUserId, onDeleteReview }: ReviewItemProps) {
    const isOwner = currentUserId === review.user_id; // ✅ user_id 필드 직접 비교
    const nickname = review.author?.nickname ?? '알 수 없음';
    const initial = nickname[0] ?? '?';

    const handleDelete = () => {
        if (window.confirm("정말 이 리뷰를 삭제하시겠습니까?")) {
            onDeleteReview?.(review.id);
        }
    };

    return (
        <div className="py-5 border-b border-[var(--color-neutral-100)] last:border-none">
            {/* 상단: 작성자 정보 */}
            <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex items-center gap-2.5">
                    {/* Avatar */}
                    <div className="w-9 h-9 rounded-full bg-[var(--color-primary-light)] flex items-center justify-center shrink-0 overflow-hidden">
                        {review.author?.image ? (
                            <img
                                src={review.author.image}
                                alt={nickname}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <span className="text-sm font-semibold text-[var(--color-primary)]">
                                {initial}
                            </span>
                        )}
                    </div>

                    <div className="flex flex-col gap-0.5">
                        <span className="text-sm font-semibold text-[var(--color-neutral-900)]">
                            {nickname}
                        </span>
                        <div className="flex items-center gap-2">
                            <StarRating rating={review.rating} size="sm" showValue />
                            <span className="text-[11px] text-[var(--color-neutral-400)]">
                                {formatDate(review.created_at)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* 삭제 버튼 (작성자에게만 표시) */}
                {isOwner && (
                    <button
                        onClick={handleDelete}
                        className="text-[11px] text-[var(--color-neutral-400)] hover:text-red-500 transition-colors px-2 py-1 rounded-md hover:bg-red-50"
                    >
                        삭제
                    </button>
                )}
            </div>

            {/* 리뷰 이미지 */}
            {review.pictures && (
                <div className="mb-3 rounded-[8px] overflow-hidden w-24 h-24 bg-[var(--color-neutral-100)]">
                    <img
                        src={review.pictures[0]}
                        alt="리뷰 이미지"
                        className="w-full h-full object-cover"
                    />
                </div>
            )}

            {/* 리뷰 내용 */}
            <p className="text-sm text-[var(--color-neutral-700)] leading-relaxed mb-3">
                {review.contents}
            </p>
        </div>
    )
}

export default ReviewItem