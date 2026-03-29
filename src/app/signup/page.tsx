'use client'

import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import DaumPostcodeEmbed from 'react-daum-postcode'

export default function SignUp() {
  const router = useRouter()
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

        // 2. Insert into public.profiles
        const { error: profileError } = await supabase.from('profiles').insert({
          user_id: authData.user.id,
          nickname: formData.nickname,
          address: finalAddress,
        })

        if (profileError) {
          console.error('Profile Insert Error:', profileError)
          throw new Error('프로필 정보 저장 중 오류가 발생했습니다.')
        }

        alert('회원가입이 완료되었습니다!')
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
    <div className="bg-neutral-50 text-neutral-900 min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px]"></div>
      </div>

      {/* Registration Card */}
      <div className="w-full max-w-md bg-white border border-neutral-300 rounded-xl shadow-card p-8 md:p-10 z-10 relative my-8">
        <div className="text-center mb-10">
          <Link href="/">
            <h1
              className="text-4xl font-black text-neutral-900 tracking-tighter mb-2"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              <span className="text-primary">Festa</span>Plan
            </h1>
          </Link>
          <p className="text-neutral-500 font-medium text-sm tracking-tight">
            새로운 여정을 함께 시작하세요
          </p>
        </div>
        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* Email Field */}
          <div className="space-y-1.5">
            <label className="block text-[10px] tracking-widest uppercase font-bold text-neutral-500 ml-1">
              이메일 주소
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 text-lg">
                mail
              </span>
              <input
                required
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-3.5 bg-neutral-100 border-none rounded-xl focus:ring-2 focus:ring-primary text-neutral-900 placeholder:text-neutral-400 text-sm transition-all outline-none"
                placeholder="example@festaplan.com"
                type="email"
              />
            </div>
          </div>
          {/* Password Field */}
          <div className="space-y-1.5">
            <label className="block text-[10px] tracking-widest uppercase font-bold text-neutral-500 ml-1">
              비밀번호
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 text-lg">
                lock
              </span>
              <input
                required
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-3.5 bg-neutral-100 border-none rounded-xl focus:ring-2 focus:ring-primary text-neutral-900 placeholder:text-neutral-400 text-sm transition-all outline-none"
                placeholder="••••••••"
                type="password"
                minLength={6}
              />
            </div>
          </div>
          {/* Password Confirmation Field */}
          <div className="space-y-1.5">
            <label className="block text-[10px] tracking-widest uppercase font-bold text-neutral-500 ml-1">
              비밀번호 확인
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 text-lg">
                lock_reset
              </span>
              <input
                required
                name="passwordConfirm"
                value={formData.passwordConfirm}
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-3.5 bg-neutral-100 border-none rounded-xl focus:ring-2 focus:ring-primary text-neutral-900 placeholder:text-neutral-400 text-sm transition-all outline-none"
                placeholder="••••••••"
                type="password"
              />
            </div>
          </div>
          {/* Nickname Field */}
          <div className="space-y-1.5">
            <label className="block text-[10px] tracking-widest uppercase font-bold text-neutral-500 ml-1">
              닉네임
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 text-lg">
                person
              </span>
              <input
                required
                name="nickname"
                value={formData.nickname}
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-3.5 bg-neutral-100 border-none rounded-xl focus:ring-2 focus:ring-primary text-neutral-900 placeholder:text-neutral-400 text-sm transition-all outline-none"
                placeholder="닉네임을 입력해주세요"
                type="text"
              />
            </div>
          </div>
          {/* Address Field */}
          <div className="space-y-1.5">
            <label className="block text-[10px] tracking-widest uppercase font-bold text-neutral-500 ml-1">
              주소
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 text-lg">
                location_on
              </span>
              <input
                readOnly
                required
                name="address"
                value={formData.address}
                onClick={() => setIsAddressOpen(true)}
                className="w-full pl-12 pr-4 py-3.5 bg-neutral-100 border-none rounded-xl focus:ring-2 focus:ring-primary text-neutral-900 placeholder:text-neutral-400 text-sm transition-all outline-none cursor-pointer"
                placeholder="클릭하여 주소를 검색해주세요"
                type="text"
              />
            </div>
          </div>
          {/* Detailed Address Field (only visible if address is selected) */}
          {formData.address && (
            <div className="space-y-1.5 animate-fade-in mt-3">
              <label className="block text-[10px] tracking-widest uppercase font-bold text-neutral-500 ml-1">
                상세 주소
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 text-lg">
                  home
                </span>
                <input
                  required
                  name="detailAddress"
                  value={formData.detailAddress}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3.5 bg-neutral-100 border-none rounded-xl focus:ring-2 focus:ring-primary text-neutral-900 placeholder:text-neutral-400 text-sm transition-all outline-none"
                  placeholder="나머지 상세 주소를 입력해주세요"
                  type="text"
                />
              </div>
            </div>
          )}

          {/* Signup Button */}
          <button
            disabled={loading}
            className="w-full bg-primary text-white py-4 rounded-full font-bold shadow-lg shadow-primary/20 hover:bg-primary-dark active:scale-95 transition-all duration-150 mt-4 disabled:opacity-50 hover:cursor-pointer"
            type="submit"
          >
            {loading ? '가입 중...' : '가입하기'}
          </button>
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
      </div>

      {/* Address Search Modal */}
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
                className="text-neutral-500 hover:text-neutral-900 transition-colors"
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
    </div>
  )
}
