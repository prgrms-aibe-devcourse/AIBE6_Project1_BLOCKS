'use client'
import Link from 'next/link'
import React, { useEffect } from 'react'
function FestaList({
  FestivalListForm,
  festivalName,
}: {
  FestivalListForm: () => void
  festivalName: {
    id: number
    created_at: string
    option1: string
    content: string
    title: string
    fsd: string
    ffd: string
    dl: string
    fname: string
    uid: number
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
        <ul key={item.id}>
          <input type="checkbox" />
          <Link href={`/festival/${item.id}`}>
            {/*  <li>
             <img src={imageUrl} alt="pic1" />
            </li>*/}
            <li>글제목 : {item.title}</li>
            <li>축제이름 : {item.fname}</li>
            <li>축제테마 : {item.option1}</li>
            <li>
              축제기간 : {item.fsd} ~ {item.ffd}
            </li>
            <li>지역 : {item.dl}</li>
            <li>글쓴이 : {item.uid}</li>
            <textarea readOnly value={`글내용 : ${item.content}`}></textarea>
          </Link>
        </ul>
      ))}
    </>
  )
}

export default FestaList
