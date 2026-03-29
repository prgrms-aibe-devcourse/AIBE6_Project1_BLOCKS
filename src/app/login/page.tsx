'use client'

import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        throw error
      }

      router.push('/')
    } catch (error) {
      console.error('Login error:', error)
      alert('로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.')
    }
  }

  const handleSocialLogin = async (provider: 'google' | 'kakao') => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/`,
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
    <div className="bg-neutral-50 text-neutral-900 min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px]"></div>
      </div>

      <main className="w-full max-w-[440px] bg-white border border-neutral-200 shadow-card rounded-xl overflow-hidden z-10 w-full">
        <div className="pt-12 pb-8 px-8 text-center">
          <Link href="/">
            <h1
              className="text-4xl font-black text-neutral-900 tracking-tighter mb-2"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              <span className="text-primary">Festa</span>Plan
            </h1>
          </Link>
          <p className="text-neutral-500 font-medium text-sm tracking-tight">
            특별한 축제를 찾아보세요
          </p>
        </div>
        <form className="px-8 pb-6 space-y-4" onSubmit={handleLogin}>
          <div className="space-y-1.5">
            <label
              className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 ml-1"
              htmlFor="email"
            >
              이메일 주소
            </label>
            <div className="relative">
              <input
                className="w-full px-4 py-3.5 bg-neutral-100 border-none rounded-xl text-neutral-900 placeholder:text-neutral-400 focus:ring-2 focus:ring-primary transition-all outline-none"
                id="email"
                placeholder="이메일을 입력하세요"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <label
              className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 ml-1"
              htmlFor="password"
            >
              비밀번호
            </label>
            <div className="relative">
              <input
                className="w-full px-4 py-3.5 bg-neutral-100 border-none rounded-xl text-neutral-900 placeholder:text-neutral-400 focus:ring-2 focus:ring-primary transition-all outline-none"
                id="password"
                placeholder="비밀번호를 입력하세요"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>
          <button
            className="w-full bg-primary text-white py-4 rounded-full font-bold shadow-lg shadow-primary/20 active:scale-95 transition-transform duration-150 mt-4 hover:bg-primary-dark hover:cursor-pointer"
            type="submit"
          >
            로그인
          </button>
        </form>
        <div className="px-8 flex items-center justify-center space-x-4 text-xs font-medium text-neutral-500">
          <Link href="findpwd" className="hover:text-primary transition-colors">
            비밀번호 찾기
          </Link>
          <span className="w-1 h-1 bg-neutral-200 rounded-full"></span>
          <Link href="/signup" className="hover:text-primary transition-colors">
            회원가입
          </Link>
        </div>
        <div className="px-8 py-8 flex items-center gap-4">
          <div className="h-[1px] flex-1 bg-neutral-200"></div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
            SNS 계정으로 시작하기
          </span>
          <div className="h-[1px] flex-1 bg-neutral-200"></div>
        </div>
        <div className="px-8 pb-12 space-y-3">
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
      </main>
    </div>
  )
}
