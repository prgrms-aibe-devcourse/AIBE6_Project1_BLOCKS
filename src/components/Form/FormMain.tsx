'use client'
import { getAdminUuid } from '@/actions/admin'
import { useAuth } from '@/components/providers/AuthProvider'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

function FormMain({
  onSubmit,
}: {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
}) {
  const router = useRouter()
  const { user } = useAuth()
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    // 아무것도 입력하지 않은 상태(전체 검색)를 지원하기 위해 기본 날짜 설정을 제거합니다.
  }, [])

  useEffect(() => {
    if (user) {
      getAdminUuid().then((uuid) => {
        setIsAdmin(user.id === uuid)
      })
    } else {
      setIsAdmin(false)
    }
  }, [user])

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

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-neutral-200 flex flex-col md:flex-row items-center gap-4 max-w-4xl mx-auto w-full">
          <div className="flex-1 flex items-center justify-between w-full">
            <div className="flex items-center flex-1">
              <span
                className="material-symbols-outlined text-on-surface-variant mr-4 text-2xl"
                data-icon="search"
              >
                search
              </span>
              <form onSubmit={onSubmit} className="flex-1">
                <div className="flex flex-wrap md:flex-nowrap items-center gap-4 w-full justify-between">
                  <div className="flex flex-wrap md:flex-nowrap items-center gap-4 shrink-0">
                    <select
                      id="themeitems"
                      name="items"
                      className="bg-neutral-50 rounded-xl border-none text-sm font-bold px-4 py-3 focus:ring-2 focus:ring-primary/20 cursor-pointer"
                    >
                      <option value="모두">테마</option>
                      <option value="문화/예술">문화/예술</option>
                      <option value="음식">음식</option>
                      <option value="음악/공연">음악/공연</option>
                      <option value="전통/역사">전통/역사</option>
                      <option value="자연/야외">자연/야외</option>
                      <option value="스포츠">스포츠</option>
                    </select>
                    <div className="h-6 w-px bg-neutral-200 hidden md:block"></div>
                    <select
                      id="FestaLocation"
                      className="bg-neutral-50 rounded-xl border-none text-sm font-bold px-4 py-3 focus:ring-2 focus:ring-primary/20 cursor-pointer"
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
                    <div className="h-6 w-px bg-neutral-200 hidden md:block"></div>
                    <input
                      type="date"
                      id="Festadate"
                      className="bg-neutral-50 rounded-xl border-none text-sm font-bold px-4 py-3 focus:ring-2 focus:ring-primary/20 cursor-pointer"
                    />
                  </div>
                  <div className="h-8 w-px bg-neutral-200 hidden md:block"></div>
                  <div className="flex flex-wrap md:flex-nowrap items-center gap-4 w-full md:flex-1">
                    <input
                      type="text"
                      id="festivalName"
                      placeholder="축제이름을 입력하세요"
                      className="w-full bg-neutral-50 rounded-xl border-none focus:ring-2 focus:ring-primary/20 px-4 py-3 text-sm font-body"
                    />
                    <button className="bg-primary text-white rounded-xl px-8 py-3 font-bold text-sm shadow-lg shadow-primary/30 active:scale-95 transition-transform shrink-0">
                      검색
                    </button>
                    {isAdmin && (
                      <button
                        type="button"
                        onClick={addFesta}
                        className="bg-white border-2 border-primary text-primary hover:bg-primary-light rounded-xl px-8 py-3 font-bold text-sm shadow-sm active:scale-95 transition-all shrink-0 ml-2"
                      >
                        축제 추가
                      </button>
                    )}
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default FormMain
