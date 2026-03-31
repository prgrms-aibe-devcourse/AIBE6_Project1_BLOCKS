'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/components/providers/AuthProvider'
import { supabase } from '@/lib/supabase'
import { Section } from '@/components/common/Section'
import { SectionHeader } from '@/components/common/SectionHeader'
import { Badge } from '@/components/common/Badge'
import { Button } from '@/components/common/Button'
import { useRouter } from 'next/navigation'

interface PlanWithFestival {
    planner_id: number
    title: string
    start_date: string
    end_date: string
    festival: {
        picture: string
        option1: string
    }
}

/* D-day 계산 */
function calcDday(startDate: string): number | null {
    const diff = Math.ceil(
        (new Date(startDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    )
    return diff >= 0 ? diff : null  // 지난 플랜은 null
}

/* 날짜 포맷 */
function formatDate(date: string) {
    return new Date(date).toLocaleDateString('ko-KR', {
        year: 'numeric', month: '2-digit', day: '2-digit'
    }).replace(/\. /g, '.').replace(/\.$/, '')
}

function SavedPlansSection() {
    const router = useRouter()
    const { profile } = useAuth()
    const [plans, setPlans] = useState<PlanWithFestival[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!profile?.user_id) return

        const fetchPlans = async () => {
            setLoading(true)
            const { data, error } = await supabase
                .from('planner')
                .select('planner_id, title, start_date, end_date, festival:festivals!planner_festival_id_fkey(picture, option1)')
                .eq('user_id', profile.user_id)
                .order('start_date', { ascending: true })
                .limit(3)   // 카드 3개까지만 표시

            if (error) {
                console.error('플랜 조회 오류:', error.message)
            } else {
                setPlans((data ?? []) as unknown as PlanWithFestival[])
            }
            setLoading(false)
        }

        fetchPlans()
    }, [profile?.user_id])

    return (
        <Section>
            <SectionHeader
                title="저장된 축제 플랜"
                action={
                    <Button variant="ghost" size="sm" className="text-[var(--color-primary)] hover:underline p-0 h-auto">
                        전체보기 &rsaquo;
                    </Button>
                }
            />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {/* 새 플랜 만들기 버튼 */}
                <Button
                    variant="outline"
                    className="flex flex-col items-center justify-center gap-2 rounded-[var(--radius-md)] border-2 border-dashed border-[var(--color-border)] bg-white hover:border-[var(--color-primary)] hover:bg-[var(--color-primary-light)] transition-fast min-h-[180px] group h-auto p-0"
                    onClick={() => router.push('/planner/step1')}
                >
                    <div className="w-9 h-9 rounded-full bg-[var(--color-primary-light)] flex items-center justify-center group-hover:bg-white transition-fast">
                        <svg className="w-5 h-5 text-[var(--color-primary)]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                        </svg>
                    </div>
                    <span className="text-xs text-[var(--color-muted)] font-medium group-hover:text-[var(--color-primary)] transition-fast">새 플랜 만들기</span>
                </Button>

                {/* 로딩 스켈레톤 */}
                {loading && Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="rounded-[var(--radius-md)] overflow-hidden border border-[var(--color-border)]">
                        <div className="skeleton h-[120px]" />
                        <div className="p-3 flex flex-col gap-2">
                            <div className="skeleton h-3 w-3/4" />
                            <div className="skeleton h-2.5 w-1/2" />
                        </div>
                    </div>
                ))}

                {/* 플랜 없을 때 */}
                {!loading && plans.length === 0 && (
                    <div className="col-span-3 flex items-center justify-center text-xs text-[var(--color-muted)] py-10">
                        저장된 플랜이 없어요. 새 플랜을 만들어보세요!
                    </div>
                )}

                {/* Plan Cards */}
                {!loading && plans.map(plan => {
                    const dday = calcDday(plan.start_date)
                    const tags = plan.festival?.option1 ? [plan.festival.option1] : []

                    return (
                        <div
                            key={plan.planner_id}
                            className="rounded-[var(--radius-md)] overflow-hidden border border-[var(--color-border)] bg-white card-shadow hover:card-shadow-hover transition-base cursor-pointer group"
                            onClick={() => router.push(`/planner/result?id=${plan.planner_id}`)}
                        >
                            <div className="relative h-[120px] overflow-hidden">
                                <img
                                    src={plan.festival?.picture ?? '/placeholder.png'}
                                    alt={plan.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-base"
                                />
                                {dday !== null && (
                                    <span className="absolute top-2 right-2">
                                        <Badge variant="live">D-{dday}</Badge>
                                    </span>
                                )}
                            </div>
                            <div className="p-3 flex flex-col gap-1.5">
                                <p className="text-xs font-semibold text-[var(--color-text)] leading-tight line-clamp-1">{plan.title}</p>
                                <p className="text-[11px] text-[var(--color-muted)]">
                                    {formatDate(plan.start_date)} - {formatDate(plan.end_date)}
                                </p>
                                <div className="flex flex-wrap gap-1 mt-0.5">
                                    {tags.map(tag => (
                                        <Badge key={tag} variant="primary">{tag}</Badge>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </Section>
    )
}

export default SavedPlansSection