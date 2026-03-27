'use client'
import { supabase } from '@/app/supabse/supabse'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
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
  const imageUrl =
    'https://cdn.imweb.me/upload/S201802145a83a6028d5cf/5b7bbf4d4188b.jpg'

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
  }, [])
  const modifyFesta = (did: number) => {
    router.push(`/modify/${did}`)
  }
  const deleteFesta = (did: number) => {
    delFesta(did)
    router.push('/')
  }
  return (
    <>
      <ul>
        {/*  <li>
             <img src={imageUrl} alt="pic1" />
            </li>*/}
        {festivalName.map((item) => (
          <ul key={item.festival_id}>
            <li>글제목/축제이름 : {item.title}</li>
            <li> 축제테마 : {item.option1}</li>
            <li>
              축제기간 : {item.start_date} ~ {item.end_date}
            </li>
            <li>지역 : {item.option2}</li>
            <li>상세주소 : {item.address}</li>
            <li>글쓴이 : {item.user_id}</li>
            <textarea readOnly value={`글내용 : ${item.contents}`}></textarea>
          </ul>
        ))}
        <button onClick={() => modifyFesta(cid)}>수정</button>
        <button onClick={() => deleteFesta(cid)}>삭제</button>
      </ul>
    </>
  )
}
export default FestaList
