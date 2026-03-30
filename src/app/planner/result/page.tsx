'use client'

import { Suspense } from 'react'
import { useResult } from '@/hooks/planner/useResult'
import { PlanSummaryCard } from '@/components/planner/PlanSummaryCard'
import { DaySchedule } from '@/components/planner/DaySchedule'
import { PlanModal } from '@/components/planner/PlanModal'

function ResultContent() {
  const {
    plannerId,
    planner,
    plans,
    loading,
    errorMsg,
    isModalOpen,
    setIsModalOpen,
    modalMode,
    formData,
    setFormData,
    collapsedDays,
    toggleDay,
    handleSave,
    handleOpenAdd,
    handleOpenEdit,
    handleDelete
  } = useResult()

  if (!plannerId)
    return (
      <div className="min-h-screen flex items-center justify-center">
        플랜 ID가 없습니다.
      </div>
    )
  if (errorMsg)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <span className="material-symbols-outlined text-4xl text-red-500 mb-2">error</span>
        <h2 className="text-xl font-bold text-[#171717] mb-2">데이터 로드에 실패했습니다.</h2>
        <p className="text-neutral-500 mb-6 max-w-md break-keep">
          상세 오류: {errorMsg}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-primary text-white font-bold rounded-full shadow-lg hover:opacity-90 transition-all cursor-pointer"
        >
          새로고침
        </button>
      </div>
    )
  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f5f5]">
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
          <span className="text-neutral-500 font-bold">데이터를 불러오는 중입니다...</span>
        </div>
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
          <aside className="lg:col-span-4 space-y-6">
            <PlanSummaryCard planner={planner} totalDays={totalDays} />
          </aside>

          <section className="lg:col-span-8 space-y-12">
            {daysArray.map((dayNum) => {
              const dayPlans = plans.filter((p) => p.day === dayNum)

              const currentDayDate = new Date(startD)
              if (!isNaN(currentDayDate.getTime())) {
                currentDayDate.setDate(currentDayDate.getDate() + dayNum - 1)
              }

              const isCollapsed = collapsedDays.includes(dayNum)

              return (
                <DaySchedule
                  key={dayNum}
                  dayNum={dayNum}
                  dayPlans={dayPlans}
                  currentDayDate={currentDayDate}
                  isCollapsed={isCollapsed}
                  toggleDay={toggleDay}
                  handleOpenEdit={handleOpenEdit}
                  handleDelete={handleDelete}
                  handleOpenAdd={handleOpenAdd}
                />
              )
            })}
          </section>
        </div>
      </main>

      <PlanModal
        isOpen={isModalOpen}
        mode={modalMode}
        formData={formData}
        setFormData={setFormData}
        onSave={handleSave}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  )
}

export default function Result() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center text-[#171717] bg-[#f5f5f5]">
          <span className="text-neutral-500 font-bold">페이지 준비 중(Suspense)...</span>
        </div>
      }
    >
      <ResultContent />
    </Suspense>
  )
}
