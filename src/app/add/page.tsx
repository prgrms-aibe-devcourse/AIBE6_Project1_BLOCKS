'use client'
import { supabase } from '@/app/supabse/supabse'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { v4 as uuidv4 } from 'uuid'

function addFesta() {
  const router = useRouter()
  const [text, setText] = useState('')
  const [blob, setBlob] = useState<Blob | null>(null)
  const onaddFesta = async (
    e: React.FormEvent<HTMLFormElement>,
    path: Blob | null,
  ) => {
    e.preventDefault()
    if (!path) {
      alert('이미지를 선택해주세요.')
      return
    }
    const uuid = uuidv4().replace(/-/g, '')
    const { error } = await supabase
      .from('festivals')
      .insert([
        {
          option1: e.currentTarget.themeitems.value,
          contents: e.currentTarget.cn.value,
          title: e.currentTarget.ctitle.value,
          start_date: e.currentTarget.Festasdate.value,
          end_date: e.currentTarget.Festafdate.value,
          option2: e.currentTarget.FestaLocation.value,
          address: e.currentTarget.festaLocationDetail.value,
          user_id: '3695ba2c-d9f5-4a74-9279-e4157ce2765c',
          picture: uuid + '.jpg',
          rating: 0,
        },
      ])
      .select()
    if (error) {
      console.log(error)
    } else {
      const filePath = './' + uuid + '.jpg' // 저장할 파일명
      const { error } = await supabase.storage // Supabase Storage 이미지 업로드 코드
        .from('festival')
        .upload(filePath, path)
      if (error) {
        console.log(error)
      } else {
        alert('축제가 추가되었습니다.')
        router.push('/')
      }
    }
  }
  const onchange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    e.preventDefault()

    setText(e.target.value)
  }
  const imagechange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.type !== 'image/jpeg') {
      alert('JPEG 파일만 선택해주세요!')
      return
    }

    setBlob(file)
    console.log(file)
  }
  const getImageUrl = (path: string) => {
    const { data } = supabase.storage.from('festival').getPublicUrl(path)

    return data.publicUrl
  }
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blob ? (
          <img
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            src={URL.createObjectURL(blob)}
            alt="pic1"
          />
        ) : (
          <img
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            src={getImageUrl('blank.png')}
            alt="pic1"
          />
        )}
        <div>
          <form onSubmit={(e) => onaddFesta(e, blob)}>
            <div className="block">
              <div>
                <button className="bg-[#FF7676] text-white rounded-full px-8 py-3 font-bold text-sm shadow-lg shadow-primary/30 active:scale-95 transition-transform whitespace-nowrap ml-2">
                  축제 추가
                </button>
                <label htmlFor="profile_pic">
                  <h2 className="text-3xl font-bold text-on-surface">
                    이미지 선택
                  </h2>
                </label>
                <input
                  type="file"
                  id="profile_pic"
                  name="profile_pic"
                  accept=".jpg, .jpeg, .png"
                  className="width-full border border-black"
                  onChange={(e) => imagechange(e)}
                />
              </div>
              <h2 className="text-3xl font-bold text-on-surface">축제 제목</h2>
              <input
                type="text"
                id="ctitle"
                placeholder="글제목을 입력하세요"
                className="width-full border border-black"
              />
              <h2 className="text-3xl font-bold text-on-surface">
                축제 상세주소
              </h2>
              <input
                type="text"
                id="festaLocationDetail"
                placeholder="축제상세주소를 입력하세요"
                className="width-full border border-black"
              />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-on-surface">축제 테마</h2>
              <select
                id="themeitems"
                name="items"
                className="border border-black"
              >
                <option value="음악">음악</option>
                <option value="꽃">꽃</option>
                <option value="동물">동물</option>
                <option value="음식">음식</option>
                <option value="문화">문화</option>
                <option value="레저">레저</option>
                <option value="과학">과학</option>
                <option value="종교">종교</option>
              </select>
              <h2 className="text-3xl font-bold text-on-surface">축제 지역</h2>
              <select
                id="FestaLocation"
                className="bg-transparent rounded-xl border-none text-sm font-bold px-4 py-2 focus:ring-0 cursor-pointer"
              >
                <option value="서울">서울</option>
                <option value="경기">경기도</option>
                <option value="강원">강원도</option>
                <option value="전라">전라도</option>
                <option value="경상">경상도</option>
                <option value="제주">제주도</option>
                <option value="충청">충청도</option>
              </select>
              <h2 className="text-3xl font-bold text-on-surface">
                축제 시작일
              </h2>
              <input
                type="date"
                id="Festasdate"
                className="border border-black"
              />
              <h2 className="text-3xl font-bold text-on-surface">
                축제 종료일
              </h2>
              <input
                type="date"
                id="Festafdate"
                className="border border-black"
              />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-on-surface">축제 내용</h2>
              <textarea
                className="w-full prose prose-zinc max-w-none text-on-surface-variant leading-relaxed space-y-4"
                id="cn"
                value={text}
                onChange={(e) => onchange(e)}
              ></textarea>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

export default addFesta
