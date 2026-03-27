'use client'
import { supabase } from '@/app/supabse/supabse'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { v4 as uuidv4 } from 'uuid'

function addFesta() {
  const router = useRouter()
  const [text, setText] = useState('')
  const onaddFesta = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
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
          picture: imageUrl,
          rating: 0,
        },
      ])
      .select()
    if (error) {
      console.log(error)
    } else {
      alert('축제가 추가되었습니다.')
      router.push('/')
    }
  }
  const onchange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    e.preventDefault()

    setText(e.target.value)
  }
  const imageUrl =
    'https://cdn.imweb.me/upload/S201802145a83a6028d5cf/5b7bbf4d4188b.jpg'
  return (
    <>
      <form onSubmit={onaddFesta}>
        <div className="flex">
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
