import { Comment } from '@/type/comment'
import { useState } from 'react'
import { FaHeart } from 'react-icons/fa'
import { FiHeart, FiMessageSquare } from 'react-icons/fi'
import CommentInput from './CommentInput'

export default function CommentItem({
  comment,
  onReply,
  onLike,
  onEdit,
  onDelete,
}: {
  comment: Comment
  onReply: (parentId: string, text: string) => void
  onLike: (id: string) => void
  onEdit: (id: string, newContent: string) => void
  onDelete: (id: string) => void
}) {
  const [showReplyInput, setShowReplyInput] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editText, setEditText] = useState(comment.content)

  const isReply = !!comment.parent_id

  return (
    <div className={`flex gap-4 group ${isReply ? 'pl-12 mt-2' : ''}`}>
      {/* 프로필 이미지 영역 */}
      <div className="flex flex-col items-center shrink-0">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${isReply ? 'bg-gray-100 text-gray-400' : 'bg-blue-50 text-blue-400'}`}
        >
          {comment.user_name[0]}
        </div>
        {!isReply && (
          <div className="w-px flex-1 bg-gray-100 my-2 group-last:bg-transparent" />
        )}
      </div>

      {/* 댓글 콘텐츠 영역 */}
      <div className="flex-1 pb-6">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[14px] text-gray-900">
              {comment.user_name}
            </span>
            <span className="text-[12px] text-gray-400">
              {new Date(comment.created_at).toLocaleDateString()}
            </span>
          </div>

          {/* 수정/삭제 버튼 */}
          <div className="flex items-center gap-2 text-[12px] text-gray-400">
            <button
              onClick={() => setIsEditing(true)}
              className="hover:text-blue-500 transition-colors"
            >
              수정
            </button>
            <button
              onClick={() => onDelete(comment.id)}
              className="hover:text-red-500 transition-colors"
            >
              삭제
            </button>
          </div>
        </div>

        {/* 수정 모드 / 일반 모드 */}
        {isEditing ? (
          <div className="mt-2">
            <textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="w-full border rounded-lg p-2 text-sm text-gray-700 resize-none focus:outline-none focus:ring-1 focus:ring-blue-300"
              rows={3}
            />
            <div className="flex gap-2 mt-2 text-[12px]">
              <button
                onClick={() => {
                  onEdit(comment.id, editText)
                  setIsEditing(false)
                }}
                className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                완료
              </button>
              <button
                onClick={() => {
                  setEditText(comment.content)
                  setIsEditing(false)
                }}
                className="px-3 py-1 bg-gray-100 text-gray-500 rounded-lg hover:bg-gray-200"
              >
                취소
              </button>
            </div>
          </div>
        ) : (
          <p className="text-gray-700 text-[15px] leading-relaxed mb-3">
            {comment.content}
          </p>
        )}

        <div className="flex items-center gap-4 text-[13px] font-semibold">
          <button
            onClick={() => onLike(comment.id)}
            className={`flex items-center gap-1.5 transition-colors ${comment.is_liked ? 'text-red-500' : 'text-gray-400 hover:text-red-400'}`}
          >
            {comment.is_liked ? <FaHeart /> : <FiHeart />} {comment.like_count}
          </button>

          {!isReply && (
            <button
              onClick={() => setShowReplyInput(!showReplyInput)}
              className="flex items-center gap-1.5 text-gray-400 hover:text-blue-500 transition-colors"
            >
              <FiMessageSquare /> 답글 달기
            </button>
          )}
        </div>

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

        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-6 space-y-6">
            {comment.replies.map((reply) => (
              <CommentItem
                key={reply.id}
                comment={reply}
                onReply={onReply}
                onLike={onLike}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
