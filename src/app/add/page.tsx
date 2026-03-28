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
      {blob ? (
        <img src={URL.createObjectURL(blob)} alt="pic1" />
      ) : (
        <img src={getImageUrl('blank.png')} alt="pic1" />
      )}
      <form onSubmit={(e) => onaddFesta(e, blob)}>
        <div className="flex">
          <div>
            <label htmlFor="profile_pic">이미지를 선택해주세요</label>
            <input
              type="file"
              id="profile_pic"
              name="profile_pic"
              accept=".jpg, .jpeg, .png"
              className="border border-black"
              onChange={(e) => imagechange(e)}
            />
          </div>
          <input
            type="text"
            id="ctitle"
            placeholder="글제목을 입력하세요"
            className="border border-black"
          />
          <input
            type="text"
            id="festaLocationDetail"
            placeholder="축제상세주소를 입력하세요"
            className="border border-black"
          />
        </div>
        <div className="flex">
          <select id="themeitems" name="items" className="border border-black">
            <option value="음악">음악</option>
            <option value="꽃">꽃</option>
            <option value="동물">동물</option>
            <option value="음식">음식</option>
            <option value="문화">문화</option>
            <option value="레저">레저</option>
            <option value="과학">과학</option>
            <option value="종교">종교</option>
          </select>
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
          <input type="date" id="Festasdate" className="border border-black" />
          <input type="date" id="Festafdate" className="border border-black" />
          <button>축제 추가</button>
        </div>
        <div>
          <textarea
            id="cn"
            value={text}
            onChange={(e) => onchange(e)}
          ></textarea>
        </div>
      </form>
    </>
  )
}

export default addFesta
