'use client'

import { useAuthUI } from '@/components/auth/useAuthUI'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { AuthLayout, AuthHeader, AuthInput, AuthButton } = useAuthUI()

  const getRedirectPath = () => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      return params.get('redirect_to') || '/'
    }
    return '/'
  }

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        throw error
      }

      router.push(getRedirectPath())
    } catch (error) {
      console.error('Login error:', error)
      alert('로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.')
    } finally {
      setLoading(false)
    }
  }

  const handleSocialLogin = async (provider: 'google' | 'kakao') => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}${getRedirectPath()}`,
        },
      })

      if (error) {
        throw error
      }
    } catch (error) {
      console.error('Login error:', error)
      alert('로그인 중 오류가 발생했습니다. 다시 시도해 주세요.')
    }
  }

  return (
    <AuthLayout className="border-neutral-200">
      <AuthHeader
        title={
          <>
            <span className="text-primary">Festa</span>Plan
          </>
        }
        subtitle="특별한 축제를 찾아보세요"
        isLogo
      />

      <form className="space-y-4" onSubmit={handleLogin}>
        <AuthInput
          label="이메일 주소"
          id="email"
          type="email"
          placeholder="이메일을 입력하세요"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <AuthInput
          label="비밀번호"
          id="password"
          type="password"
          placeholder="비밀번호를 입력하세요"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <AuthButton type="submit" loading={loading} loadingText="로그인 중...">
          로그인
        </AuthButton>
      </form>

      <div className="mt-6 flex items-center justify-center space-x-4 text-xs font-medium text-neutral-500">
        <Link href="/findpwd" className="hover:text-primary transition-colors">
          비밀번호 찾기
        </Link>
        <span className="w-1 h-1 bg-neutral-200 rounded-full"></span>
        <Link href="/signup" className="hover:text-primary transition-colors">
          회원가입
        </Link>
      </div>

      <div className="py-8 flex items-center gap-4">
        <div className="h-[1px] flex-1 bg-neutral-200"></div>
        <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
          SNS 계정으로 시작하기
        </span>
        <div className="h-[1px] flex-1 bg-neutral-200"></div>
      </div>

      <div className="space-y-3 pb-4">
        <button
          type="button"
          onClick={() => handleSocialLogin('kakao')}
          className="w-full flex items-center justify-center gap-3 px-4 py-3.5 bg-[#FEE500] rounded-xl font-medium text-zinc-900 hover:brightness-95 transition-all active:scale-[0.98] duration-150 hover:cursor-pointer"
        >
          <span
            className="material-symbols-outlined text-[20px] text-zinc-900"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            chat_bubble
          </span>
          <span>카카오로 로그인</span>
        </button>
      </div>
    </AuthLayout>
  )
}
