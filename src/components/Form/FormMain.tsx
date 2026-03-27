'use client'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

function FormMain({
  onSubmit,
}: {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
}) {
  const router = useRouter()
  useEffect(() => {
    const now = new Date()
    // 한국 시간: const now = new Date(new Date().getTime() + 9 * 60 * 60 * 1000);

    // 2. YYYY-MM-DD 형식으로 변환
    const today = now.toISOString().split('T')[0]

    // 3. input 요소의 value 설정
    const dateInput = document.getElementById('Festadate') as HTMLInputElement
    if (dateInput) {
      dateInput.value = today
    }
  }, [])

  const addFesta = () => {
    router.push('/add')
  }

  return (
    <>
      <section className="relative py-20 px-8 md:px-12 bg-gradient-to-br from-white to-[#F9FAFB] text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold text-on-surface tracking-tight mb-6">
            나만의 축제를 발견하세요
          </h1>
          <p className="text-on-surface-variant text-lg mb-12 max-w-2xl mx-auto leading-relaxed">
            전국의 숨겨진 아름다운 축제들을 테마별, 일정별로 한눈에 확인하고
            나만의 완벽한 여행 계획을 세워보세요.
          </p>
          {/* Integrated Search Bar */}
        </div>

        <div className="bg-white p-2 rounded-full shadow-lg border border-outline-variant flex flex-col md:flex-row items-center gap-2 max-w-4xl mx-auto">
          <div className="flex-1 flex items-center px-6 py-3 min-w-[200px]">
            <span
              className="material-symbols-outlined text-on-surface-variant mr-3"
              data-icon="search"
            >
              search
            </span>
            <form onSubmit={onSubmit}>
              <div className="flex flex-wrap md:flex-nowrap items-center gap-2 w-full md:w-auto p-1">
                <div className="h-8 w-px bg-outline-variant hidden md:block"></div>
                <div className="flex flex-wrap md:flex-nowrap items-center gap-2 w-full md:w-auto p-1">
                  <select
                    id="themeitems"
                    name="items"
                    className="bg-transparent rounded-xl border-none text-sm font-bold px-4 py-2 focus:ring-0 cursor-pointer"
                  >
                    <option value="모두">테마</option>
                    <option value="음악">음악</option>
                    <option value="꽃">꽃</option>
                    <option value="동물">동물</option>
                    <option value="음식">음식</option>
                    <option value="문화">문화</option>
                    <option value="레저">레저</option>
                    <option value="과학">과학</option>
                    <option value="종교">종교</option>
                  </select>
                  <div className="h-6 w-px bg-outline-variant hidden md:block"></div>
                  <select
                    id="FestaLocation"
                    className="bg-transparent rounded-xl border-none text-sm font-bold px-4 py-2 focus:ring-0 cursor-pointer"
                  >
                    <option value="모두">지역</option>
                    <option value="서울">서울</option>
                    <option value="경기">경기도</option>
                    <option value="강원">강원도</option>
                    <option value="전라">전라도</option>
                    <option value="경상">경상도</option>
                    <option value="제주">제주도</option>
                    <option value="충청">충청도</option>
                  </select>
                  <div className="h-6 w-px bg-outline-variant hidden md:block"></div>
                  <input
                    type="date"
                    id="Festadate"
                    className="bg-transparent border-none text-sm font-bold px-4 py-2 focus:ring-0 cursor-pointer"
                  />
                </div>

                <div className="flex flex-wrap md:flex-nowrap items-center gap-2 w-full md:w-auto p-1">
                  <input
                    type="text"
                    id="festivalName"
                    placeholder="축제이름을 입력하세요"
                    className="w-full border-none focus:ring-0 text-sm font-body bg-transparent"
                  />
                  <button className="bg-[#FF7676] text-white rounded-full px-8 py-3 font-bold text-sm shadow-lg shadow-primary/30 active:scale-95 transition-transform whitespace-nowrap ml-2">
                    검색
                  </button>
                </div>
              </div>
            </form>
            <button
              onClick={addFesta}
              className="bg-[#FF7676] text-white rounded-full px-8 py-3 font-bold text-sm shadow-lg shadow-primary/30 active:scale-95 transition-transform whitespace-nowrap ml-2"
            >
              축제 추가
            </button>
          </div>
        </div>
      </section>
    </>
  )
}

export default FormMain
