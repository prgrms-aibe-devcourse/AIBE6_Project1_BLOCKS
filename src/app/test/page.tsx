'use client'

import CommentInput from '@/components/comments/CommentInput'
import CommentItem from '@/components/comments/CommentItem'
import { supabase } from '@/lib/supabase'
import { Comment } from '@/type/comment'
import { useEffect, useState } from 'react'

export default function Test() {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)

  // 댓글 목록 조회
  async function fetchComments() {
    const { data, error } = await supabase
      .from('comments')
      .select(
        `
        id, created_at, content, user_id, review_id, parent_id, like_count,
        user ( user_name )
      `,
      )
      .order('created_at', { ascending: true })

    if (error) {
      console.log('❌ 조회 실패:', error.message)
      setLoading(false)
      return
    }

    const formatted: Comment[] = (data ?? [])
      .filter((c) => !c.parent_id)
      .map((c) => ({
        id: String(c.id),
        created_at: c.created_at,
        content: c.content,
        user_id: String(c.user_id),
        review_id: String(c.review_id),
        parent_id: c.parent_id ? String(c.parent_id) : undefined,
        user_name: c.user?.user_name ?? '익명',
        like_count: c.like_count ?? 0,
        is_liked: false,
        replies: (data ?? [])
          .filter((r) => r.parent_id === c.id)
          .map((r) => ({
            id: String(r.id),
            created_at: r.created_at,
            content: r.content,
            user_id: String(r.user_id),
            review_id: String(r.review_id),
            parent_id: String(r.parent_id),
            user_name: r.user?.user_name ?? '익명',
            like_count: r.like_count ?? 0,
            is_liked: false,
            replies: [],
          })),
      }))

    setComments(formatted)
    setLoading(false)
  }

  useEffect(() => {
    fetchComments()
  }, [])

  // 댓글 작성
  async function handleNewMainComment(text: string) {
    const { error } = await supabase.from('comments').insert({
      content: text,
      user_id: 1, // TODO: 로그인 구현되면 실제 유저 id로 교체
      review_id: 1, // TODO: 실제 리뷰 id로 교체
    })

    if (error) {
      console.log('❌ 작성 실패:', error.message)
      return
    }

    await fetchComments()
  }

  // 대댓글 작성
  async function handleReply(parentId: string, text: string) {
    const { error } = await supabase.from('comments').insert({
      content: text,
      user_id: 1, // TODO: 로그인 구현되면 실제 유저 id로 교체
      review_id: 1, // TODO: 실제 리뷰 id로 교체
      parent_id: Number(parentId),
    })

    if (error) {
      console.log('❌ 대댓글 작성 실패:', error.message)
      return
    }

    await fetchComments()
  }

  // 댓글 수정
  async function handleEdit(id: string, newContent: string) {
    const { error } = await supabase
      .from('comments')
      .update({ content: newContent })
      .eq('id', Number(id))

    if (error) {
      console.log('❌ 수정 실패:', error.message)
      return
    }

    await fetchComments()
  }

  // 댓글 삭제
  async function handleDelete(id: string) {
    if (!confirm('댓글을 삭제할까요?')) return
    const { error } = await supabase
      .from('comments')
      .delete()
      .eq('id', Number(id))

    if (error) {
      console.log('❌ 삭제 실패:', error.message)
      return
    }

    await fetchComments()
  }

  // 좋아요 (로컬 state만 변경)
  function handleLike(id: string) {
    setComments((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          return {
            ...c,
            is_liked: !c.is_liked,
            like_count: c.is_liked ? c.like_count - 1 : c.like_count + 1,
          }
        }
        return {
          ...c,
          replies: c.replies?.map((r) =>
            r.id === id
              ? {
                  ...r,
                  is_liked: !r.is_liked,
                  like_count: r.is_liked ? r.like_count - 1 : r.like_count + 1,
                }
              : r,
          ),
        }
      }),
    )
  }

  return (
    <div className="max-w-2xl mx-auto my-10 p-6 bg-white border rounded-xl">
      <h2 className="text-xl font-bold mb-8">댓글 {comments.length}</h2>

      {loading ? (
        <p className="text-gray-400 text-sm">불러오는 중...</p>
      ) : comments.length === 0 ? (
        <p className="text-gray-400 text-sm">첫 댓글을 남겨보세요!</p>
      ) : (
        <div className="space-y-6">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              onLike={handleLike}
              onReply={handleReply}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <div className="mt-10 pt-10 border-t">
        <CommentInput onPost={handleNewMainComment} />
      </div>
    </div>
  )
}
