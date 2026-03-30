import { Section } from "@/components/common/Section"
import { SectionHeader } from "@/components/common/SectionHeader"
import { useState } from "react"
import Button from "@/components/common/Button";

const REVIEWS = [
    {
        id: 1,
        festival: '진주남강유등축제',
        date: '2024.03.12',
        rating: 5,
        text: '밤에 보는 유등이 정말 환상적이었어요! 셔틀버스가 잘 되어 있어서 이동하기 편했습니다. 내년에도 꼭 다시 방문하고 싶네요. 아이들과 함께 가기에도 좋은 곳입니다.',
        likes: 24,
        comments: 5,
        img: 'https://images.unsplash.com/photo-1560969184-10fe8719e047?w=100&q=80',
    },
    {
        id: 2,
        festival: '보령 머드 축제',
        date: '2024.02.05',
        rating: 4,
        text: '사람이 조금 많긴 했지만 에너지가 넘치는 축제였어요! 머드 마사지 존이 제일 재밌었습니다. 간이 샤워시설이 조금 더 깨끗했으면 좋겠어요.',
        likes: 18,
        comments: 2,
        img: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=100&q=80',
    },
]

/* ── Star Rating ── */
function Stars({ count, max = 5 }: { count: number; max?: number }) {
    return (
        <div className="flex gap-0.5">
            {Array.from({ length: max }).map((_, i) => (
                <svg
                    key={i}
                    className="w-3.5 h-3.5"
                    fill={i < count ? 'var(--color-star)' : 'none'}
                    stroke={i < count ? 'var(--color-star)' : 'var(--color-neutral-300)'}
                    strokeWidth={1.5}
                    viewBox="0 0 24 24"
                >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
            ))}
        </div>
    )
}


function MyReviewSection() {
    const [tab, setTab] = useState<'mine' | 'liked'>('mine')

    return (
        <Section>
            <SectionHeader title="리뷰 및 활동" />

            {/* Tabs */}
            <div className="flex gap-5 border-b border-[var(--color-border)] mb-5 -mt-1">
                {[
                    { key: 'mine', label: '내 리뷰', count: 12 },
                    { key: 'liked', label: '좋아요 표시한 리뷰', count: 45 },
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

            {/* Review List */}
            <div className="flex flex-col gap-3">
                {REVIEWS.map(review => (
                    <div
                        key={review.id}
                        className="flex gap-3 p-4 rounded-[var(--radius-md)] bg-[var(--color-primary-light)] border border-[rgba(242,101,101,0.1)]"
                    >
                        <div className="w-14 h-14 rounded-[var(--radius-sm)] overflow-hidden shrink-0">
                            <img src={review.img} alt={review.festival} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                                <div>
                                    <p className="text-sm font-semibold text-[var(--color-neutral-900)]">{review.festival}</p>
                                    <Stars count={review.rating} />
                                </div>
                                <span className="text-[11px] text-[var(--color-neutral-400)] shrink-0">{review.date}</span>
                            </div>
                            <p className="text-xs text-[var(--color-neutral-700)] mt-1.5 leading-relaxed line-clamp-2">{review.text}</p>
                            <div className="flex items-center gap-3 mt-2">
                                <button className="flex items-center gap-1 text-[11px] text-[var(--color-neutral-500)] hover:text-[var(--color-primary)] transition-fast">
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                                    </svg>
                                    {review.likes}
                                </button>
                                <button className="flex items-center gap-1 text-[11px] text-[var(--color-neutral-500)] hover:text-[var(--color-primary)] transition-fast">
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                                    </svg>
                                    {review.comments}
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Load More */}
            <div className="mt-4 flex justify-center">
                <Button variant="ghost" size="md">리뷰 더보기</Button>
            </div>
        </Section>
    )
}

export default MyReviewSection