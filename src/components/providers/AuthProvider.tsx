'use client'

import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'
import { usePathname, useRouter } from 'next/navigation'
import React, { createContext, useContext, useEffect, useState } from 'react'
import { Profile } from '@/types/profile'

type AuthContextType = {
  user: User | null
  profile: Profile | null
  loading: boolean
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  logout: async () => { },
})

export const useAuth = () => useContext(AuthContext)

const GUEST_ONLY_ROUTES = ['/login', '/signup', '/findpwd']
const AUTH_REQUIRED_ROUTES = ['/mypage', '/planner']

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const pathname = usePathname()
  const router = useRouter()

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single()
      if (!error && data) {
        setProfile(data)
      } else {
        setProfile(null)
      }
    } catch {
      setProfile(null)
    }
  }

  useEffect(() => {
    let mounted = true
    let isInitialized = false

    const initializeAuth = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession()
        if (error) throw error

        if (mounted) {
          setUser(session?.user || null)
          setLoading(false) // Unlock routing instantly!
          isInitialized = true

          if (session?.user) {
            await fetchProfile(session.user.id)
          }
        }
      } catch (err) {
        if (mounted) setLoading(false)
      }
    }

    initializeAuth()

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (mounted) {
          setUser(session?.user || null)

          // Ensure routing is unlocked even if initializeAuth hasn't finished
          if (!isInitialized) {
            setLoading(false)
            isInitialized = true
          }

          if (session?.user) {
            await fetchProfile(session.user.id)
          } else {
            setProfile(null)
          }
        }
      },
    )

    return () => {
      mounted = false
      listener.subscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
    if (loading || !pathname) return

    const isGuestOnlyRoute = GUEST_ONLY_ROUTES.some((route) =>
      pathname.startsWith(route),
    )
    const isAuthRequiredRoute = AUTH_REQUIRED_ROUTES.some((route) =>
      pathname.startsWith(route),
    )
    const isPwdChangeRoute = pathname.startsWith('/pwdchange')

    if (user) {
      if (isGuestOnlyRoute) {
        router.replace('/')
      } else if (isPwdChangeRoute) {
        const hash = window.location.hash
        // 치명적인 보안 오류 차단: 이미 로그인 상태더라도 만료된 토큰(error=)으로 접근하면 강제로 세션 보호 및 차단
        if (hash.includes('error=')) {
          alert('만료되었거나 유효하지 않은 비밀번호 변경 링크입니다.')
          logout() // 남의 기기에서 남의 세션이 만료된 링크와 섞이는 것을 원천 차단
        }
      }
    } else {
      if (isAuthRequiredRoute) {
        router.replace('/login')
      } else if (isPwdChangeRoute) {
        const hash = window.location.hash
        // 로그인 안 한 사용자도 만료된 토큰으로 접근 시 차단
        if (hash.includes('error=')) {
          alert('만료되었거나 유효하지 않은 비밀번호 변경 링크입니다.')
          router.replace('/login')
        } else if (!hash.includes('access_token')) {
          router.replace('/')
        }
      }
    }
  }, [user, pathname, loading, router])

  const logout = async () => {
    try {
      // 1초 이상 응답이 없으면 강제로 다음 단계로 넘김 (Supabase 무한 펜딩 방지)
      const timeout = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('timeout')), 1000),
      )
      await Promise.race([supabase.auth.signOut(), timeout])
    } catch (err) {
      console.warn('Logout fallback triggered:', err)
    } finally {
      // 로컬 화면 상태 초기화
      setUser(null)
      setProfile(null)

      // 혹시라도 지워지지 않고 남아있는 Supabase 토큰 강제 삭제 (유령 세션 방지)
      if (typeof window !== 'undefined' && window.localStorage) {
        Object.keys(localStorage).forEach((key) => {
          if (key.startsWith('sb-') && key.endsWith('-auth-token')) {
            localStorage.removeItem(key)
          }
        })
      }

      // 가장 확실하게 상태를 초기화하며 화면 이동
      window.location.href = '/login'
    }
  }

  const isProtectedOrGuestRoute = pathname
    ? GUEST_ONLY_ROUTES.some((route) => pathname.startsWith(route)) ||
    AUTH_REQUIRED_ROUTES.some((route) => pathname.startsWith(route)) ||
    pathname.startsWith('/pwdchange')
    : false

  if (loading && isProtectedOrGuestRoute) {
    return (
      <div className="flex items-center justify-center min-h-[100dvh] bg-neutral-50">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <AuthContext.Provider value={{ user, profile, loading, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
