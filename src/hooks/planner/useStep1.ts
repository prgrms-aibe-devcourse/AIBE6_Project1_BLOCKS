import { useRouter } from 'next/navigation'
import { useState } from 'react'

export const categories = [
  { id: '음식', label: '음식', icon: 'restaurant' },
  { id: '문화/예술', label: '문화/예술', icon: 'palette' },
  { id: '음악/공연', label: '음악/공연', icon: 'confirmation_number' },
  { id: '전통/역사', label: '전통/역사', icon: 'temple_buddhist' },
  { id: '자연/야외', label: '자연/야외', icon: 'park' },
  { id: '스포츠', label: '스포츠', icon: 'sports_soccer' },
]

export const styles = [
  { id: 'healing', label: '여유로운 힐링' },
  { id: 'active', label: '알찬 스케줄' },
]

export const companions = [
  { id: 'alone', label: '혼자' },
  { id: 'couple', label: '연인과' },
  { id: 'family', label: '가족/친구' },
]

export function useStep1() {
  const router = useRouter()

  const [category, setCategory] = useState<string | null>(null)
  const [style, setStyle] = useState<string | null>(null)
  const [companion, setCompanion] = useState<string | null>(null)

  const handleNext = () => {
    if (!category || !style || !companion) {
      alert('모든 항목을 선택해주세요!')
      return
    }
    const query = new URLSearchParams({
      category,
      style,
      companion,
    }).toString()
    router.push(`/planner/step2?${query}`)
  }

  return {
    category,
    setCategory,
    style,
    setStyle,
    companion,
    setCompanion,
    handleNext,
  }
}
