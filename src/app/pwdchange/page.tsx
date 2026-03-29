'use client'

import { useAuthUI } from '@/components/auth/useAuthUI'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function PwdChange() {
  const router = useRouter()
  const { AuthLayout, AuthHeader, AuthInput, AuthButton } = useAuthUI()
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
    <AuthLayout hasTopAccent>
      <AuthHeader
        title="새 비밀번호 설정"
        subtitle="새롭게 사용할 비밀번호를 입력해 주세요"
      />

      {isSuccess ? (
        <div className="text-center space-y-6">
          <div className="mx-auto w-16 h-16 bg-primary-light text-primary rounded-full flex items-center justify-center">
            <span className="material-symbols-outlined text-3xl">
              check_circle
            </span>
          </div>
          <div>
            <h2 className="text-lg font-bold mb-2">변경 완료</h2>
            <p className="text-sm text-neutral-500">
              비밀번호가 성공적으로 변경되었습니다.
              <br />
              새로운 비밀번호로 로그인해 주세요.
            </p>
          </div>
          <AuthButton onClick={() => router.push('/login')}>
            로그인 화면으로 이동
          </AuthButton>
        </div>
      ) : (
        <form className="space-y-6" onSubmit={handleChangePassword}>
          <div className="space-y-4">
            <AuthInput
              label="새 비밀번호"
              id="password"
              type="password"
              placeholder="새 비밀번호 (6자 이상)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon="lock"
              iconPosition="right"
              required
              minLength={6}
            />

            <AuthInput
              label="새 비밀번호 확인"
              id="passwordConfirm"
              type="password"
              placeholder="비밀번호 다시 입력"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              icon="lock_reset"
              iconPosition="right"
              required
              minLength={6}
            />
          </div>

          {errorMsg && (
            <p className="text-sm text-red-500 font-medium text-center bg-red-50 py-2 rounded-lg">
              {errorMsg}
            </p>
          )}

          <AuthButton type="submit" loading={loading} loadingText="변경 중...">
            비밀번호 변경하기
          </AuthButton>
        </form>
      )}
    </AuthLayout>
  )
}
