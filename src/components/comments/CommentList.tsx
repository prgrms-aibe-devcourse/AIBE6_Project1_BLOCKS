import { Comment } from '@/type/comment'
import { useEffect, useState } from 'react'
import { FiHeart, FiMessageSquare } from 'react-icons/fi'

export default function CommentList({ comments }: { comments: Comment[] }) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])
  return (
    <div className="space-y-0">
      {comments.map((comment) => (
        <div key={comment.id} className="flex gap-4 group">
          {/* 좌측 프로필 & 타임라인 선 */}
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-sm font-bold text-gray-400 shrink-0">
              {comment.user_name[0]}
            </div>
            <div className="w-px flex-1 bg-gray-100 my-2 group-last:bg-transparent"></div>
          </div>

          {/* 댓글 콘텐츠 */}
          <div className="flex-1 pb-8">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-bold text-gray-900 text-[14px]">
                {comment.user_name}
              </span>
              <span className="text-[12px] text-gray-400">
                {isMounted
                  ? new Date(comment.created_at).toLocaleDateString()
                  : ''}
              </span>
            </div>
            <p className="text-gray-700 text-[15px] leading-relaxed mb-3">
              {comment.content}
            </p>
            <div className="flex items-center gap-4 text-[13px] text-gray-400 font-semibold">
              <button className="flex items-center gap-1 hover:text-red-400 transition-colors">
                <FiHeart /> 0
              </button>
              <button className="flex items-center gap-1 hover:text-blue-500 transition-colors">
                <FiMessageSquare /> 답글 달기
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
