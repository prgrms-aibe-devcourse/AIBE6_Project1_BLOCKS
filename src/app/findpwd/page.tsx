'use client'

import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { useState } from 'react'

export default function FindPwd() {
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
    <div className="bg-neutral-50 text-neutral-900 min-h-screen flex flex-col relative overflow-hidden">
      {/* Visual Element (Bottom Left, Top Right decorators) */}
      <div className="fixed top-[10%] -right-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10 pointer-events-none"></div>
      <div className="fixed bottom-20 -left-10 w-48 h-48 bg-primary/5 rounded-full blur-2xl -z-10 pointer-events-none"></div>

      <main className="flex-grow flex items-center justify-center px-4 pt-12 pb-12 z-10 w-full">
        <div className="w-full max-w-[440px] bg-white rounded-xl border border-neutral-200 p-8 shadow-card relative overflow-hidden">
          {/* Decorative Accent */}
          <div className="absolute top-0 left-0 w-full h-1 bg-primary"></div>

          {/* Header Section */}
          <div className="mb-10 text-center mt-4">
            <h1
              className="text-3xl font-bold tracking-tight mb-3 text-neutral-900"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              비밀번호 찾기
            </h1>
            <p className="text-neutral-500 text-sm leading-relaxed">
              가입 시 등록한 이메일 주소를 입력해 주세요
            </p>
          </div>

          {/* Form Section */}
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
              <div>
                <label
                  className="block text-[10px] uppercase tracking-widest font-bold text-neutral-500 mb-2 ml-1"
                  htmlFor="email"
                >
                  이메일 주소
                </label>
                <div className="relative">
                  <input
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3.5 text-neutral-900 placeholder:text-neutral-400 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                    id="email"
                    placeholder="example@festaplan.com"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400">
                    mail
                  </span>
                </div>
              </div>

              {errorMsg && (
                <p className="text-sm text-red-500 font-medium text-center">
                  {errorMsg}
                </p>
              )}

              <button
                className="w-full bg-primary text-white font-bold py-4 rounded-full shadow-lg shadow-primary/20 hover:bg-primary-dark active:scale-95 transition-all flex justify-center items-center gap-2 hover:cursor-pointer"
                type="submit"
                disabled={loading}
              >
                <span>
                  {loading ? '발송 중...' : '비밀번호 재설정 메일 발송'}
                </span>
                {!loading && (
                  <span className="material-symbols-outlined text-[20px]">
                    send
                  </span>
                )}
              </button>
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
        </div>
      </main>
    </div>
  )
}
