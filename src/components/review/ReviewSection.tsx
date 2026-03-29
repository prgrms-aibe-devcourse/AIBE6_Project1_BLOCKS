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

export default function ReviewSection() {
    return (
        <>
            <ReviewHeader reviews={MOCK_REVIEWS} />
            <ReviewForm />
            <ReviewList
                festivalId="1"
                reviews={MOCK_REVIEWS}
                currentUserId={CURRENT_USER.user_id}
            />
        </>
    )
}