export interface RangeType {
  start: Date | null
  end: Date | null
}

export interface CalendarProps {
  selectedRange: RangeType
  onRangeChange: (range: RangeType) => void
  festivalRange?: { start_date: string; end_date: string }
  currentDate: Date
  setCurrentDate: (date: Date) => void
}

export const Calendar = ({
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
      let start = selectedRange.start
      let end = clickedDate

      if (clickedDate < selectedRange.start) {
        start = clickedDate
        end = selectedRange.start
      }

      const diffTime = end.getTime() - start.getTime()
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

      if (diffDays > 14) {
        alert('최대 14박 15일까지만 선택 가능합니다.')
        return
      }

      onRangeChange({ start, end })
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
