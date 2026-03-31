'use client'

import CommentInput from '@/components/comments/CommentInput'
import CommentItem from '@/components/comments/CommentItem'
import StarRating from '@/components/common/StarRating'
import { supabase } from '@/lib/supabase'
import { Comment, DbComment } from '@/type/comment'
import { Review } from '@/types/review'
import { formatDate } from '@/utils/date'
import { useEffect, useState } from 'react'

interface ReviewItemProps {
  review: Review
  currentUserId: string
  onDeleteReview?: (reviewId: number) => void
}

function ReviewItem({
  review,
  currentUserId,
  onDeleteReview,
}: ReviewItemProps) {
  const isOwner = currentUserId === review.user_id
  const nickname = review.author?.nickname ?? '알 수 없음'
  const initial = nickname[0] ?? '?'

  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)

  // ── 댓글 조회 ──────────────────────────────────────────
  async function fetchComments() {
    const { data, error } = await supabase
      .from('comments')
      .select(
        `comment_id, created_at, contents, user_id, review_id, parent_id, like_count,
         profiles ( nickname )`,
      )
      .eq('review_id', review.id)
      .order('created_at', { ascending: true })

    if (error) {
      console.log('❌ 조회 실패:', error.message)
      setLoading(false)
      return
    }

    const formatted: Comment[] = (data ?? [])
      .filter((c: DbComment) => !c.parent_id)
      .map((c: DbComment) => ({
        id: String(c.comment_id),
        created_at: c.created_at,
        content: c.contents,
        user_id: c.user_id,
        review_id: String(c.review_id),
        parent_id: c.parent_id ? String(c.parent_id) : undefined,
        nickname: c.profiles?.[0]?.nickname ?? '익명',
        like_count: c.like_count ?? 0,
        is_liked: false,
        replies: (data ?? [])
          .filter(
            (r: DbComment) => Number(r.parent_id) === Number(c.comment_id),
          )
          .map((r: DbComment) => ({
            id: String(r.comment_id),
            created_at: r.created_at,
            content: r.contents,
            user_id: r.user_id,
            review_id: String(r.review_id),
            parent_id: String(r.parent_id),
            nickname: r.profiles?.[0]?.nickname ?? '익명',
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
  }, [review.id])

  // ── 댓글 작성 ──────────────────────────────────────────
  async function handleNewMainComment(text: string) {
    const { error } = await supabase.from('comments').insert({
      contents: text,
      user_id: currentUserId,
      review_id: review.id,
    })
    if (error) {
      console.log('❌ 작성 실패:', error.message)
      return
    }
    await fetchComments()
  }

  // ── 대댓글 작성 ────────────────────────────────────────
  async function handleReply(parentId: string, text: string) {
    console.log('handleReply 호출됨', { parentId, text }) // ← 추가
    const { error } = await supabase.from('comments').insert({
      contents: text,
      user_id: currentUserId,
      review_id: review.id,
      parent_id: Number(parentId),
    })
    if (error) {
      console.log('❌ 대댓글 작성 실패:', error.message)
      return
    }
    await fetchComments()
  }

  // ── 댓글 수정 ──────────────────────────────────────────
  async function handleEdit(id: string, newContent: string) {
    const { error } = await supabase
      .from('comments')
      .update({ contents: newContent })
      .eq('comment_id', Number(id))
    if (error) {
      console.log('❌ 수정 실패:', error.message)
      return
    }
    await fetchComments()
  }

  // ── 댓글 삭제 ──────────────────────────────────────────
  async function handleDelete(id: string) {
    if (!confirm('댓글을 삭제할까요?')) return
    const { error } = await supabase
      .from('comments')
      .delete()
      .eq('comment_id', Number(id))
    if (error) {
      console.log('❌ 삭제 실패:', error.message)
      return
    }
    await fetchComments()
  }

  // ── 좋아요 (로컬 state만 변경) ─────────────────────────
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

  // ── 리뷰 삭제 ──────────────────────────────────────────
  const handleDeleteReview = () => {
    if (window.confirm('정말 이 리뷰를 삭제하시겠습니까?')) {
      onDeleteReview?.(review.id)
    }
  }

  return (
    <div className="py-5 border-b border-[var(--color-neutral-100)] last:border-none">
      {/* ── 상단: 작성자 정보 ── */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-[var(--color-primary-light)] flex items-center justify-center shrink-0 overflow-hidden">
            {review.author?.picture ? (
              <img
                src={review.author.picture}
                alt={nickname}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-sm font-semibold text-[var(--color-primary)]">
                {initial}
              </span>
            )}
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-sm font-semibold text-[var(--color-neutral-900)]">
              {nickname}
            </span>
            <div className="flex items-center gap-2">
              <StarRating rating={review.rating} size="sm" showValue />
              <span className="text-[11px] text-[var(--color-neutral-400)]">
                {formatDate(review.created_at)}
              </span>
            </div>
          </div>
        </div>
        {isOwner && (
          <button
            onClick={handleDeleteReview}
            className="text-[11px] text-[var(--color-neutral-400)] hover:text-red-500 transition-colors px-2 py-1 rounded-md hover:bg-red-50"
          >
            삭제
          </button>
        )}
      </div>

      {/* ── 리뷰 이미지 ── */}
      {review.pictures && (
        <div className="mb-3 rounded-[8px] overflow-hidden w-24 h-24 bg-[var(--color-neutral-100)]">
          <img
            src={review.pictures[0]}
            alt="리뷰 이미지"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* ── 리뷰 내용 ── */}
      <p className="text-sm text-[var(--color-neutral-700)] leading-relaxed mb-3">
        {review.contents}
      </p>

      {/* ── 댓글 섹션 ── */}
      <div className="mt-4 pt-4 border-t border-[var(--color-neutral-100)]">
        <p className="text-sm font-semibold text-[var(--color-neutral-700)] mb-4">
          댓글 {comments.length}
        </p>

        {loading ? (
          <p className="text-xs text-[var(--color-neutral-400)]">
            불러오는 중...
          </p>
        ) : comments.length === 0 ? (
          <p className="text-xs text-[var(--color-neutral-400)]">
            첫 댓글을 남겨보세요!
          </p>
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

        <div className="mt-6 pt-6 border-t border-[var(--color-neutral-100)]">
          <CommentInput onPost={handleNewMainComment} />
        </div>
      </div>
    </div>
  )
}
export default ReviewItem
