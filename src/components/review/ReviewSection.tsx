import ReviewForm from '@/components/review/ReviewForm'
import ReviewList from '@/components/review/ReviewList'
import { Profile } from '@/types/profile'
import ReviewHeader from '@/components/review/ReviewHeader'
import { MOCK_REVIEWS } from '@/mocks'


const CURRENT_USER: Profile = {
    user_id: 'uuid-user-1',
    nickname: '여행좋아요',
    image: undefined,
    address: '서울',
}

interface ReviewSectionProps {
    festivalId: number;
}

export default function ReviewSection({ festivalId }: ReviewSectionProps) {
    return (
        <>
            <ReviewHeader reviews={MOCK_REVIEWS} />
            <ReviewForm festivalId={festivalId} />
            <ReviewList
                festivalId={festivalId}
                reviews={MOCK_REVIEWS}
                currentUserId={CURRENT_USER.user_id}
            />
        </>
    )
}