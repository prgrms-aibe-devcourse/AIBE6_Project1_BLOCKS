import { Comment } from '@/type/comment'
import { useState } from 'react'
import { FaHeart } from 'react-icons/fa'
import { FiHeart, FiMessageSquare } from 'react-icons/fi'
import CommentInput from './CommentInput'

export default function CommentItem({
  comment,
  onReply,
  onLike,
}: {
  comment: Comment
  onReply: (parentId: string, text: string) => void
  onLike: (id: string) => void
}) {
  const [showReplyInput, setShowReplyInput] = useState(false)

  // 대댓글인지 확인 (부모 ID가 있으면 대댓글)
  const isReply = !!comment.parent_id

  return (
    // 1. 대댓글일 경우 왼쪽 여백(pl-12)을 주어 들여쓰기 효과를 냅니다.
    <div className={`flex gap-4 group ${isReply ? 'pl-12 mt-2' : ''}`}>
      {/* 프로필 이미지 영역 */}
      <div className="flex flex-col items-center shrink-0">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${isReply ? 'bg-gray-100 text-gray-400' : 'bg-blue-50 text-blue-400'}`}
        >
          {comment.user_name[0]}
        </div>
        {/* 부모 댓글일 때만 아래로 이어지는 선을 보여줄 수 있습니다 (선택사항) */}
        {!isReply && (
          <div className="w-px flex-1 bg-gray-100 my-2 group-last:bg-transparent" />
        )}
      </div>

      {/* 댓글 콘텐츠 영역 */}
      <div className="flex-1 pb-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-bold text-[14px] text-gray-900">
            {comment.user_name}
          </span>
          <span className="text-[12px] text-gray-400">
            {new Date(comment.created_at).toLocaleDateString()}
          </span>
        </div>

        <p className="text-gray-700 text-[15px] leading-relaxed mb-3">
          {comment.content}
        </p>

        <div className="flex items-center gap-4 text-[13px] font-semibold">
          <button
            onClick={() => onLike(comment.id)}
            className={`flex items-center gap-1.5 transition-colors ${comment.is_liked ? 'text-red-500' : 'text-gray-400 hover:text-red-400'}`}
          >
            {comment.is_liked ? <FaHeart /> : <FiHeart />} {comment.like_count}
          </button>

          {/* 대댓글에는 '답글 달기'를 숨기거나 기능을 제한할 수 있습니다. */}
          {!isReply && (
            <button
              onClick={() => setShowReplyInput(!showReplyInput)}
              className="flex items-center gap-1.5 text-gray-400 hover:text-blue-500 transition-colors"
            >
              <FiMessageSquare /> 답글 달기
            </button>
          )}
        </div>

        {/* 답글 입력창 */}
        {showReplyInput && (
          <div className="mt-4">
            <CommentInput
              onPost={(text) => {
                onReply(comment.id, text)
                setShowReplyInput(false)
              }}
              placeholder={`${comment.user_name}님에게 답글 남기기...`}
            />
          </div>
        )}

        {/* 대댓글 리스트 (재귀 호출) */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-6 space-y-6">
            {comment.replies.map((reply) => (
              <CommentItem
                key={reply.id}
                comment={reply}
                onReply={onReply}
                onLike={onLike}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
