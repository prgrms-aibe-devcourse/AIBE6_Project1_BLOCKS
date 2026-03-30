'use client'

import KakaoPlacePicker from '@/components/planner/KakaoPlacePicker'
import { Suspense } from 'react'
import { FestivalCard } from '@/components/planner/FestivalCard'
import { Calendar } from '@/components/planner/Calendar'
import { useStep2 } from '@/hooks/planner/useStep2'

function Step2Content() {
  const {
    festivals,
    loading,
    selectedFestivalId,
    setSelectedFestivalId,
    selectedRange,
    setSelectedRange,
    currentDate,
    setCurrentDate,
    address,
    visitDates,
    setVisitDates,
    isGenerating,
    formRef,
    handleScrollToForm,
    handlePlaceSelect,
    selectedFestival,
    getInitialOption,
    getDisplayDate,
    getDurationText,
    handleGenerate,
    router,
  } = useStep2()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-neutral-500 font-medium">
        조건에 맞는 축제 리스트를 불러오는 중입니다...
      </div>
    )
  }

  if (festivals.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <span className="material-symbols-outlined text-6xl text-neutral-300 mb-4">
          sentiment_dissatisfied
        </span>
        <h2 className="text-xl font-bold text-neutral-700 mb-2">
          조건에 맞는 축제가 없습니다.
        </h2>
        <p className="text-neutral-500 text-sm mb-6">
          다른 카테고리나 기간을 선택해보세요.
        </p>
        <button
          onClick={() => router.back()}
          className="px-6 py-3 bg-primary text-white font-bold rounded-full shadow-lg shadow-primary/20 hover:opacity-90 transition-all"
        >
          뒤로 돌아가기
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <main className="pt-10 pb-32 px-4 max-w-7xl mx-auto">
        <div className="bg-white rounded-3xl border border-[#D1D1D1] shadow-sm p-8 md:p-12">
          <header className="mb-12 flex flex-col items-center text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary-light text-primary mb-6">
              <span
                className="material-symbols-outlined mr-2 text-xl"
                style={{ fontVariationSettings: '"FILL" 1' }}
              >
                auto_awesome
              </span>
              <span className="text-sm font-semibold">AI 맞춤형 일정 추천</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-on-surface mb-4 tracking-tighter leading-tight">
              선택한 축제를 중심으로
              <br />
              AI가 <span className="text-primary italic">최적의 일정</span>을
              짜드립니다
            </h1>
            <p className="text-on-surface-variant max-w-2xl leading-relaxed">
              가고 싶은 축제를 하나 골라주세요. 기간 내에 즐길 수 있는 특별한
              명소와 코스를 설계합니다.
            </p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <section className="order-2 lg:order-1 lg:col-span-7 space-y-6">
              <h2 className="text-2xl font-bold flex items-center mb-4">
                <span className="material-symbols-outlined mr-2 text-primary">
                  festival
                </span>
                추천 축제 리스트
              </h2>
              <div className="grid gap-6">
                {festivals.map((festival) => (
                  <FestivalCard
                    key={festival.festival_id}
                    {...festival}
                    isSelected={selectedFestivalId === festival.festival_id}
                    onSelect={(id) => {
                      setSelectedFestivalId(id)
                      const selected = festivals.find(
                        (f) => f.festival_id === id,
                      )
                      if (selected) {
                        const [sy, sm] = selected.start_date
                          .split('-')
                          .map(Number)
                        setCurrentDate(new Date(sy, sm - 1, 1))
                      }
                      handleScrollToForm()
                    }}
                    onDateChange={(date) => {
                      setVisitDates((prev) => ({
                        ...prev,
                        [festival.festival_id]: date,
                      }))
                      if (selectedFestivalId === festival.festival_id) {
                        handleScrollToForm()
                      }
                    }}
                  />
                ))}
              </div>
            </section>

            <section ref={formRef} className="order-1 lg:order-2 lg:col-span-5">
              <div className="sticky top-24 space-y-4 lg:max-h-[calc(100vh-6rem)] overflow-y-auto [&::-webkit-scrollbar]:hidden pr-1">
                <div className="bg-white border border-[#D1D1D1] rounded-2xl p-5">
                  <h2 className="text-xl font-bold flex items-center mb-3">
                    <span className="material-symbols-outlined mr-2 text-primary">
                      location_on
                    </span>
                    여행 출발지
                  </h2>
                  <KakaoPlacePicker
                    selectedPlace={address}
                    onSelect={handlePlaceSelect}
                  />
                </div>

                <div className="bg-white border border-[#D1D1D1] rounded-2xl p-6 space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold flex items-center">
                      <span className="mr-2 text-primary">
                        <span className="material-symbols-outlined text-sm mr-1">
                          calendar_today
                        </span>
                      </span>
                      날짜 설정
                    </h2>
                    <span className="text-[10px] font-bold text-primary bg-primary-light px-2 py-1 rounded-full uppercase tracking-tighter italic">
                      {selectedFestival?.title || '축제'} 기간
                    </span>
                  </div>

                  <Calendar
                    selectedRange={selectedRange}
                    onRangeChange={setSelectedRange}
                    festivalRange={selectedFestival ? {
                      start_date: selectedFestival.start_date,
                      end_date: selectedFestival.end_date,
                    } : undefined}
                    currentDate={currentDate}
                    setCurrentDate={setCurrentDate}
                  />

                  <div className="pt-6 border-t border-[#D1D1D1]">
                    <div className="mb-4">
                      <p className="text-[10px] font-bold text-on-surface-variant/60 uppercase tracking-widest mb-1">
                        선택한 기간
                      </p>
                      <p className="text-xl font-bold">{getDurationText()}</p>
                      <p className="text-sm font-medium text-primary mt-2">
                        방문 예정일:{' '}
                        {getDisplayDate(visitDates[selectedFestivalId || -1] ||
                          getInitialOption(selectedFestival))}
                      </p>
                    </div>
                    <button
                      onClick={handleGenerate}
                      disabled={isGenerating || !selectedFestival}
                      className="w-full py-4 rounded-full bg-primary hover:bg-[#ff6161] disabled:bg-neutral-300 disabled:text-neutral-500 disabled:shadow-none disabled:cursor-not-allowed disabled:transform-none cursor-pointer text-white font-black text-base transition-all shadow-xl shadow-[#f26565]/20 active:scale-95 flex items-center justify-center group"
                    >
                      <span
                        className="material-symbols-outlined mr-2 group-hover:rotate-12 transition-transform"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        {isGenerating ? 'hourglass_empty' : 'auto_fix_high'}
                      </span>
                      {isGenerating
                        ? 'AI가 일정을 짜고 있습니다...'
                        : 'AI 플랜 생성하기'}
                    </button>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  )
}

export default function Step2() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          Loading...
        </div>
      }
    >
      <Step2Content />
    </Suspense>
  )
}
