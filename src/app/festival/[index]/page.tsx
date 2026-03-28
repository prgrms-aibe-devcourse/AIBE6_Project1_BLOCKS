'use client'
import { supabase } from '@/app/supabse/supabse'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import MapContainer from '@/function/map'

function FestaList() {
  const [festivalName, setFestivalName] = useState<
    {
      festival_id: number
      created_at: string
      option1: string
      contents: string
      title: string
      start_date: string
      end_date: string
      option2: string
      address: string
      user_id: number
      rating: number
      picture: string
    }[]
  >([])
  const router = useRouter()
  const { index } = useParams()
  const cid = Number(index)

  const selectFesta = async () => {
    const { data: festivalName, error } = await supabase
      .from('festivals')
      .select('*')
      .eq('festival_id', index)
    if (error) {
      console.log(error)
    } else {
      setFestivalName(festivalName)
    }
  }
  const delFesta = async (did: number) => {
    const { error } = await supabase
      .from('festivals')
      .delete()
      .eq('festival_id', did)
    if (error) {
      console.log(error)
    } else {
      alert('축제가 삭제되었습니다.')
    }
  }
  useEffect(() => {
    selectFesta()
    FestivalListForm()
  }, [])
  const modifyFesta = (did: number) => {
    router.push(`/modify/${did}`)
  }
  const deleteFesta = (did: number) => {
    delFesta(did)
    router.push('/')
  }
  const getImageUrl = (path: string) => {
    const { data } = supabase.storage.from('festival').getPublicUrl(path)

    return data.publicUrl
  }
  const FestivalListForm = () => {
    setFestivalName(festivalName)
  }

  return (
    <>
      <section className="relative h-[480px] w-full overflow-hidden">
        <ul>
          {festivalName.map((item) => (
            <ul key={item.festival_id}>
              <img
                className="w-full h-full object-cover"
                src={getImageUrl(item.picture)}
                alt="pic1"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 max-w-7xl mx-auto px-6 pb-16">
                <span className="inline-block px-4 py-1.5 rounded-full bg-[#FF7676] text-white text-xs font-bold tracking-widest uppercase mb-4">
                  {item.option1}
                </span>
                <h1 className="font-headline text-5xl md:text-6xl font-extrabold text-white tracking-tight mb-4">
                  {item.title}
                </h1>
                <div className="flex items-center gap-6 text-white/90">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#FF7676]">
                      location_on
                    </span>
                    <span className="text-lg font-medium">{item.address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#FF7676]">
                      calendar_today
                    </span>
                    <span className="text-lg font-medium">
                      {item.start_date} ~ {item.end_date}
                    </span>
                  </div>
                </div>
              </div>

              <li>지역 : {item.option2}</li>
              <li>글쓴이 : {item.user_id}</li>
              <textarea readOnly value={`글내용 : ${item.contents}`}></textarea>
            </ul>
          ))}
        </ul>
      </section>
      <div className="max-w-4xl mx-auto px-6 -mt-10 relative z-10 pb-24">
        <div className="bg-white rounded-xl shadow-lg border border-outline-variant flex p-1 mb-8">
          <button className="flex-1 py-4 text-sm font-bold text-[#FF7676] bg-secondary-container rounded-lg">
            개요
          </button>
          <button
            onClick={() => modifyFesta(cid)}
            className="flex-1 py-4 text-sm font-semibold text-on-surface-variant hover:bg-surface-container-high transition-colors rounded-lg"
          >
            수정
          </button>
          <button
            onClick={() => deleteFesta(cid)}
            className="flex-1 py-4 text-sm font-semibold text-on-surface-variant hover:bg-surface-container-high transition-colors rounded-lg"
          >
            삭제
          </button>
        </div>

        {festivalName.map((item) => (
          <ul key={item.festival_id}>
            <div className="space-y-8">
              <div className="bg-white rounded-xl shadow-sm border border-outline-variant p-8">
                <h2 className="font-headline text-2xl font-bold mb-6 text-on-surface">
                  축제 소개
                </h2>
                <div className="prose prose-zinc max-w-none text-on-surface-variant leading-relaxed space-y-4">
                  <p>{item.contents}</p>
                </div>
                <div className="inline-block mt-8 grid grid-cols-2 gap-4">
                  <img
                    className="rounded-lg h-64 w-full object-cover"
                    data-alt="crowd of people watching golden fireworks display at night near water, urban setting"
                    src={getImageUrl(item.picture)}
                  />

                  <MapContainer address={item.address} />
                </div>
              </div>
            </div>
          </ul>
        ))}
      </div>
    </>
  )
}
export default FestaList
