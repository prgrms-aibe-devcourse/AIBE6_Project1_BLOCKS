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

  const fetchProfile = async (userId: string, authUser?: User) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single()
      if (!error && data) {
        setProfile(data)
      } else if (error?.code === 'PGRST116' && authUser) {
        // 최초 소셜 로그인 등 프로필이 없는 경우 자동 생성
        let baseName = 'User'
        if (authUser.user_metadata) {
          baseName =
            authUser.user_metadata.name ||
            authUser.user_metadata.full_name ||
            authUser.user_metadata.nickname ||
            (authUser.email ? authUser.email.split('@')[0] : 'User')
        }
        
        // 닉네임 중복을 피하기 위해 임의의 숫자 부여
        const defaultNickname = `${baseName}_${Math.floor(Math.random() * 10000)}`

        const { data: newProfile, error: insertError } = await supabase
          .from('profiles')
          .insert({
            user_id: userId,
            nickname: defaultNickname,
          })
          .select()
          .single()

        if (!insertError && newProfile) {
          setProfile(newProfile)
        } else if (insertError?.code === '23505') {
          // 동시성 문제로 이미 다른 요청에서 프로필이 생성된 경우 재조회
          const { data: retryData } = await supabase
            .from('profiles')
            .select('*')
            .eq('user_id', userId)
            .single()
          if (retryData) {
            setProfile(retryData)
          }
        } else {
          console.error('Failed to create auto profile:', insertError)
          setProfile(null)
        }
      } else {
        setProfile(null)
      }
    } catch (err) {
      console.error('Fetch profile error:', err)
      setProfile(null)
    }
  }

  useEffect(() => {
    let mounted = true
    let isInitialized = false

    // 비상 탈출을 위한 타이머: 카카오 로그인 뒤로가기 등에서 getSession이 계속 펜딩되는 현상 방지.
    const fallbackTimer = setTimeout(() => {
      if (mounted && !isInitialized) {
        console.warn('Auth initialization timed out, unlocking router...')
        setLoading(false)
        isInitialized = true
      }
    }, 800)

    // BFCache (뒤로가기) 복원 시 강제로 잠금 해제
    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted && mounted) {
        console.warn('Page restored from BFCache, unlocking router...')
        setLoading(false)
        isInitialized = true
      }
    }
    window.addEventListener('pageshow', handlePageShow)

    const initializeAuth = async () => {
      try {
        // OAuth 취소 등으로 인한 복귀 시 Hash 파싱 중 무한 대기하는 Supabase 버그 우회
        if (typeof window !== 'undefined' && window.location.hash.includes('error=')) {
          window.history.replaceState(null, '', window.location.pathname + window.location.search)
        }

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
            await fetchProfile(session.user.id, session.user)
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
            await fetchProfile(session.user.id, session.user)
          } else {
            setProfile(null)
          }
        }
      },
    )

    return () => {
      mounted = false
      clearTimeout(fallbackTimer)
      window.removeEventListener('pageshow', handlePageShow)
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
      window.location.href = '/'
    }
  }

  // GUEST_ONLY_ROUTES('/login' 등) 에서는 로딩 스피너를 아예 띄우지 않고 페이지를 바로 노출합니다.
  // 이로써 카카오 로그인창에서 뒤로가기 시 흔히 발생하는 브라우저 BFCache 무한 펜딩 상태를 원천 차단합니다.
  const isProtectedRoute = pathname
    ? AUTH_REQUIRED_ROUTES.some((route) => pathname.startsWith(route)) ||
      pathname.startsWith('/pwdchange')
    : false

  if (loading && isProtectedRoute) {
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
