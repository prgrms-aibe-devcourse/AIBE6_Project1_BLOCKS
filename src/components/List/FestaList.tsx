'use client'
import { supabase } from '@/app/supabse/supabse'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

function FestaList({
  FestivalListForm,
  festivalName,
}: {
  FestivalListForm: () => void
  festivalName: {
    festival_id: number
    created_at: string
    option1: string
    contents: string
    title: string
    start_date: string
    end_date: string
    option2: string
    address: string
    user_id: string
    rating: number
    picture: string
  }[]
}) {
  useEffect(() => {
    FestivalListForm()
  }, [])
  const getImageUrl = (path: string) => {
    const { data } = supabase.storage.from('festival').getPublicUrl(path)

    return data.publicUrl
  }

  return (
    <>
      <section className="py-16 px-8 md:px-12 border-t border-outline-variant bg-white">
        <div className="flex justify-between items-end mb-10">
          <div>
            <span className="text-primary font-bold text-[10px] uppercase tracking-widest mb-2 block">
              Trending Now
            </span>
            <h2 className="text-3xl font-bold text-on-surface">
              지금 가장 뜨거운 축제
            </h2>
          </div>
          <button className="text-on-surface-variant font-bold text-sm hover:text-primary transition-colors flex items-center gap-1">
            전체보기
            <span
              className="material-symbols-outlined text-sm"
              data-icon="arrow_forward"
            >
              arrow_forward
            </span>
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {festivalName.map((item, index) => (
            <ul key={item.festival_id}>
              <div className="group cursor-pointer">
                <div className="relative aspect-[4/5] rounded-2xl overflow-hidden mb-4 shadow-sm group-hover:shadow-xl transition-all duration-300">
                  <input type="checkbox" />
                  <img
                    src={getImageUrl(item.picture)}
                    alt="pic1"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-primary tracking-widest">
                    D-12
                  </div>
                </div>
                <h3 className="text-xl font-bold text-on-surface mb-2">
                  {item.title}
                </h3>
                <div className="flex items-center gap-4 text-on-surface-variant text-sm mb-4">
                  <span className="flex items-center gap-1">
                    <span
                      className="material-symbols-outlined text-sm"
                      data-icon="location_on"
                    >
                      location_on
                    </span>{' '}
                    {item.option2}
                  </span>
                  <span className="flex items-center gap-1">
                    <span
                      className="material-symbols-outlined text-sm"
                      data-icon="calendar_month"
                    >
                      calendar_month
                    </span>
                    {item.start_date} ~ {item.end_date}
                  </span>
                </div>

                <Link href={`/festival/${item.festival_id}`}>
                  <button className="w-full py-3 bg-surface hover:bg-primary-container text-on-surface-variant hover:text-primary font-bold text-sm rounded-xl transition-colors active:scale-95">
                    상세보기
                  </button>
                </Link>
              </div>
            </ul>
          ))}
        </div>
      </section>
      <section className="py-16 px-8 md:px-12 border-t border-outline-variant bg-[#F9FAFB]">
        <div className="mb-10">
          <span className="text-primary font-bold text-[10px] uppercase tracking-widest mb-2 block">
            Curation
          </span>
          <h2 className="text-3xl font-bold text-on-surface">테마별 즐기기</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[240px]">
          <div className="md:col-span-2 relative rounded-3xl overflow-hidden group">
            <img
              alt="Gourmet food festival"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              data-alt="close-up of diverse street food stalls with colorful artisanal dishes under warm outdoor market lighting"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAXamseSMjn4BKdBCoB7VkcexUNQXr-fGKCONJ9HCm2BkJyrx3K6EQmovb8Do5uqWzV8s8fbjTWck-hIzbz1nO__kX49fWFNDd-LinBX73Eyl1hxv19tKfWLWeB-_b74Rx_Ek8o3YO50M0M27_UF5BwqYsID-B9Mp5x4DmIZF3mp8tJwT9AJIGGxzgZCpj_8paSPWbljB-yq3Dx6zQsRq__bwxtN4PjelSsHLzkjHCPeu5FzZPyLEhlhNelti---CNbxsrN1ZvzGWM"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8">
              <h3 className="text-2xl font-bold text-white mb-2">
                미식가들의 천국
              </h3>
              <p className="text-white/80 text-sm max-w-sm">
                지역 명물 요리부터 트렌디한 스트릿 푸드까지, 입안 가득 행복을
                주는 축제
              </p>
            </div>
            <a
              className="absolute top-6 right-6 w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white hover:text-primary transition-all"
              href="#"
            >
              <span
                className="material-symbols-outlined"
                data-icon="arrow_outward"
              >
                arrow_outward
              </span>
            </a>
          </div>

          <div className="relative rounded-3xl overflow-hidden group">
            <img
              alt="Traditional Korean architecture"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              data-alt="serene traditional Korean hanok building with elegant tiled roof surrounded by green trees in soft morning light"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBwgEUypQ2OUkcGPpG5NU12weF5yPNyDq2yS-8haLpaPEr2DlkDGnhyh-wni3g1l2RvpwMLwJ-UdCbytUOcKIARNux6JimiPdiSpRclEo42uukq335j1E8-6b96HOOb93MobW6AIuMLcs2Iueq6CwN9BxSZh5YwUNaVp-LwSptqskqfd9rzuPkdh5iwbHet6OvSHamSSv8BYXi3jhwckaD6FB3nXwbzcAEWnRFX8rDPLia00C2iJ3iGyEnTmkxWqOAOCmw50WUROZg"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8">
              <h3 className="text-xl font-bold text-white mb-2">
                전통과 현대의 조화
              </h3>
              <p className="text-white/80 text-xs">
                과거와 현재가 공존하는 특별한 경험
              </p>
            </div>
          </div>

          <div className="relative rounded-3xl overflow-hidden group">
            <img
              alt="Music festival crowd"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              data-alt="energetic crowd at an outdoor music festival with colorful stage lights and silhouettes of people dancing"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCdUk3SUNNRPnS-INROp6fRVo3ZkPnQ8Hm9DDQcu4t6lqECdLEH4eWj4PdDHDA2jLzEbuKjOjDwRFo-Yj1uHkfZAMPJJpOkOUuqrAtPVQvom0D5SnTiiUafGPWWn2CoMidDKNhPe9jy9fxm5lOIIODwHz2W5fOUqPlySYeja4lvR95TTGdukElSSsnsH-v_N-NXpjU_rCdSqu0pu3xA7FbKWY_oy5KysE-GUrKSuOjpknIqs-_6HYZKf7adbMPC8ar3ZPvSYe51fkA"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8">
              <h3 className="text-xl font-bold text-white mb-2">음악과 열정</h3>
              <p className="text-white/80 text-xs">
                일상을 잊게 만드는 비트와 리듬
              </p>
            </div>
          </div>

          <div className="md:col-span-2 relative rounded-3xl overflow-hidden group">
            <img
              alt="Nature park landscape"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              data-alt="wide shot of a colorful flower park with rolling hills and walking paths under a clear blue sky"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBwP_fNcKdLHqjs87cKXK5uivghR8LTMGmvtx5j7XW0-IcvsyyaHE40Vu-bnmJI652jX9UYvpAXiJbwxEAGoggRm-1zHtsRbXm5ErL0JjjL3NkLBliJQcLvbHHsH88zvlZpYiI8IgxO5vB-CN8joHrYcHgNb_OW2CNCKG3SuQvkIUyNk6SzpTW5FNDSurDkI50nxNySjbPCMaMDAKC1NjdsfhDRPU-CFCh0Fdqr8CgvRsoETXHBGbcmHtP05q23d7iXwYvu3sQAdDc"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8">
              <h3 className="text-2xl font-bold text-white mb-2">
                자연과 함께하는 휴식
              </h3>
              <p className="text-white/80 text-sm">
                꽃과 나무가 어우러진 평화로운 축제의 장
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default FestaList
