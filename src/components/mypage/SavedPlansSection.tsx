import { Section } from "@/components/common/Section";
import { SectionHeader } from "@/components/common/SectionHeader";
import { Badge } from "@/components/common/Badge";

/* ── Mock Data ── */
const PLANS = [
    {
        id: 1,
        title: '서울 연등회 투어',
        date: '2024.05.15 - 05.17',
        tags: ['3인 가족', '전통체험'],
        dday: 12,
        img: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=400&q=80',
    },
    {
        id: 2,
        title: '궁중문화축전 나들이',
        date: '2024.04.28 - 04.29',
        tags: ['데이트', '한복'],
        img: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=400&q=80',
    },
    {
        id: 3,
        title: '인천 펜타포트 락 페스',
        date: '2024.08.02 - 08.04',
        tags: ['친구와 함께', '음악'],
        img: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&q=80',
    },
]

function SavedPlansSection() {
    return (
        <Section>
            <SectionHeader
                title="저장된 축제 플랜"
                action={
                    <button className="text-xs text-[var(--color-primary)] font-medium hover:underline transition-fast">
                        전체보기 &rsaquo;
                    </button>
                }
            />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {/* New Plan button */}
                <button className="flex flex-col items-center justify-center gap-2 rounded-[var(--radius-md)] border-2 border-dashed border-[var(--color-neutral-200)] bg-white hover:border-[var(--color-primary)] hover:bg-[var(--color-primary-light)] transition-fast min-h-[180px] group">
                    <div className="w-9 h-9 rounded-full bg-[var(--color-primary-light)] flex items-center justify-center group-hover:bg-white transition-fast">
                        <svg className="w-5 h-5 text-[var(--color-primary)]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                        </svg>
                    </div>
                    <span className="text-xs text-[var(--color-neutral-500)] font-medium group-hover:text-[var(--color-primary)] transition-fast">새 플랜 만들기</span>
                </button>

                {/* Plan Cards */}
                {PLANS.map(plan => (
                    <div
                        key={plan.id}
                        className="rounded-[var(--radius-md)] overflow-hidden border border-[var(--color-border)] bg-white card-shadow hover:card-shadow-hover transition-base cursor-pointer group"
                    >
                        <div className="relative h-[120px] overflow-hidden">
                            <img
                                src={plan.img}
                                alt={plan.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-base"
                            />
                            {plan.dday && (
                                <span className="absolute top-2 right-2">
                                    <Badge variant="live">D-{plan.dday}</Badge>
                                </span>
                            )}
                        </div>
                        <div className="p-3 flex flex-col gap-1.5">
                            <p className="text-xs font-semibold text-[var(--color-neutral-900)] leading-tight line-clamp-1">{plan.title}</p>
                            <p className="text-[11px] text-[var(--color-neutral-500)]">{plan.date}</p>
                            <div className="flex flex-wrap gap-1 mt-0.5">
                                {plan.tags.map(tag => (
                                    <Badge key={tag} variant="primary">{tag}</Badge>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </Section>
    )
}

export default SavedPlansSection