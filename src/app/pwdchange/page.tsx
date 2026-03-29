'use client'

import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function PwdChange() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)

  useEffect(() => {
    // Check if user has an active session from the recovery link
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession()
      if (!data.session) {
        // Not from recovery link (hash fragment) or session invalid
        console.warn('No active session found for password reset.')
      }
    }
    checkSession()
  }, [])

  const handleChangePassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg('')

    if (password !== passwordConfirm) {
      setErrorMsg('비밀번호가 일치하지 않습니다.')
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setErrorMsg('비밀번호는 최소 6자 이상이어야 합니다.')
      setLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      })

      if (error) throw error

      setIsSuccess(true)
    } catch (err: any) {
      console.error('Update password error:', err)
      setErrorMsg(err.message || '비밀번호 변경에 실패했습니다.')
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
              새 비밀번호 설정
            </h1>
            <p className="text-neutral-500 text-sm leading-relaxed">
              새롭게 사용할 비밀번호를 입력해 주세요
            </p>
          </div>

          {/* Form Section */}
          {isSuccess ? (
            <div className="text-center space-y-6">
              <div className="mx-auto w-16 h-16 bg-primary-light text-primary rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-3xl">check_circle</span>
              </div>
              <div>
                <h2 className="text-lg font-bold mb-2">변경 완료</h2>
                <p className="text-sm text-neutral-500">
                  비밀번호가 성공적으로 변경되었습니다.<br />
                  새로운 비밀번호로 로그인해 주세요.
                </p>
              </div>
              <button
                onClick={() => router.push('/login')}
                className="w-full mt-4 bg-primary text-white font-bold py-4 rounded-full shadow-lg shadow-primary/20 hover:bg-primary-dark transition-all flex justify-center items-center"
              >
                로그인 화면으로 이동
              </button>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleChangePassword}>
              <div className="space-y-4">
                <div>
                  <label
                    className="block text-[10px] uppercase tracking-widest font-bold text-neutral-500 mb-2 ml-1"
                    htmlFor="password"
                  >
                    새 비밀번호
                  </label>
                  <div className="relative">
                    <input
                      className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3.5 text-neutral-900 placeholder:text-neutral-400 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                      id="password"
                      placeholder="새 비밀번호 (6자 이상)"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                    />
                    <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400">
                      lock
                    </span>
                  </div>
                </div>

                <div>
                  <label
                    className="block text-[10px] uppercase tracking-widest font-bold text-neutral-500 mb-2 ml-1"
                    htmlFor="passwordConfirm"
                  >
                    새 비밀번호 확인
                  </label>
                  <div className="relative">
                    <input
                      className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3.5 text-neutral-900 placeholder:text-neutral-400 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                      id="passwordConfirm"
                      placeholder="비밀번호 다시 입력"
                      type="password"
                      value={passwordConfirm}
                      onChange={(e) => setPasswordConfirm(e.target.value)}
                      required
                      minLength={6}
                    />
                    <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400">
                      lock_reset
                    </span>
                  </div>
                </div>
              </div>

              {errorMsg && (
                <p className="text-sm text-red-500 font-medium text-center bg-red-50 py-2 rounded-lg">
                  {errorMsg}
                </p>
              )}

              <button
                className="w-full bg-primary text-white font-bold py-4 rounded-full shadow-lg shadow-primary/20 hover:bg-primary-dark active:scale-95 transition-all flex justify-center items-center gap-2 mt-2"
                type="submit"
                disabled={loading}
              >
                <span>{loading ? '변경 중...' : '비밀번호 변경하기'}</span>
              </button>
            </form>
          )}
        </div>
      </main>
    </div>
  )
}
