import { useState, useEffect, useRef } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useAuth } from '@/components/providers/AuthProvider'
import { RangeType } from '@/components/planner/Calendar'

export function useStep2() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { user } = useAuth()

  const [festivals, setFestivals] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const [selectedFestivalId, setSelectedFestivalId] = useState<number | null>(null)
  const [selectedRange, setSelectedRange] = useState<RangeType>(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return { start: today, end: today }
  })
  const [currentDate, setCurrentDate] = useState(new Date())
  const [address, setAddress] = useState('') // 카카오 지도에서 선택한 장소명
  const [visitDates, setVisitDates] = useState<Record<number, string>>({})
  const [isGenerating, setIsGenerating] = useState(false)

  const formRef = useRef<HTMLElement>(null)

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

  const handleScrollToForm = () => {
    if (window.innerWidth < 1024 && formRef.current) {
      const y =
        formRef.current.getBoundingClientRect().top + window.scrollY - 100
      window.scrollTo({ top: y, behavior: 'smooth' })
    }
  }

  const handlePlaceSelect = (placeName: string) => {
    setAddress(placeName)
  }

  const selectedFestival =
    festivals.find((f) => f.festival_id === selectedFestivalId) || null

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

  return {
    festivals,
    loading,
    selectedFestivalId,
    setSelectedFestivalId,
    selectedRange,
    setSelectedRange,
    currentDate,
    setCurrentDate,
    address,
    setAddress,
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
  }
}
