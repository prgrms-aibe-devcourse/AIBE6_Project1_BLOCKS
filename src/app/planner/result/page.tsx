'use client'

import { supabase } from '@/lib/supabase'
import { useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'

function ResultContent() {
  const searchParams = useSearchParams()
  const plannerId = searchParams.get('id')

  const [planner, setPlanner] = useState<any>(null)
  const [plans, setPlans] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Folding State
  const [collapsedDays, setCollapsedDays] = useState<number[]>([])

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add')
  const [editingPlan, setEditingPlan] = useState<any>(null)
  const [formData, setFormData] = useState({
    day: 1,
    start_time: '10:00',
    emd_time: '12:00',
    place: '',
    contents: '',
  })

  useEffect(() => {
    if (!plannerId) return
    fetchData()
  }, [plannerId])

  const fetchData = async () => {
    setLoading(true)
    const { data: plannerData } = await supabase
      .from('planner')
      .select('*')
      .eq('planner_id', plannerId)
      .single()
    const { data: plansData } = await supabase
      .from('plans')
      .select('*')
      .eq('planner_id', plannerId)
      .order('day')
      .order('start_time')

    setPlanner(plannerData)
    setPlans(plansData || [])
    setLoading(false)
  }

  const handleDelete = async (planId: number) => {
    if (!confirm('정말 삭제하시겠습니까?')) return
    await supabase.from('plans').delete().eq('plan_id', planId)
    fetchData()
  }

  const handleOpenAdd = (day: number) => {
    setModalMode('add')
    setFormData({
      day,
      start_time: '12:00',
      emd_time: '13:00',
      place: '',
      contents: '',
    })
    setIsModalOpen(true)
  }

  const handleOpenEdit = (plan: any) => {
    setModalMode('edit')
    setEditingPlan(plan)
    const st = plan.start_time ? plan.start_time.substring(0, 5) : ''
    const et = plan.emd_time ? plan.emd_time.substring(0, 5) : ''
    setFormData({
      day: plan.day,
      start_time: st,
      emd_time: et,
      place: plan.place,
      contents: plan.contents,
    })
    setIsModalOpen(true)
  }

  const handleSave = async () => {
    if (!formData.place) return alert('장소명을 입력해주세요.')

    const { day, start_time, emd_time, place, contents } = formData
    const formattedStart = `${start_time}:00+09:00`
    const formattedEnd = `${emd_time}:00+09:00`

    if (modalMode === 'add') {
      await supabase.from('plans').insert({
        planner_id: plannerId,
        day,
        start_time: formattedStart,
        emd_time: formattedEnd,
        place,
        contents,
      })
    } else {
      await supabase
        .from('plans')
        .update({
          day,
          start_time: formattedStart,
          emd_time: formattedEnd,
          place,
          contents,
        })
        .eq('plan_id', editingPlan.plan_id)
    }

    setIsModalOpen(false)
    fetchData()
  }

  const toggleDay = (dayNum: number) => {
    setCollapsedDays((prev) =>
      prev.includes(dayNum) ? prev.filter((d) => d !== dayNum) : [...prev, dayNum]
    )
  }

  if (!plannerId)
    return (
      <div className="min-h-screen flex items-center justify-center">
        플랜 ID가 없습니다.
      </div>
    )
  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    )
  if (!planner)
    return (
      <div className="min-h-screen flex items-center justify-center">
        플랜을 찾을 수 없습니다.
      </div>
    )

  const startD = new Date(planner.start_date)
  const endD = new Date(planner.end_date)
  let totalDays =
    Math.ceil((endD.getTime() - startD.getTime()) / (1000 * 60 * 60 * 24)) + 1
  if (isNaN(totalDays) || totalDays < 1) totalDays = 1

  const daysArray = Array.from({ length: totalDays }, (_, i) => i + 1)

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <main className="pt-10 pb-32 px-4 max-w-7xl mx-auto">
        <header className="mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-light rounded-full mb-4 shadow-sm border border-primary/10">
            <span
              className="material-symbols-outlined text-primary text-sm"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              auto_awesome
            </span>
            <span className="text-primary text-xs font-bold tracking-wider uppercase">
              AI Recommendation
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#171717] tracking-tight leading-tight">
            AI가 추천하는 <br className="md:hidden" />
            <span className="text-primary">최적의 여행 플랜</span>
          </h1>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Sidebar: Summary Card */}
          <aside className="lg:col-span-4 space-y-6">
            <div className="bg-white p-8 rounded-xl border border-[#ebebeb] shadow-sm sticky top-28">
              <div className="aspect-[4/3] rounded-lg overflow-hidden mb-6">
                <img
                  alt="vibrant traditional korean festival with colorful lanterns"
                  className="w-full h-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBZqv8pgUBfv4NQ68r894LVsw56erH8K-EQ7-THJ8Am4RpqqmbJA_t7yLCeVbG5KH9GkkGTsxtVEbVD290epNvzgfrxICy7mpkE5hBmaJtno4WGWHUcO81jw3-_YsWUpElwXdgBs45KFtwdI5i-MA-iZZfy-yKOyvxEyMQ_6IHmFq8EWtnKnzlaL8sG8qomhmnoWEqMc3NnNt8lhg_6-rhERoemQzlEQpqwkgqYZuIYwOOaSBDYYfF_QnJ2rT0G9CtR6M5tgL0F03w"
                />
              </div>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-[#171717]">
                <span className="material-symbols-outlined text-primary">
                  event_available
                </span>
                여행 요약
              </h2>
              <div className="space-y-6">
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">
                    여행 제목
                  </span>
                  <span className="text-lg font-semibold text-[#171717]">
                    {planner.title}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">
                    선택 범위
                  </span>
                  <span className="text-lg font-semibold text-primary">
                    AI 커스텀 플랜
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">
                    기간
                  </span>
                  <span className="text-lg font-semibold text-[#171717]">
                    {planner.start_date && planner.end_date
                      ? `${planner.start_date.replace(/-/g, '.')} - ${planner.end_date.replace(/-/g, '.')} (${totalDays - 1}박 ${totalDays}일)`
                      : '날짜 미지정'}
                  </span>
                </div>
              </div>
              <div className="mt-8 pt-8 border-t border-[#ebebeb]">
                <div className="flex items-center justify-between text-neutral-500 mb-4">
                  <span className="text-sm">예상 이동 거리</span>
                  <span className="font-bold text-[#171717]">
                    {planner.distance || '0km'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-neutral-500">
                  <span className="text-sm">AI 신뢰도</span>
                  <span className="font-bold text-primary">
                    {planner.confidence || '98%'}
                  </span>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content: Timeline */}
          <section className="lg:col-span-8 space-y-12">
            {daysArray.map((dayNum) => {
              const dayPlans = plans.filter((p) => p.day === dayNum)

              const currentDayDate = new Date(startD)
              if (!isNaN(currentDayDate.getTime())) {
                currentDayDate.setDate(currentDayDate.getDate() + dayNum - 1)
              }

              const isCollapsed = collapsedDays.includes(dayNum)

              return (
                <div key={dayNum} className="relative bg-white p-6 rounded-2xl shadow-sm border border-[#ebebeb]">
                  {/* Day Header */}
                  <div
                    className="flex items-center gap-4 cursor-pointer group"
                    onClick={() => toggleDay(dayNum)}
                  >
                    <div className="bg-primary text-white w-16 h-16 rounded-2xl flex flex-col items-center justify-center shadow-lg shadow-primary/20 shrink-0 transition-transform group-hover:scale-105">
                      <span className="text-[10px] font-bold">DAY</span>
                      <span className="text-2xl font-black">
                        {String(dayNum).padStart(2, '0')}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-[#171717] group-hover:text-primary transition-colors">
                        DAY {dayNum} 스케줄
                      </h3>
                      <p className="text-neutral-500 text-sm">
                        {!isNaN(currentDayDate.getTime())
                          ? `${currentDayDate.getFullYear()}년 ${currentDayDate.getMonth() + 1}월 ${currentDayDate.getDate()}일`
                          : ''}
                      </p>
                    </div>
                    <div className="ml-auto">
                      <span className="material-symbols-outlined text-3xl text-neutral-300 group-hover:text-primary transition-colors">
                        {isCollapsed ? 'expand_more' : 'expand_less'}
                      </span>
                    </div>
                  </div>

                  {/* Day Contents */}
                  <div
                    className={`transition-all duration-300 overflow-hidden ${
                      isCollapsed ? 'max-h-0 opacity-0' : 'max-h-[5000px] opacity-100 mt-8'
                    }`}
                  >
                    <div className="space-y-6 relative ml-8 border-l-2 border-dashed border-[#ebebeb] pl-8 pb-4">
                      {dayPlans.map((plan, idx) => (
                        <div
                          key={plan.plan_id}
                          className="bg-white p-5 rounded-xl border border-[#ebebeb] group hover:shadow-md hover:border-primary/30 transition-all duration-300 relative"
                        >
                          <div className="absolute -left-[41px] top-8 w-4 h-4 rounded-full bg-primary ring-4 ring-white"></div>
                          
                          <div className="flex flex-col gap-3">
                            {/* Card Header (Time, Place, Buttons) */}
                            <div className="flex justify-between items-start gap-4">
                              <div>
                                <span className="text-sm font-bold text-primary mb-1 block">
                                  {plan.start_time
                                    ? plan.start_time.substring(0, 5)
                                    : ''}{' '}
                                  -{' '}
                                  {plan.emd_time
                                    ? plan.emd_time.substring(0, 5)
                                    : ''}
                                </span>
                                <h4 className="text-lg font-bold text-[#171717]">
                                  {plan.place}
                                </h4>
                              </div>
                              <div className="flex gap-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity shrink-0">
                                <button
                                  onClick={() => handleOpenEdit(plan)}
                                  className="p-2 hover:bg-neutral-100 rounded-lg text-neutral-400 hover:text-primary transition-colors"
                                >
                                  <span className="material-symbols-outlined text-xl">
                                    edit
                                  </span>
                                </button>
                                <button
                                  onClick={() => handleDelete(plan.plan_id)}
                                  className="p-2 hover:bg-red-50 rounded-lg text-red-500 transition-colors"
                                >
                                  <span className="material-symbols-outlined text-xl">
                                    delete
                                  </span>
                                </button>
                              </div>
                            </div>

                            {/* Card Body (Contents) */}
                            {plan.contents && (
                              <div className="bg-[#fcfcfc] p-4 rounded-lg border border-neutral-100">
                                <p className="text-neutral-500 text-sm leading-relaxed whitespace-pre-wrap">
                                  {plan.contents}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}

                      <button
                        onClick={() => handleOpenAdd(dayNum)}
                        className="flex items-center gap-2 px-6 py-4 rounded-xl border-2 border-dashed border-primary/30 text-primary font-bold w-full justify-center hover:bg-primary/5 transition-colors group"
                      >
                        <span className="material-symbols-outlined group-hover:scale-110 transition-transform">
                          add_circle
                        </span>
                        일정 추가하기
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </section>
        </div>
      </main>

      {/* CRUD Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl relative">
            <h3 className="text-xl font-bold mb-4 text-[#171717]">
              {modalMode === 'add' ? '일정 추가' : '일정 수정'} (DAY{' '}
              {formData.day})
            </h3>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-xs font-bold text-neutral-500 mb-1">
                    시작 시간
                  </label>
                  <input
                    type="time"
                    className="w-full border border-[#ebebeb] rounded-lg p-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary text-[#171717]"
                    value={formData.start_time}
                    onChange={(e) =>
                      setFormData({ ...formData, start_time: e.target.value })
                    }
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-bold text-neutral-500 mb-1">
                    종료 시간
                  </label>
                  <input
                    type="time"
                    className="w-full border border-[#ebebeb] rounded-lg p-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary text-[#171717]"
                    value={formData.emd_time}
                    onChange={(e) =>
                      setFormData({ ...formData, emd_time: e.target.value })
                    }
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-neutral-500 mb-1">
                  장소명
                </label>
                <input
                  type="text"
                  className="w-full border border-[#ebebeb] rounded-lg p-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary text-[#171717]"
                  placeholder="예: 안동역"
                  value={formData.place}
                  onChange={(e) =>
                    setFormData({ ...formData, place: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-neutral-500 mb-1">
                  상세 내용
                </label>
                <textarea
                  rows={3}
                  className="w-full border border-[#ebebeb] rounded-lg p-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary resize-none text-[#171717]"
                  placeholder="일정 상세 내용을 적어주세요"
                  value={formData.contents}
                  onChange={(e) =>
                    setFormData({ ...formData, contents: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="flex gap-2 mt-6">
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex-1 py-3 bg-neutral-100 font-bold rounded-xl text-neutral-500 hover:bg-neutral-200"
              >
                취소
              </button>
              <button
                onClick={handleSave}
                className="flex-1 py-3 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:bg-primary-dark"
              >
                저장
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function Result() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center text-[#171717] bg-[#f5f5f5]">
          Loading...
        </div>
      }
    >
      <ResultContent />
    </Suspense>
  )
}
