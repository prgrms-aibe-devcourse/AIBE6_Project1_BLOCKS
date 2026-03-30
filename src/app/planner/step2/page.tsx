'use client'

import KakaoPlacePicker from '@/components/planner/KakaoPlacePicker'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useRef, useState } from 'react'
import { useAuth } from '@/components/providers/AuthProvider'

interface FestivalCardProps {
  festival_id: number
  title: string
  rating: number
  contents: string
  start_date: string
  end_date: string
  picture: string
  isSelected: boolean
  onSelect: (id: number) => void
  onDateChange?: (date: string) => void
}

const FestivalCard = ({
  festival_id,
  title,
  rating,
  contents,
  start_date,
  end_date,
  picture,
  isSelected,
  onSelect,
  onDateChange,
}: FestivalCardProps) => {
  const start = new Date(start_date)
  const end = new Date(end_date)
  const options: { label: string; value: string }[] = []

  const daysOfWeek = ['일', '월', '화', '수', '목', '금', '토']

  const currentDate = new Date(start)
  while (currentDate <= end) {
    const month = String(currentDate.getMonth() + 1).padStart(2, '0')
    const date = String(currentDate.getDate()).padStart(2, '0')
    const day = daysOfWeek[currentDate.getDay()]
    const yyyy = currentDate.getFullYear()
    
    options.push({
      label: `${month}.${date} (${day})`,
      value: `${yyyy}-${month}-${date}`
    })
    currentDate.setDate(currentDate.getDate() + 1)
  }

  const dateRange = `${start_date.split('-').slice(1).join('.')} - ${end_date.split('-').slice(1).join('.')}`

  const [selectedDate, setSelectedDate] = useState(options[0]?.value || '')

  return (
    <article
      className={`bg-white border border-[#D1D1D1] rounded-2xl overflow-hidden flex flex-col sm:flex-row group transition-all duration-300 ${isSelected ? 'ring-2 ring-[#f26565]' : 'hover:shadow-md'}`}
    >
      <div className="w-full sm:w-48 h-48 relative overflow-hidden bg-zinc-100 flex-shrink-0">
        {picture ? (
          <img
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            src={picture}
            alt={title}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-zinc-400">
            <span className="material-symbols-outlined text-4xl mb-1">
              image_not_supported
            </span>
            <span className="text-xs">이미지 없음</span>
          </div>
        )}
        {isSelected && (
          <div className="absolute top-3 left-3 bg-primary px-3 py-1 rounded-full text-white text-[10px] font-bold uppercase tracking-widest">
            Selected
          </div>
        )}
      </div>
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xl font-bold text-on-surface">{title}</h3>
            <span
              className={`${isSelected ? 'text-primary' : 'text-on-surface-variant'} font-bold`}
            >
              {rating || '0.0'} ★
            </span>
          </div>
          <p className="text-on-surface-variant text-sm line-clamp-2 mb-4">
            {contents}
          </p>
          <div className="flex items-center text-sm text-on-surface-variant font-medium mb-4">
            <span className="material-symbols-outlined mr-2 text-primary">
              festival
            </span>
            <span>{dateRange}</span>
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-[10px] font-bold text-on-surface-variant/60 uppercase tracking-widest mb-1.5">
            방문 예정 날짜 선택
          </label>
          <div className="relative">
            <select
              className="w-full pl-4 pr-10 py-2.5 bg-white border border-[#D1D1D1] rounded-xl text-sm font-medium focus:ring-2 focus:ring-[#f26565] focus:border-[#f26565] appearance-none"
              value={selectedDate}
              onChange={(e) => {
                setSelectedDate(e.target.value)
                if (onDateChange) {
                  onDateChange(e.target.value)
                }
              }}
            >
              {options.map((opt: any, idx: number) => (
                <option key={idx} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none text-lg">
              expand_more
            </span>
          </div>
        </div>
        <button
          onClick={() => onSelect(festival_id)}
          className={`mt-4 w-full py-3 rounded-full font-bold text-sm transition-all flex items-center justify-center cursor-pointer border border-primary ${
            isSelected
              ? 'bg-primary text-white'
              : 'bg-white text-primary hover:bg-primary hover:text-white'
          }`}
        >
          {isSelected && (
            <span
              className="material-symbols-outlined mr-2 text-lg"
              style={{ fontVariationSettings: '"FILL" 1' }}
            ></span>
          )}
          {isSelected ? '선택됨' : '선택하기'}
        </button>
      </div>
    </article>
  )
}

interface RangeType {
  start: Date | null
  end: Date | null
}

interface CalendarProps {
  selectedRange: RangeType
  onRangeChange: (range: RangeType) => void
  festivalRange?: { start_date: string; end_date: string }
  currentDate: Date
  setCurrentDate: (date: Date) => void
}

const Calendar = ({
  selectedRange,
  onRangeChange,
  festivalRange,
  currentDate,
  setCurrentDate,
}: CalendarProps) => {
  const handlePrevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1),
    )
  }

  const handleNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1),
    )
  }

  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0,
  ).getDate()
  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1,
  ).getDay() // 0 (Sun) to 6 (Sat)

  const daysInPrevMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    0,
  ).getDate()

  const prevMonthDays = Array.from(
    { length: firstDayOfMonth },
    (_, i) => daysInPrevMonth - firstDayOfMonth + i + 1,
  )
  const currentMonthDays = Array.from({ length: daysInMonth }, (_, i) => i + 1)

  const handleDayClick = (day: number) => {
    const clickedDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day,
    )

    if (!selectedRange.start || (selectedRange.start && selectedRange.end)) {
      onRangeChange({ start: clickedDate, end: null })
    } else {
      if (clickedDate < selectedRange.start) {
        onRangeChange({ start: clickedDate, end: selectedRange.start })
      } else {
        onRangeChange({ start: selectedRange.start, end: clickedDate })
      }
    }
  }

  const getDayTime = (day: number) => {
    return new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day,
    ).getTime()
  }

  const isSelected = (day: number) => {
    const d = getDayTime(day)
    const start = selectedRange.start?.getTime()
    const end = selectedRange.end?.getTime()

    if (start && end) {
      return d >= start && d <= end
    }
    if (start) {
      return d === start
    }
    return false
  }

  const isPrimary = (day: number) => {
    const d = getDayTime(day)
    const start = selectedRange.start?.getTime()
    const end = selectedRange.end?.getTime()

    if (start && end) {
      return d === start || d === end
    }
    if (start) {
      return d === start
    }
    return false
  }

  const isBetween = (day: number) => {
    const d = getDayTime(day)
    const start = selectedRange.start?.getTime()
    const end = selectedRange.end?.getTime()

    if (start && end) {
      return d > start && d < end
    }
    return false
  }

  const isFestivalDate = (day: number) => {
    if (!festivalRange) return false
    const [sy, sm, sd] = festivalRange.start_date.split('-').map(Number)
    const [ey, em, ed] = festivalRange.end_date.split('-').map(Number)
    const start = new Date(sy, sm - 1, sd).getTime()
    const end = new Date(ey, em - 1, ed).getTime()
    const d = getDayTime(day)
    return d >= start && d <= end
  }

  const monthName = currentDate.toLocaleString('ko-KR', {
    year: 'numeric',
    month: 'long',
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between px-2">
        <button
          onClick={handlePrevMonth}
          className="p-2 hover:bg-primary rounded-full transition-colors flex items-center justify-center"
        >
          <span className="material-symbols-outlined">
            <span className="material-symbols-outlined">chevron_left</span>
          </span>
        </button>
        <span className="text-lg font-bold">{monthName}</span>
        <button
          onClick={handleNextMonth}
          className="p-2 hover:bg-primary rounded-full transition-colors flex items-center justify-center"
        >
          <span className="material-symbols-outlined">
            <span className="material-symbols-outlined">chevron_right</span>
          </span>
        </button>
      </div>
      <div className="grid grid-cols-7 gap-y-2 gap-x-1">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div
            key={day}
            className="text-center text-[10px] font-bold text-on-surface-variant/50 uppercase tracking-widest pb-4"
          >
            {day}
          </div>
        ))}
        {prevMonthDays.map((d, i) => (
          <div
            key={`prev-${i}`}
            className="h-8 flex items-center justify-center text-on-surface-variant/30 text-xs"
          >
            {d}
          </div>
        ))}
        {currentMonthDays.map((day) => {
          const primary = isPrimary(day)
          const between = isBetween(day)
          const festival = isFestivalDate(day)

          return (
            <div
              key={day}
              onClick={() => handleDayClick(day)}
              className={`h-8 flex items-center justify-center text-sm cursor-pointer relative transition-all select-none rounded-full
                  ${
                    primary
                      ? 'bg-primary text-white z-10 shadow-lg shadow-[#f26565]/30 font-bold'
                      : between
                        ? 'bg-gray-100 font-bold'
                        : festival
                          ? 'bg-[#f26565]/10 text-primary font-bold rounded-sm'
                          : 'text-on-surface-variant hover:bg-black/5'
                  }
              `}
            >
              {day}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function Step2Content() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { user } = useAuth()

  const [festivals, setFestivals] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const [selectedFestivalId, setSelectedFestivalId] = useState<number | null>(
    null,
  )
  const [selectedRange, setSelectedRange] = useState<RangeType>(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return { start: today, end: today }
  })
  const [currentDate, setCurrentDate] = useState(new Date())
  const [address, setAddress] = useState('') // 카카오 지도에서 선택한 장소명
  const [visitDates, setVisitDates] = useState<Record<number, string>>({})
  const [isGenerating, setIsGenerating] = useState(false)

  useEffect(() => {
    const fetchFestivals = async () => {
      setLoading(true)
      try {
        const category = searchParams.get('category') || ''
        const res = await fetch(
          `/api/festivals?category=${encodeURIComponent(category)}`,
        )
        const data = await res.json()
        if (data.festivals && data.festivals.length > 0) {
          setFestivals(data.festivals)
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchFestivals()
  }, [searchParams])

  const getInitialOption = (festival: any) => {
    if (!festival || !festival.start_date) return ''
    const start = new Date(festival.start_date)
    const month = String(start.getMonth() + 1).padStart(2, '0')
    const date = String(start.getDate()).padStart(2, '0')
    return `${start.getFullYear()}-${month}-${date}`
  }

  const getDisplayDate = (dateValue: string) => {
    if (!dateValue || dateValue.split('-').length !== 3) return dateValue
    const d = new Date(dateValue)
    const daysOfWeek = ['일', '월', '화', '수', '목', '금', '토']
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const date = String(d.getDate()).padStart(2, '0')
    const day = daysOfWeek[d.getDay()]
    return `${month}.${date} (${day})`
  }

  const formRef = useRef<HTMLElement>(null)

  const handleScrollToForm = () => {
    if (window.innerWidth < 1024 && formRef.current) {
      const y =
        formRef.current.getBoundingClientRect().top + window.scrollY - 100
      window.scrollTo({ top: y, behavior: 'smooth' })
    }
  }

  // 카카오 지도에서 장소 선택 시 호출
  const handlePlaceSelect = (placeName: string) => {
    setAddress(placeName)
  }

  const selectedFestival =
    festivals.find((f) => f.festival_id === selectedFestivalId) || null

  const handleGenerate = async () => {
    if (!address) return alert('출발지를 입력해주세요.')
    if (!selectedRange.start) return alert('여행 날짜를 선택해주세요.')
    if (!selectedFestival) return alert('축제를 선택해주세요.')

    const visitDateStr = visitDates[selectedFestivalId || -1] || getInitialOption(selectedFestival)
    const visitDate = new Date(visitDateStr)
    visitDate.setHours(0, 0, 0, 0)
    
    const rangeStart = new Date(selectedRange.start)
    rangeStart.setHours(0, 0, 0, 0)
    
    const rangeEnd = selectedRange.end ? new Date(selectedRange.end) : new Date(rangeStart)
    rangeEnd.setHours(0, 0, 0, 0)

    if (visitDate < rangeStart || visitDate > rangeEnd) {
      return alert('축제 방문 예정일이 설정하신 여행 기간 내에 포함되어야 합니다.')
    }

    setIsGenerating(true)

    const startDate = selectedRange.start.toISOString().split('T')[0]
    const endDate = selectedRange.end
      ? selectedRange.end.toISOString().split('T')[0]
      : startDate

    const payload = {
      address,
      startDate,
      endDate,
      userId: user?.id,
      festival: {
        id: selectedFestivalId,
        title: selectedFestival.title,
        date: getDisplayDate(visitDateStr),
      },
      preferences: {
        category: searchParams.get('category'),
        style: searchParams.get('style'),
        companion: searchParams.get('companion'),
      },
    }

    try {
      const res = await fetch('/api/plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      router.push(`/planner/result?id=${data.planner_id}`)
    } catch (err: any) {
      alert('일정 생성 중 오류가 발생했습니다: ' + err.message)
      setIsGenerating(false)
    }
  }

  const formatDateString = (date: Date | null) => {
    if (!date) return ''
    return `${date.getMonth() + 1}월 ${date.getDate()}일`
  }

  const getDurationText = () => {
    if (selectedRange.start && selectedRange.end) {
      const diffTime = Math.abs(
        selectedRange.end.getTime() - selectedRange.start.getTime(),
      )
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      if (diffDays === 0) {
        return `${formatDateString(selectedRange.start)} (당일치기)`
      }
      return `${formatDateString(selectedRange.start)} - ${formatDateString(selectedRange.end)} (${diffDays}박 ${diffDays + 1}일)`
    }
    if (selectedRange.start) {
      return `${formatDateString(selectedRange.start)} (당일치기)`
    }
    return '날짜를 선택해주세요'
  }

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
