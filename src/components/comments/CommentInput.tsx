import React, { useState } from 'react'
import { FiSend } from 'react-icons/fi'

interface CommentInputProps {
  onPost: (text: string) => void
}

export default function CommentInput({ onPost }: CommentInputProps) {
  const [inputText, setInputText] = useState('')

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!inputText.trim()) return

    onPost(inputText) // 부모에게 텍스트 전달
    setInputText('') // 입력창 초기화
  }

  return (
    <div className="flex gap-4 mt-2">
      <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-sm font-bold text-blue-400 shrink-0">
        나
      </div>

      <form onSubmit={handleSubmit} className="flex-1 relative group">
        <div className="border border-gray-200 rounded-2xl overflow-hidden focus-within:border-gray-400 transition-all bg-gray-50/30">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="리뷰에 대한 댓글을 남겨주세요..."
            className="w-full p-4 text-[15px] bg-transparent outline-none resize-none min-h-[100px]"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSubmit()
              }
            }}
          />
          <div className="flex justify-end items-center gap-3 px-4 pb-3">
            <button
              type="submit"
              disabled={!inputText.trim()}
              className={`p-1.5 rounded-full ${inputText.trim() ? 'text-red-400 hover:bg-red-50' : 'text-gray-300'}`}
            >
              <FiSend size={22} />
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
