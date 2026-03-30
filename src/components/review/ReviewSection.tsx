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
    const { profile } = useAuth()
    const [reviews, setReviews] = useState<Review[]>([])
    const [loading, setLoading] = useState(true)

    const fetchReviews = useCallback(async () => {
        setLoading(true)
        const { data, error } = await supabase
            .from('reviews')
            .select(`
                *,
                author:profiles!reviews_user_id_fkey (user_id, nickname, picture, address)
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

    const handleDeleteReview = async (reviewId: number) => {
        const { error } = await supabase
            .from('reviews')
            .delete()
            .eq('id', reviewId)

        if (error) {
            console.error('리뷰 삭제 오류:', error.message)
            alert('리뷰를 삭제하는 데 실패했습니다.')
        } else {
            // 로컬 상태 업데이트 (목록에서 제거)
            setReviews(prev => prev.filter(r => r.id !== reviewId))
        }
    }

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
                    currentUserId={profile?.user_id ?? ''}
                    onDeleteReview={handleDeleteReview}
                />
            )}
        </>
    )
}