'use client'

import AccountDangerSection from '@/components/mypage/AccountDangerSection'
import AccountSection from '@/components/mypage/AccountSection'
import MyReviewSection from '@/components/mypage/MyReviewSection'
import SavedPlansSection from '@/components/mypage/SavedPlansSection'
import { useAuth } from '@/components/providers/AuthProvider'

function MyPage() {
  const { user, profile, loading } = useAuth()

  // 로딩 상태 처리
  if (loading || (user && !profile)) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh]">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-neutral-500 text-sm italic font-medium">
          정보를 불러오는 중입니다...
        </p>
      </div>
    )
  }

  // 비로그인 또는 프로필 로드 실패 처리
  if (!user || !profile) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] gap-4 text-center px-4">
        <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mb-2">
          <span className="material-symbols-outlined text-4xl text-neutral-400">
            lock
          </span>
        </div>
        <h2 className="text-xl font-bold text-neutral-900">
          로그인이 필요한 페이지입니다
        </h2>
        <p className="text-neutral-500 max-w-xs">
          마이페이지를 이용하시려면 로그인을 진행해주세요.
        </p>
        <div className="mt-4">
          <a
            href="/login"
            className="bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-primary-dark transition-all shadow-lg shadow-primary/20 inline-block"
          >
            로그인하러 가기
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 w-full mx-auto max-w-3xl px-4 py-8 animate-fade-in">
      <AccountSection profile={profile} user_email={user.user_metadata.email} />
      <SavedPlansSection />
      <MyReviewSection />
      <AccountDangerSection />
    </div>
  )
}

export default MyPage
