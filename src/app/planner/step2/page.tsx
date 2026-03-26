'use client'

import { useRef, useState } from 'react'
import DaumPostcode from 'react-daum-postcode'

interface FestivalCardProps {
  id: number
  title: string
  rating: number
  description: string
  start_date: string
  end_date: string
  image: string
  isSelected: boolean
  onSelect: (id: number) => void
  onDateChange?: (date: string) => void
}

const FestivalCard = ({
  id,
  title,
  rating,
  description,
  start_date,
  end_date,
  image,
  isSelected,
  onSelect,
  onDateChange,
}: FestivalCardProps) => {
  const start = new Date(start_date)
  const end = new Date(end_date)
  const options: string[] = []

  const daysOfWeek = ['일', '월', '화', '수', '목', '금', '토']

  const currentDate = new Date(start)
  while (currentDate <= end) {
    const month = String(currentDate.getMonth() + 1).padStart(2, '0')
    const date = String(currentDate.getDate()).padStart(2, '0')
    const day = daysOfWeek[currentDate.getDay()]
    options.push(`${month}.${date} (${day})`)
    currentDate.setDate(currentDate.getDate() + 1)
  }

  const dateRange = `${start_date.split('-').slice(1).join('.')} - ${end_date.split('-').slice(1).join('.')}`

  const [selectedDate, setSelectedDate] = useState(options[0])

  return (
    <article
      className={`bg-white border border-[#D1D1D1] rounded-2xl overflow-hidden flex flex-col sm:flex-row group transition-all duration-300 ${isSelected ? 'ring-2 ring-[#FF7676]' : 'hover:shadow-md'}`}
    >
      <div className="w-full sm:w-48 h-48 relative overflow-hidden">
        <img
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          src={image}
          alt={title}
        />
        {isSelected && (
          <div className="absolute top-3 left-3 bg-[#FF7676] px-3 py-1 rounded-full text-white text-[10px] font-bold uppercase tracking-widest">
            Selected
          </div>
        )}
      </div>
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xl font-bold text-on-surface">{title}</h3>
            <span
              className={`${isSelected ? 'text-[#FF7676]' : 'text-on-surface-variant'} font-bold`}
            >
              {rating} ★
            </span>
          </div>
          <p className="text-on-surface-variant text-sm line-clamp-2 mb-4">
            {description}
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
              className="w-full pl-4 pr-10 py-2.5 bg-white border border-[#D1D1D1] rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary focus:border-primary appearance-none"
              value={selectedDate}
              onChange={(e) => {
                setSelectedDate(e.target.value)
                if (onDateChange) {
                  onDateChange(e.target.value)
                }
              }}
            >
              {options.map((opt: string, idx: number) => (
                <option key={idx}>{opt}</option>
              ))}
            </select>
            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none text-lg">
              <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none text-lg">
                expand_more
              </span>
            </span>
          </div>
        </div>
        <button
          onClick={() => onSelect(id)}
          className={`mt-4 w-full py-3 rounded-full font-bold text-sm transition-all flex items-center justify-center cursor-pointer border border-[#FF7676] hover:bg-primary/5 ${isSelected ? 'bg-[#FF7676] text-white' : 'bg-white border border-primary text-[#FF7676] hover:bg-primary/5'}`}
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
          className="p-2 hover:bg-[#FF7676] rounded-full transition-colors flex items-center justify-center"
        >
          <span className="material-symbols-outlined">
            <span className="material-symbols-outlined">chevron_left</span>
          </span>
        </button>
        <span className="text-lg font-bold">{monthName}</span>
        <button
          onClick={handleNextMonth}
          className="p-2 hover:bg-[#FF7676] rounded-full transition-colors flex items-center justify-center"
        >
          <span className="material-symbols-outlined">
            <span className="material-symbols-outlined">chevron_right</span>
          </span>
        </button>
      </div>
      <div className="grid grid-cols-7 gap-y-2">
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
            className="h-10 flex items-center justify-center text-on-surface-variant/30 text-sm"
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
              className={`h-10 flex items-center justify-center text-sm cursor-pointer relative transition-all select-none rounded-full
                  ${
                    primary
                      ? 'bg-[#FF7676] text-white z-10 shadow-lg shadow-[#FF7676]/30 font-bold'
                      : between
                        ? 'bg-gray-100 font-bold'
                        : festival
                          ? 'bg-[#FF7676]/10 text-[#FF7676] font-bold'
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

export default function Step2() {
  const [selectedFestivalId, setSelectedFestivalId] = useState(1)
  const [selectedRange, setSelectedRange] = useState<RangeType>(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return { start: today, end: today }
  })
  const [currentDate, setCurrentDate] = useState(new Date())
  const [isPostcodeOpen, setIsPostcodeOpen] = useState(false)
  const [address, setAddress] = useState('')
  const [visitDates, setVisitDates] = useState<Record<number, string>>({})

  const getInitialOption = (festival: any) => {
    if (!festival) return ''
    const daysOfWeek = ['일', '월', '화', '수', '목', '금', '토']
    const start = new Date(festival.start_date)
    const month = String(start.getMonth() + 1).padStart(2, '0')
    const date = String(start.getDate()).padStart(2, '0')
    const day = daysOfWeek[start.getDay()]
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

  const handleComplete = (data: any) => {
    let fullAddress = data.address
    let extraAddress = ''

    if (data.addressType === 'R') {
      if (data.bname !== '') {
        extraAddress += data.bname
      }
      if (data.buildingName !== '') {
        extraAddress +=
          extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName
      }
      fullAddress += extraAddress !== '' ? ` (${extraAddress})` : ''
    }

    setAddress(fullAddress)
    setIsPostcodeOpen(false)
  }

  const festivals = [
    {
      id: 1,
      title: '진해 군항제',
      rating: 4.9,
      description:
        '흐드러지게 피어난 벚꽃 아래에서 펼쳐지는 한국 최고의 벚꽃 축제입니다. 해군사관학교 개방 등 특별한 이벤트가 가득합니다.',
      start_date: '2026-03-22',
      end_date: '2026-04-01',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuB6xATSxIuugqnSMYfaSDLKecYX8K5sPACEzFLVM6f9HjBQenPBt2AEtTBCVc7beQfMWYixVN30RKV6IO5H9mul05NC0vDrYiYwvQRBteyBf9fcVbDsbRQIzj1MGbM1bgYR6hdbSZLN91C0h4Qq3IvBLWGDzHBqHzWUVAUe1BTTOqREjccCK6f6EwXYyX-nwGsah74OaSYuAfpk0XympjOAXAGucJOW3sJymlD4Qx6rBaC5TBSMpRYSgiBjB78w7Lly30pfjuwmJug',
    },
    {
      id: 2,
      title: '서울 세계불꽃축제',
      rating: 4.7,
      description:
        '여의도 밤하늘을 수놓는 화려한 불꽃의 향연. 세계 각국의 기술력이 결합된 예술적인 불꽃 쇼를 감상하세요.',
      start_date: '2026-10-05',
      end_date: '2026-10-06',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuA3PT2ky9NDvMTkOA7zup80gcK88tIVv81VdeV13vrVroKSY3mz6MOAKfiCsZePfFdQbkpXCbpESS1Tje34xvqULS6mf3d49Isk_UAU43hnRjzh7Jx8I64Qyju7HPo7yZypxWaW0wgufVzNJ4c3Vg07Sg7s0p-i1oYS4Q4xHc-6lLa9gH5wSu8ltKz9hbxobCtMAE4bkKLsQo8_E-hrm5pyB8raSLXnfFrv5jgY8jes9n92ezKmnwW_3scIbIrt02laAmiFBpub_ww',
    },
    {
      id: 3,
      title: '내장산 단풍축제',
      rating: 4.8,
      description:
        '단풍 터널로 유명한 내장산의 가을 정취를 만끽하세요. 가을의 절정을 느끼기에 가장 완벽한 장소입니다.',
      start_date: '2026-10-25',
      end_date: '2026-11-10',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAMXvBrvdfjBifTQb-P3FXPmeWcICgxNoaU67jSDhhGH4VzSxz1OVTKQAusJ5VmErQ9aUsZ3l_VavSYS9E0nLI-fnw7MHvvk19sZ2XohC8f6mlQjZ5VsP_5YzRNhoa6VbEY9KY1RGJ1CrH9lz0pjURvva_LYMRlzmhF5DOX5i3_1UmkL_McOte7qlUlkYNoOFtKGICyzDe5UZQRn8rlaH0uX8OhJlptUP92MzPI7mzKmAUym-usX-PKVp8BSE_vjb4ef7oVHuWHp9U',
    },
  ]

  const selectedFestival =
    festivals.find((f) => f.id === selectedFestivalId) || festivals[0]

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

  return (
    <div className="min-h-screen">
      <main className="pt-10 pb-32 px-4 max-w-7xl mx-auto">
        <div className="bg-white rounded-3xl border border-[#D1D1D1] shadow-sm p-8 md:p-12">
          <header className="mb-12 flex flex-col items-center text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-[#FF7676]/10 text-[#FF7676] mb-6">
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
              AI가 <span className="text-[#FF7676] italic">최적의 일정</span>을
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
                <span className="material-symbols-outlined mr-2 text-[#FF7676]">
                  festival
                </span>
                추천 축제 리스트
              </h2>
              <div className="grid gap-6">
                {festivals.map((festival) => (
                  <FestivalCard
                    key={festival.id}
                    {...festival}
                    isSelected={selectedFestivalId === festival.id}
                    onSelect={(id) => {
                      setSelectedFestivalId(id)
                      const selected = festivals.find((f) => f.id === id)
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
                        [festival.id]: date,
                      }))
                      if (selectedFestivalId === festival.id) {
                        handleScrollToForm()
                      }
                    }}
                  />
                ))}
              </div>
            </section>

            <section ref={formRef} className="order-1 lg:order-2 lg:col-span-5">
              <div className="sticky top-28 space-y-8">
                <div className="bg-white border border-[#D1D1D1] rounded-2xl p-6">
                  <h2 className="text-xl font-bold flex items-center mb-4">
                    <span className="mr-2 text-[#FF7676]">
                      <span className="material-symbols-outlined mr-2 text-primary">
                        location_on
                      </span>
                    </span>
                    여행 출발지
                  </h2>
                  <div className="relative">
                    <input
                      className="w-full px-4 py-3 bg-[#F4F4F4] border-0 rounded-xl focus:ring-2 focus:ring-[#FF7676] text-sm font-medium transition-all cursor-pointer"
                      placeholder="어디에서 출발하시나요? 클릭하여 주소 검색"
                      type="text"
                      value={address}
                      readOnly
                      onClick={() => setIsPostcodeOpen(true)}
                    />
                  </div>
                  {isPostcodeOpen && (
                    <div className="mt-4 border border-[#D1D1D1] rounded-xl overflow-hidden relative shadow-sm">
                      <button
                        className="absolute top-2 right-2 z-10 bg-white/80 p-1 rounded-full text-xs text-black shadow-md hover:bg-gray-100 w-8 h-8 flex items-center justify-center font-bold"
                        onClick={() => setIsPostcodeOpen(false)}
                      >
                        ✕
                      </button>
                      <DaumPostcode onComplete={handleComplete} autoClose />
                    </div>
                  )}
                </div>

                <div className="bg-white border border-[#D1D1D1] rounded-2xl p-8 space-y-8">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold flex items-center">
                      <span className="mr-2 text-[#FF7676]">
                        <span className="material-symbols-outlined text-sm mr-1">
                          calendar_today
                        </span>
                      </span>
                      날짜 설정
                    </h2>
                    <span className="text-[10px] font-bold text-[#FF7676] bg-[#FF7676]/10 px-2 py-1 rounded-full uppercase tracking-tighter italic">
                      {selectedFestival.title} 기간
                    </span>
                  </div>

                  <Calendar
                    selectedRange={selectedRange}
                    onRangeChange={setSelectedRange}
                    festivalRange={{
                      start_date: selectedFestival.start_date,
                      end_date: selectedFestival.end_date,
                    }}
                    currentDate={currentDate}
                    setCurrentDate={setCurrentDate}
                  />

                  <div className="pt-6 border-t border-[#D1D1D1]">
                    <div className="mb-6">
                      <p className="text-[10px] font-bold text-on-surface-variant/60 uppercase tracking-widest mb-1">
                        선택한 기간
                      </p>
                      <p className="text-xl font-bold">{getDurationText()}</p>
                      <p className="text-sm font-medium text-[#FF7676] mt-2">
                        방문 예정일:{' '}
                        {visitDates[selectedFestivalId] ||
                          getInitialOption(selectedFestival)}
                      </p>
                    </div>
                    <button className="w-full py-5 rounded-full bg-[#FF7676] hover:bg-[#ff6161] cursor-pointer text-white font-black text-lg transition-all shadow-xl shadow-primary/20 active:scale-95 flex items-center justify-center group">
                      <span
                        className="material-symbols-outlined mr-2 group-hover:rotate-12 transition-transform"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        auto_fix_high
                      </span>
                      AI 플랜 생성하기
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
