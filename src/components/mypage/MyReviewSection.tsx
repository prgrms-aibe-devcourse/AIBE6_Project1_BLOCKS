'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/components/providers/AuthProvider'
import { supabase } from '@/lib/supabase'
import { Section } from '@/components/common/Section'
import { SectionHeader } from '@/components/common/SectionHeader'
import Button from '@/components/common/Button'
import { Review } from '@/types/review'
import { getImageUrl } from '@/utils/getImageUrl'
import { formatDate } from '@/utils/formatDate'
import StarRating from '../common/StarRating'


interface ReviewWithFestival extends Review {
    festival: {
        title: string
        picture: string
    } | null
}

const PAGE_SIZE = 5


function MyReviewSection() {
    const { profile } = useAuth()
    const [tab, setTab] = useState<'mine' | 'liked'>('mine')
    const [reviews, setReviews] = useState<ReviewWithFestival[]>([])
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(0)
    const [hasMore, setHasMore] = useState(false)

    useEffect(() => {
        if (!profile?.user_id) return

        const fetchReviews = async () => {
            setLoading(true)
            const { data, error } = await supabase
                .from('reviews')
                .select('*, festival:festivals(title, picture)')
                .eq('user_id', profile.user_id)
                .order('created_at', { ascending: false })
                .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1)

            if (error) {
                console.error('리뷰 조회 오류:', error.message)
            } else {
                const fetched = (data ?? []) as unknown as ReviewWithFestival[]
                setReviews(prev => page === 0 ? fetched : [...prev, ...fetched])
                setHasMore(fetched.length === PAGE_SIZE)
            }
            setLoading(false)
        }

        fetchReviews()
    }, [profile?.user_id, page])



    return (
        <Section>
            <SectionHeader title="리뷰 및 활동" />

            {/* Tabs */}
            <div className="flex gap-5 border-b border-[var(--color-border)] mb-5 -mt-1">
                {[
                    { key: 'mine', label: '내 리뷰', count: reviews.length },
                ].map(t => (
                    <button
                        key={t.key}
                        onClick={() => setTab(t.key as 'mine' | 'liked')}
                        className={`pb-3 text-sm font-medium transition-fast relative ${tab === t.key
                            ? 'text-[var(--color-neutral-900)]'
                            : 'text-[var(--color-neutral-400)] hover:text-[var(--color-neutral-700)]'
                            }`}
                    >
                        {t.label}
                        <span className={`ml-1.5 text-xs font-semibold ${tab === t.key ? 'text-[var(--color-primary)]' : 'text-[var(--color-neutral-400)]'}`}>
                            ({t.count})
                        </span>
                        {tab === t.key && (
                            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--color-primary)] rounded-full" />
                        )}
                    </button>
                ))}
            </div>

            {/* 로딩 스켈레톤 */}
            {loading && reviews.length === 0 && (
                <div className="flex flex-col gap-3">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="flex gap-3 p-4 rounded-[var(--radius-md)] border border-[var(--color-border)]">
                            <div className="skeleton w-14 h-14 rounded-[var(--radius-sm)] shrink-0" />
                            <div className="flex-1 flex flex-col gap-2">
                                <div className="skeleton h-3 w-1/3" />
                                <div className="skeleton h-2.5 w-full" />
                                <div className="skeleton h-2.5 w-2/3" />
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* 리뷰 없을 때 */}
            {!loading && reviews.length === 0 && (
                <div className="flex justify-center items-center py-12 text-xs text-[var(--color-muted)]">
                    아직 작성한 리뷰가 없어요.
                </div>
            )}

            {/* Review List */}
            <div className="flex flex-col gap-3">
                {reviews.map(review => (
                    <div
                        key={review.id}
                        className="flex gap-3 p-4 rounded-[var(--radius-md)] bg-[var(--color-primary-light)] border border-[rgba(242,101,101,0.1)]"
                    >
                        {/* 축제 이미지 */}
                        <div className="w-14 h-14 rounded-[var(--radius-sm)] overflow-hidden shrink-0 bg-[var(--color-neutral-100)]">
                            {review.festival?.picture ? (
                                <img
                                    src={getImageUrl(review.festival.picture)}
                                    alt={review.festival.title}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-[var(--color-neutral-200)]" />
                            )}
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                                <div>
                                    <p className="text-sm font-semibold text-[var(--color-neutral-900)]">
                                        {review.festival?.title ?? '축제'}
                                    </p>
                                    <StarRating rating={review.rating} />
                                </div>
                                <span className="text-[11px] text-[var(--color-neutral-400)] shrink-0">
                                    {formatDate(review.created_at)}
                                </span>
                            </div>
                            <p className="text-xs text-[var(--color-neutral-700)] mt-1.5 leading-relaxed line-clamp-2">
                                {review.contents}
                            </p>
                            <div className="flex items-center gap-3 mt-2">
                                <span className="flex items-center gap-1 text-[11px] text-[var(--color-neutral-500)]">
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                                    </svg>
                                    {review.like_count}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* 더보기 */}
            {hasMore && (
                <div className="mt-4 flex justify-center">
                    <Button variant="ghost" size="md" onClick={() => setPage(prev => prev + 1)} loading={loading}>
                        리뷰 더보기
                    </Button>
                </div>
            )}
        </Section>
    )
}

export default MyReviewSection