'use client'

import { Badge } from '@/components/common/Badge'
import { Button } from '@/components/common/Button'
import { Section } from '@/components/common/Section'
import { SectionHeader } from '@/components/common/SectionHeader'
import { useAuth } from '@/components/providers/AuthProvider'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

type PlannerData = {
  planner_id: number
  title: string
  start_date: string
  end_date: string
  festivals: {
    picture: string | null
  } | null
}

function SavedPlansSection() {
  const { user } = useAuth()
  const router = useRouter()
  const [plans, setPlans] = useState<PlannerData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      setLoading(false)
      return
    }

    const fetchPlans = async () => {
      try {
        const { data, error } = await supabase
          .from('planner')
          .select('planner_id, title, start_date, end_date, festivals(picture)')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(7)

        if (error) throw error
        if (data) setPlans(data as any)
      } catch (err) {
        console.error('Error fetching plans:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchPlans()
  }, [user])

  const calculateDday = (targetDateString: string) => {
    if (!targetDateString) return null
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const targetDate = new Date(targetDateString)
    targetDate.setHours(0, 0, 0, 0)

    const diffTime = targetDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays > 0) return diffDays
    return null
  }

  const formatDateRange = (start: string, end: string) => {
    if (!start || !end) return ''
    const format = (dateStr: string) => {
      const date = new Date(dateStr)
      const yy = String(date.getFullYear()).slice(2)
      const mm = String(date.getMonth() + 1).padStart(2, '0')
      const dd = String(date.getDate()).padStart(2, '0')
      return `${yy}.${mm}.${dd}`
    }
    return `${format(start)} - ${format(end)}`
  }

  return (
    <Section>
      <SectionHeader
        title="저장된 축제 플랜"
        action={
          <Button
            variant="ghost"
            size="sm"
            className="text-[var(--color-primary)] hover:underline p-0 h-auto"
          >
            전체보기 &rsaquo;
          </Button>
        }
      />
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* 새 플랜 만들기 버튼 */}
        <Button
          variant="outline"
          onClick={() => router.push('/planner/step1')}
          className="flex flex-col items-center justify-center gap-2 rounded-[var(--radius-md)] border-2 border-dashed border-[var(--color-border)] bg-white hover:border-[var(--color-primary)] hover:bg-[var(--color-primary-light)] transition-fast min-h-[180px] group h-auto p-0"
        >
          <div className="w-9 h-9 rounded-full bg-[var(--color-primary-light)] flex items-center justify-center group-hover:bg-white transition-fast">
            <svg
              className="w-5 h-5 text-[var(--color-primary)]"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4v16m8-8H4"
              />
            </svg>
          </div>
          <span className="text-xs text-[var(--color-muted)] font-medium group-hover:text-[var(--color-primary)] transition-fast">
            새 플랜 만들기
          </span>
        </Button>

        {loading ? (
          <div className="col-span-1 sm:col-span-3 min-h-[180px] flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          /* Plan Cards */
          plans.map((plan) => {
            const dday = calculateDday(plan.start_date)
            const defaultImg =
              'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=400&q=80'
            // @ts-ignore
            let img = plan.festivals?.picture || defaultImg
            // @ts-ignore
            if (plan.festivals?.picture && !plan.festivals.picture.startsWith('http')) {
              // @ts-ignore
              const { data } = supabase.storage.from('festival').getPublicUrl(plan.festivals.picture)
              img = data.publicUrl
            }

            return (
              <div
                key={plan.planner_id}
                onClick={() =>
                  router.push(`/planner/result?id=${plan.planner_id}`)
                }
                className="rounded-[var(--radius-md)] overflow-hidden border border-[var(--color-border)] bg-white card-shadow hover:card-shadow-hover transition-base cursor-pointer group flex flex-col min-h-[180px]"
              >
                <div className="relative h-[120px] overflow-hidden bg-gray-100 flex-shrink-0">
                  <img
                    src={img}
                    alt={plan.title || '나의 축제 플랜'}
                    className="w-full h-full object-cover group-hover:scale-105 transition-base"
                  />
                  {dday !== null && (
                    <span className="absolute top-2 right-2">
                      <Badge variant="live">D-{dday}</Badge>
                    </span>
                  )}
                </div>
                <div className="p-3 flex flex-col gap-1.5 flex-1 justify-center">
                  <p className="text-xs font-semibold text-[var(--color-text)] leading-tight line-clamp-1">
                    {plan.title || '나의 축제 플랜'}
                  </p>
                  <p className="text-[11px] text-[var(--color-muted)]">
                    {formatDateRange(plan.start_date, plan.end_date)}
                  </p>
                </div>
              </div>
            )
          })
        )}
      </div>
    </Section>
  )
}

export default SavedPlansSection
