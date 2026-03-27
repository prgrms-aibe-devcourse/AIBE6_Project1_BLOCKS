'use client'
import { supabase } from '@/app/supabse/supabse'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
function modifyFesta() {
  const { did } = useParams()
  const router = useRouter()
  const [text, setText] = useState('')
  const onmodifyFesta = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const { error } = await supabase
      .from('festivals')
      .update([
        {
          option1: e.currentTarget.themeitems.value,
          content: e.currentTarget.cn.value,
          title: e.currentTarget.ctitle.value,
          fsd: e.currentTarget.Festasdate.value,
          ffd: e.currentTarget.Festafdate.value,
          dl: e.currentTarget.FestaLocation.value,
          fname: e.currentTarget.festivalName.value,
          uid: '1',
        },
      ])
      .eq('id', did)
      .select()
    if (error) {
      console.log(error)
    } else {
      alert('축제가 수정되었습니다.')
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
      <form onSubmit={onmodifyFesta}>
        <div className="flex">
          <input
            type="text"
            id="ctitle"
            placeholder="글제목을 입력하세요"
            className="border border-black"
          />
          <input
            type="text"
            id="festivalName"
            placeholder="축제이름을 입력하세요"
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
          <input
            type="text"
            id="FestaLocation"
            placeholder="지역을 입력하세요"
            className="border border-black"
          />
          <input type="date" id="Festasdate" className="border border-black" />
          <input type="date" id="Festafdate" className="border border-black" />
          <button>축제 수정</button>
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

export default modifyFesta
