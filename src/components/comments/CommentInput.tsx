'use client'

import React, { useState } from 'react'
import { FiSend } from 'react-icons/fi'

interface CommentInputProps {
  onPost: (text: string) => void
  placeholder?: string // 대댓글 시 "ㅇㅇ님에게 답글..." 표시용
}

// 1. props에서 placeholder를 반드시 받아야 합니다.
export default function CommentInput({
  onPost,
  placeholder,
}: CommentInputProps) {
  const [inputText, setInputText] = useState('')

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!inputText.trim()) return

    onPost(inputText) // 부모(Test.tsx)에게 텍스트 전달
    setInputText('') // 입력창 초기화
  }

  return (
    <div className="flex gap-4 mt-2 w-full">
      {/* 왼쪽 프로필 아이콘 */}
      <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-sm font-bold text-blue-400 shrink-0">
        나
      </div>

      <form onSubmit={handleSubmit} className="flex-1 relative group">
        <div className="border border-gray-200 rounded-2xl overflow-hidden focus-within:border-gray-400 focus-within:ring-1 focus-within:ring-gray-400 transition-all bg-gray-50/30">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            // 2. 외부에서 넣어준 placeholder가 있으면 쓰고, 없으면 기본값!
            placeholder={placeholder || '리뷰에 대한 댓글을 남겨주세요...'}
            className="w-full p-4 text-[15px] bg-transparent outline-none resize-none min-h-[100px] text-gray-800 placeholder:text-gray-400"
            onKeyDown={(e) => {
              // 엔터 누르면 전송 (Shift+Enter는 줄바꿈)
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSubmit()
              }
            }}
          />

          {/* 하단 아이콘 영역 */}
          <div className="flex justify-end items-center gap-3 px-4 pb-3">
            {/* 전송 버튼 */}
            <button
              type="submit"
              disabled={!inputText.trim()}
              className={`p-1.5 rounded-full transition-all ${
                inputText.trim()
                  ? 'text-red-400 hover:bg-red-50'
                  : 'text-gray-300 cursor-not-allowed'
              }`}
            >
              <FiSend size={22} />
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
