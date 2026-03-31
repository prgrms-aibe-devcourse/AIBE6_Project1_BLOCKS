'use client'

import { Comment } from '@/type/comment'
import CommentInput from './CommentInput'
import CommentItem from './CommentItem'

interface CommentListProps {
  comments: Comment[]
  onPost: (text: string) => void
  onReply: (parentId: string, text: string) => void
  onLike: (id: string) => void
  onEdit: (id: string, newContent: string) => void
  onDelete: (id: string) => void
}

export default function CommentList({
  comments,
  onPost,
  onReply,
  onLike,
  onEdit,
  onDelete,
}: CommentListProps) {
  return (
    <div className="mt-4">
      {/* 최상위 댓글 입력 */}
      <CommentInput onPost={onPost} />

      {/* 댓글 목록 */}
      {comments.length > 0 && (
        <div className="mt-6 space-y-0">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              onReply={onReply}
              onLike={onLike}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  )
}
