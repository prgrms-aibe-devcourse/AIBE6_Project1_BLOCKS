'use client'

import { useAuthUI } from '@/components/auth/useAuthUI'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import DaumPostcodeEmbed from 'react-daum-postcode'

export default function SignUp() {
  const router = useRouter()
  const { AuthLayout, AuthHeader, AuthInput, AuthButton } = useAuthUI()
  const [loading, setLoading] = useState(false)
  const [isAddressOpen, setIsAddressOpen] = useState(false)

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    passwordConfirm: '',
    nickname: '',
    address: '',
    detailAddress: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleCompletePostcode = (data: any) => {
    let fullAddress = data.address
    let extraAddress = ''

    if (data.addressType === 'R') {
      if (data.bname !== '') {
        extraAddress += data.bname
      }
      if (data.buildingName !== '') {
        extraAddress +=
          extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName
      }
      fullAddress += extraAddress !== '' ? ` (${extraAddress})` : ''
    }

    setFormData((prev) => ({ ...prev, address: fullAddress }))
    setIsAddressOpen(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (
      !formData.email ||
      !formData.password ||
      !formData.nickname ||
      !formData.address
    ) {
      return alert('모든 필수 항목을 입력해주세요.')
    }

    if (formData.password !== formData.passwordConfirm) {
      return alert('비밀번호가 일치하지 않습니다.')
    }

    try {
      setLoading(true)

      // 0. Nickname Duplicate Check
      const { data: existingProfiles, error: checkError } = await supabase
        .from('profiles')
        .select('nickname')
        .eq('nickname', formData.nickname)
        .limit(1)

      if (checkError) {
        throw new Error('닉네임 중복 확인 중 오류가 발생했습니다.')
      }

      if (existingProfiles && existingProfiles.length > 0) {
        setLoading(false)
        return alert('이미 사용 중인 닉네임입니다. 다른 닉네임을 입력해주세요.')
      }

      // 1. Supabase Auth SignUp
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            nickname: formData.nickname,
          },
        },
      })

      if (authError) throw authError

      if (authData.user) {
        const finalAddress = formData.detailAddress
          ? `${formData.address} ${formData.detailAddress}`
          : formData.address

        // 2. Insert into public.profiles via server API (admin client bypasses RLS)
        // 이메일 확인 대기 상태에서는 클라이언트 세션이 없어 RLS가 막으므로 서버에서 처리
        const res = await fetch('/api/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: authData.user.id,
            nickname: formData.nickname,
            address: finalAddress,
          }),
        })

        if (!res.ok) {
          let profileError = '서버 통신 중 오류가 발생했습니다.'
          try {
            const errData = await res.json()
            if (errData.error) profileError = errData.error
          } catch(e) {
            console.error('Non-JSON response received from /api/signup')
            profileError = 'API 서버가 응답하지 않습니다 (.env 환경변수 설정 누락 의심).'
          }
          throw new Error(profileError)
        }

        alert('회원가입이 완료되었습니다!\n이메일 인증 후 로그인해주세요.')
        router.push('/login')
      }
    } catch (error: any) {
      console.error('Signup Error:', error)
      alert(error.message || '회원가입 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout isWide>
      <AuthHeader
        title={
          <>
            <span className="text-primary">Festa</span>Plan
          </>
        }
        subtitle="새로운 여정을 함께 시작하세요"
        isLogo
      />

      <form className="space-y-5" onSubmit={handleSubmit}>
        <AuthInput
          label="이메일 주소"
          name="email"
          type="email"
          placeholder="example@festaplan.com"
          value={formData.email}
          onChange={handleChange}
          icon="mail"
          required
        />
        <AuthInput
          label="비밀번호"
          name="password"
          type="password"
          placeholder="••••••••"
          value={formData.password}
          onChange={handleChange}
          icon="lock"
          required
          minLength={6}
        />
        <AuthInput
          label="비밀번호 확인"
          name="passwordConfirm"
          type="password"
          placeholder="••••••••"
          value={formData.passwordConfirm}
          onChange={handleChange}
          icon="lock_reset"
          required
        />
        <AuthInput
          label="닉네임"
          name="nickname"
          type="text"
          placeholder="닉네임을 입력해주세요"
          value={formData.nickname}
          onChange={handleChange}
          icon="person"
          required
        />
        <AuthInput
          label="주소"
          name="address"
          type="text"
          placeholder="클릭하여 주소를 검색해주세요"
          value={formData.address}
          onClick={() => setIsAddressOpen(true)}
          readOnly
          icon="location_on"
          className="cursor-pointer"
          required
        />
        {formData.address && (
          <div className="animate-fade-in mt-3">
            <AuthInput
              label="상세 주소"
              name="detailAddress"
              type="text"
              placeholder="나머지 상세 주소를 입력해주세요"
              value={formData.detailAddress}
              onChange={handleChange}
              icon="home"
              required
            />
          </div>
        )}

        <AuthButton type="submit" loading={loading} loadingText="가입 중...">
          가입하기
        </AuthButton>
      </form>

      <div className="pt-8 flex items-center justify-center space-x-2 text-xs font-medium text-neutral-500">
        <span>이미 계정이 있으신가요?</span>
        <Link
          href="/login"
          className="text-primary font-bold hover:underline transition-all"
        >
          로그인
        </Link>
      </div>

      {isAddressOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-fade-in"
          onClick={() => setIsAddressOpen(false)}
        >
          <div
            className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-4 border-b border-neutral-200">
              <h3 className="font-bold text-neutral-900">우편번호 찾기</h3>
              <button
                type="button"
                className="text-neutral-500 hover:text-neutral-900 transition-colors cursor-pointer"
                onClick={() => setIsAddressOpen(false)}
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="p-2 h-[400px]">
              <DaumPostcodeEmbed
                onComplete={handleCompletePostcode}
                style={{ height: '100%' }}
              />
            </div>
          </div>
        </div>
      )}
    </AuthLayout>
  )
}
