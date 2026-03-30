'use client'

import { useState } from 'react'
import { Button } from '@/components/common/Button'
import AccountSection from '@/components/mypage/AccountSection'
import SavedPlansSection from '@/components/mypage/SavedPlansSection'
import MyReviewSection from '@/components/mypage/MyReviewSection'
import AccountDangerSection from '@/components/mypage/AccountDangerSection'



function MyPage() {
    return (
        <div className="flex flex-col gap-4 w-full mx-auto max-w-3xl px-4 py-8">
            <AccountSection />
            <SavedPlansSection />
            <MyReviewSection />
            <AccountDangerSection />
        </div>
    )
}

export default MyPage