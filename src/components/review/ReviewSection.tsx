'use client'

import { useEffect, useState, useCallback } from 'react'
import ReviewForm from '@/components/review/ReviewForm'
import ReviewList from '@/components/review/ReviewList'
import ReviewHeader from '@/components/review/ReviewHeader'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/components/providers/AuthProvider'
import { Review } from '@/types/review'

interface ReviewSectionProps {
    festivalId: number;
}

export default function ReviewSection({ festivalId }: ReviewSectionProps) {
    const { user } = useAuth()
    const [reviews, setReviews] = useState<Review[]>([])
    const [loading, setLoading] = useState(true)

    const fetchReviews = useCallback(async () => {
        setLoading(true)
        const { data, error } = await supabase
            .from('reviews')
            .select(`
                id,
                festival_id,
                user_id,
                contents,
                pictures,
                like_count,
                rating,
                created_at,
                author:profiles (
                    user_id,
                    nickname,
                    address
                )
            `)
            .eq('festival_id', festivalId)
            .order('created_at', { ascending: false })

        if (error) {
            console.error('리뷰 조회 오류:', error.message)
            setReviews([])
        } else {
            const mapped = (data ?? []).map((row: any) => ({
                ...row,
                author: { ...row.author, image: undefined },
            })) as Review[]
            setReviews(mapped)
        }
        setLoading(false)
    }, [festivalId])

    useEffect(() => {
        fetchReviews()
    }, [fetchReviews])

    return (
        <>
            <ReviewHeader reviews={reviews} />
            <ReviewForm festivalId={festivalId} onReviewAdded={fetchReviews} />
            {loading ? (
                <div className="flex justify-center py-10">
                    <div className="w-6 h-6 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
                </div>
            ) : (
                <ReviewList
                    festivalId={festivalId}
                    reviews={reviews}
                    currentUserId={user?.id ?? ''}
                />
            )}
        </>
    )
}