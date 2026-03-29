'use client'

import { supabase } from '@/lib/supabase'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

const GUEST_ONLY_ROUTES = ['/login', '/signup', '/findpwd']
const AUTH_REQUIRED_ROUTES = ['/mypage', '/planner']

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    let mounted = true

    const initializeAuth = async () => {
      const { data } = await supabase.auth.getSession()
      if (mounted) {
        setSession(data.session)
        setLoading(false)
      }
    }

    initializeAuth()

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) {
        setSession(session)
        setLoading(false)
      }
    })

    return () => {
      mounted = false
      listener.subscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
    if (loading) return

    const isGuestOnlyRoute = GUEST_ONLY_ROUTES.some((route) => pathname.startsWith(route))
    const isAuthRequiredRoute = AUTH_REQUIRED_ROUTES.some((route) => pathname.startsWith(route))
    const isPwdChangeRoute = pathname.startsWith('/pwdchange')

    if (session) {
      // 로긴된 유저가 로그인/회원가입 등 페이지로 접근 시
      if (isGuestOnlyRoute) {
        router.replace('/')
      }
    } else {
      // 비로그인 유저가 마이페이지, 플래너 등에 접근 시
      if (isAuthRequiredRoute) {
        router.replace('/login')
      } else if (isPwdChangeRoute) {
        // 비밀번호 초기화 페이지는 해시 파라미터가 있어야 함
        const hash = window.location.hash
        if (!hash.includes('access_token')) {
          router.replace('/')
        }
      }
    }
  }, [session, pathname, loading, router])

  // 권한 체크가 필요한 라우트인 경우, 로딩 중이면 콘텐츠가 잠깐 보이지 않도록 스피너 띄움
  const isProtectedOrGuestRoute = 
    GUEST_ONLY_ROUTES.some((route) => pathname.startsWith(route)) ||
    AUTH_REQUIRED_ROUTES.some((route) => pathname.startsWith(route)) ||
    pathname.startsWith('/pwdchange');

  if (loading && isProtectedOrGuestRoute) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-neutral-50">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return <>{children}</>
}
