'use client'

import CommentInput from '@/components/comments/CommentInput'
import CommentItem from '@/components/comments/CommentItem'
import { Comment } from '@/type/comment' // 폴더명이 types면 s 붙여주세요!
import { useState } from 'react'

// 1. 임시 데이터(initialData)를 직접 선언해줘야 에러가 안 납니다.
const initialData: Comment[] = [
  {
    id: '1',
    created_at: new Date().toISOString(),
    content: '테스트 댓글입니다.',
    user_id: 'user1',
    review_id: 'r1',
    user_name: '바다탐험가',
    like_count: 0,
    is_liked: false,
    replies: [],
  },
]

export default function Test() {
  const [comments, setComments] = useState<Comment[]>(initialData)

  const handleLike = (id: string) => {
    setComments((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          return {
            ...c,
            is_liked: !c.is_liked,
            like_count: c.is_liked ? c.like_count - 1 : c.like_count + 1,
          }
        }
        if (c.replies) {
          return {
            ...c,
            replies: c.replies.map((r) =>
              r.id === id
                ? {
                    ...r,
                    is_liked: !r.is_liked,
                    like_count: r.is_liked
                      ? r.like_count - 1
                      : r.like_count + 1,
                  }
                : r,
            ),
          }
        }
        return c
      }),
    )
  }

  // 2. 정의되지 않았던 메인 댓글 작성 함수 추가
  const handleNewMainComment = (text: string) => {
    const newComment: Comment = {
      id: Math.random().toString(36).substr(2, 9),
      created_at: new Date().toISOString(),
      content: text,
      user_id: 'me',
      review_id: 'r1',
      user_name: '나',
      like_count: 0,
      is_liked: false,
      replies: [],
    }
    setComments((prev) => [...prev, newComment])
  }

  const handleReply = (parentId: string, text: string) => {
    const newReply: Comment = {
      id: Math.random().toString(36).substr(2, 9),
      created_at: new Date().toISOString(),
      content: text,
      user_id: 'me',
      review_id: 'r1',
      user_name: '나',
      like_count: 0,
      is_liked: false,
      parent_id: parentId,
      replies: [],
    }

    setComments((prev) =>
      prev.map((c) => {
        if (c.id === parentId) {
          return { ...c, replies: [...(c.replies || []), newReply] }
        }
        return c
      }),
    )
  }

  return (
    <div className="max-w-2xl mx-auto my-10 p-6 bg-white border rounded-xl">
      <h2 className="text-xl font-bold mb-8">댓글 {comments.length}</h2>
      <div className="space-y-6">
        {comments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            onLike={handleLike}
            onReply={handleReply}
          />
        ))}
      </div>
      <div className="mt-10 pt-10 border-t">
        <CommentInput onPost={handleNewMainComment} />
      </div>
    </div>
  )
}
