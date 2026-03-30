'use client'

import { useAuthUI } from '@/components/auth/useAuthUI'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { useState } from 'react'

export default function FindPwd() {
  const { AuthLayout, AuthHeader, AuthInput, AuthButton } = useAuthUI()
  const [email, setEmail] = useState('')
  const [isSent, setIsSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg('')
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/pwdchange`,
      })

      if (error) throw error

      setIsSent(true)
    } catch (err: any) {
      console.error('Password reset error:', err)
      setErrorMsg(err.message || '비밀번호 재설정 링크 발송에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout hasTopAccent>
      <AuthHeader title="비밀번호 찾기" subtitle="가입 시 등록한 이메일 주소를 입력해 주세요" />

      {isSent ? (
        <div className="text-center space-y-6">
          <div className="mx-auto w-16 h-16 bg-primary-light text-primary rounded-full flex items-center justify-center">
            <span className="material-symbols-outlined text-3xl">
              mark_email_read
            </span>
          </div>
          <div>
            <h2 className="text-lg font-bold mb-2">이메일 발송 완료</h2>
            <p className="text-sm text-neutral-500">
              <span className="font-semibold text-neutral-900">
                {email}
              </span>
              (으)로
              <br />
              비밀번호 재설정 링크를 보냈습니다.
            </p>
          </div>
          <Link
            href="/login"
            className="w-full mt-4 bg-neutral-100 text-neutral-700 font-bold py-4 rounded-full hover:bg-neutral-200 transition-all flex justify-center items-center"
          >
            로그인으로 돌아가기
          </Link>
        </div>
      ) : (
        <form className="space-y-6" onSubmit={handleResetPassword}>
          <AuthInput
            label="이메일 주소"
            id="email"
            type="email"
            placeholder="example@festaplan.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon="mail"
            iconPosition="right"
            required
          />

          {errorMsg && (
            <p className="text-sm text-red-500 font-medium text-center">
              {errorMsg}
            </p>
          )}

          <AuthButton type="submit" loading={loading} loadingText="발송 중..." iconText="send">
            비밀번호 재설정 메일 발송
          </AuthButton>
        </form>
      )}

      {/* Navigation Links */}
      {!isSent && (
        <div className="mt-10 flex flex-col items-center gap-4 border-t border-neutral-200 pt-8">
          <div className="mt-2 text-center">
            <span className="text-xs text-neutral-500 mr-2">
              아직 회원이 아니신가요?
            </span>
            <Link
              href="/signup"
              className="text-xs font-bold text-primary hover:underline"
            >
              회원가입
            </Link>
          </div>
        </div>
      )}
    </AuthLayout>
  )
}
