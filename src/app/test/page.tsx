'use client'

import CommentInput from '@/components/comments/CommentInput'
import CommentList from '@/components/comments/CommentList'
import { useState } from 'react'

export default function Test() {
  const [comments, setComments] = useState([
    {
      id: '1',
      created_at: new Date().toISOString(),
      content: '첫 번째 댓글입니다!',
      user_id: 'u1',
      review_id: 'r1',
      user_name: '바다탐험가',
    },
  ])

  const handleNewComment = (text: string) => {
    // 실제로는 여기서 Supabase의 insert API를 호출합니다.
    const newEntry = {
      id: Math.random().toString(36).substr(2, 9),
      created_at: new Date().toISOString(),
      content: text,
      user_id: 'me',
      review_id: 'r1',
      user_name: '나 (정우)',
    }
    setComments([...comments, newEntry])
  }

  return (
    <div className="max-w-2xl mx-auto my-10 p-6 border rounded-xl bg-white">
      <h2 className="text-xl font-bold mb-8">리뷰 댓글</h2>

      {/* 1. 댓글 확인 UI */}
      <CommentList comments={comments} />

      {/* 2. 댓글 작성 UI */}
      <CommentInput onPost={handleNewComment} />
    </div>
  )
}
