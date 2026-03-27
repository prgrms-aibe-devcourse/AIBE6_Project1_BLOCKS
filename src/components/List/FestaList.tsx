'use client'
import Link from 'next/link'
import React, { useEffect } from 'react'
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
  const imageUrl =
    'https://cdn.imweb.me/upload/S201802145a83a6028d5cf/5b7bbf4d4188b.jpg'
  return (
    <>
      {festivalName.map((item) => (
        <ul key={item.festival_id}>
          <input type="checkbox" />
          <Link href={`/festival/${item.festival_id}`}>
            {/*  <li>
             <img src={imageUrl} alt="pic1" />
            </li>*/}
            <li>글제목/축제이름 : {item.title}</li>
            <li>축제테마 : {item.option1}</li>
            <li>
              축제기간 : {item.start_date} ~ {item.end_date}
            </li>
            <li>지역 : {item.option2}</li>
            <li>상세주소 : {item.address}</li>
            <li>글쓴이 : {item.user_id}</li>
            <textarea readOnly value={`글내용 : ${item.contents}`}></textarea>
          </Link>
        </ul>
      ))}
    </>
  )
}

export default FestaList
