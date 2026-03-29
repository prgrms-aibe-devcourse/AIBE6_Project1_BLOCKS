'use client'

import ReviewForm from '@/components/review/ReviewForm'
import ReviewList from '@/components/review/ReviewList'
import { Profile } from '@/types/profile'
import { Review } from '@/types/review'
import ReviewHeader from '@/components/review/ReviewHeader'

const MOCK_REVIEWS: Review[] = [
    {
        id: 1,
        festival_id: 1,
        user_id: 'uuid-user-1',
        contents:
            '정말 최고의 불꽃축제였어요! 여의도 한강공원에서 보는 불꽃이 이렇게 아름다울 줄 몰랐습니다. 꼭 다시 오고 싶어요.',
        pictures: ['https://picsum.photos/seed/review1/400/300'],
        like_count: 24,
        rating: 5,
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
        author: {
            user_id: 'uuid-user-1',
            nickname: '여행좋아요',
            image: undefined,
            address: '서울',
        },
    },
    {
        id: 2,
        festival_id: 1,
        user_id: 'uuid-user-2',
        contents:
            '불꽃은 정말 예쁜데 사람이 너무 많아서 이동이 힘들었어요. 일찍 가서 자리 잡는 걸 추천드립니다.',
        pictures: null,
        like_count: 8,
        rating: 4,
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
        author: {
            user_id: 'uuid-user-2',
            nickname: '축제마니아',
            image: undefined,
            address: '경기',
        },
    },
    {
        id: 3,
        festival_id: 1,
        user_id: 'uuid-user-4',
        contents:
            '매년 오고 싶은 축제입니다. 한강의 야경과 불꽃이 조화를 이루는 장면은 정말 감동적이에요.',
        pictures: [
            'https://picsum.photos/seed/review3a/400/300',
            'https://picsum.photos/seed/review3b/400/300',
        ],
        like_count: 41,
        rating: 5,
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
        author: {
            user_id: 'uuid-user-4',
            nickname: '힐링여행',
            image: undefined,
            address: '부산',
        },
        /*comments: [
              {
                id: "c3",
                reviewId: 3,
                author: {
                  user_id: "uuid-user-1",
                  nickname: "여행좋아요",
                  image: undefined,
                },
                content: "동감이에요! 매년 꼭 가는 축제가 됐어요 ㅎㅎ",
                createdAt: new Date(Date.now() - 1000 * 60 * 60 * 40).toISOString(),
              },
            ],*/
    },
]

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