//추후 use client : 눌렀을 때 댓글 나타나야함
import { Review } from '@/types/review'
import StarRating from '@/components/common/StarRating';
import { formatDate } from '@/utils/date';

interface ReviewItemProps {
    review: Review;
    currentUserId: string;
}

function ReviewItem({ review, currentUserId }: ReviewItemProps) {
    const isOwner = currentUserId === review.author?.user_id;
    const nickname = review.author?.nickname ?? '알 수 없음';
    const initial = nickname[0] ?? '?';

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