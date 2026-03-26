'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Step1() {
  const router = useRouter()

  const [category, setCategory] = useState<string | null>(null)
  const [style, setStyle] = useState<string | null>(null)
  const [companion, setCompanion] = useState<string | null>(null)

  const categories = [
    { id: 'food', label: '음식', icon: 'restaurant' },
    { id: 'culture', label: '문화/예술', icon: 'palette' },
    { id: 'music', label: '음악/공연', icon: 'confirmation_number' },
    { id: 'history', label: '전통/역사', icon: 'temple_buddhist' },
    { id: 'nature', label: '자연/야외', icon: 'park' },
    { id: 'sports', label: '스포츠', icon: 'sports_soccer' },
  ]

  const styles = [
    { id: 'healing', label: '여유로운 힐링' },
    { id: 'active', label: '알찬 스케줄' },
  ]

  const companions = [
    { id: 'alone', label: '혼자' },
    { id: 'couple', label: '연인과' },
    { id: 'family', label: '가족/친구' },
  ]

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

  return (
    <>
      <main className="min-h-screen pt-10 pb-12 px-4 flex items-center justify-center">
        <div className="bg-white w-full max-w-2xl rounded-3xl border border-[#D1D5DB] shadow-xl p-8 md:p-12 relative overflow-hidden">
          <div className="mb-10 text-center">
            <h1 className="text-3xl font-extrabold text-on-surface mb-3 tracking-tight">
              당신의 관심사를 알려주세요
            </h1>
            <p className="text-on-surface-variant font-medium">
              AI가 취향에 딱 맞는 맞춤 축제를 추천해드립니다.
            </p>
          </div>
          <div className="space-y-10">
            <section>
              <label className="block text-sm font-bold text-on-surface mb-3 uppercase tracking-wider">
                관심 카테고리
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {categories.map((item) => {
                  const isSelected = category === item.id
                  return (
                    <div
                      key={item.id}
                      onClick={() => setCategory(item.id)}
                      className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 cursor-pointer transition-all active:scale-95 group 
                        ${
                          isSelected
                            ? 'bg-[#FF7676]/10 border-[#FF7676]'
                            : 'bg-zinc-50 border-transparent hover:border-[#FF7676]/30'
                        }`}
                    >
                      <span
                        className="material-symbols-outlined text-3xl mb-2 text-[#FF7676]"
                        style={isSelected ? { fontVariationSettings: "'FILL' 1" } : {}}
                      >
                        {item.icon}
                      </span>
                      <span
                        className={`text-sm font-bold ${
                          isSelected ? 'text-[#FF7676]' : ''
                        }`}
                      >
                        {item.label}
                      </span>
                    </div>
                  )
                })}
              </div>
            </section>
            <section>
              <label className="block text-sm font-bold text-on-surface mb-3 uppercase tracking-wider">
                여행 스타일
              </label>
              <div className="flex gap-3">
                {styles.map((item) => {
                  const isSelected = style === item.id
                  return (
                    <button
                      key={item.id}
                      onClick={() => setStyle(item.id)}
                      className={`flex-1 py-4 px-6 rounded-2xl font-bold transition-all active:scale-95 
                        ${
                          isSelected
                            ? 'bg-[#FF7676] text-white shadow-lg shadow-[#FF7676]/20'
                            : 'bg-zinc-100 text-zinc-500 hover:bg-zinc-200'
                        }`}
                    >
                      {item.label}
                    </button>
                  )
                })}
              </div>
            </section>
            <section>
              <label className="block text-sm font-bold text-on-surface mb-3 uppercase tracking-wider">
                누구와 함께 하나요?
              </label>
              <div className="flex flex-wrap gap-3">
                {companions.map((item) => {
                  const isSelected = companion === item.id
                  return (
                    <button
                      key={item.id}
                      onClick={() => setCompanion(item.id)}
                      className={`flex-1 py-3 px-6 rounded-full font-bold transition-all active:scale-95
                        ${
                          isSelected
                            ? 'bg-[#FF7676] text-white shadow-lg shadow-[#FF7676]/20'
                            : 'bg-zinc-100 text-zinc-500 hover:bg-zinc-200'
                        }`}
                    >
                      {item.label}
                    </button>
                  )
                })}
              </div>
            </section>
            <div className="pt-6">
              <button
                onClick={handleNext}
                className="w-full py-5 bg-[#FF7676] text-white text-lg font-extrabold rounded-2xl shadow-xl shadow-[#FF7676]/30 hover:bg-[#ff6565] transition-all active:scale-[0.98] flex items-center justify-center gap-3"
              >
                <span>축제 추천받기</span>
                <span className="material-symbols-outlined">auto_awesome</span>
              </button>
            </div>
          </div>
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#FF7676]/5 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-secondary/5 rounded-full blur-3xl"></div>
        </div>
      </main>
    </>
  )
}
