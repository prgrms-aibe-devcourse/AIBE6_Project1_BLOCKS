'use client'
import { getAdminUuid } from '@/actions/admin'
import KakaoMapModal from '@/components/festival/KakaoMapModal'
import { useAuth } from '@/components/providers/AuthProvider'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

interface FestivalFormProps {
  festivalId?: string | string[]
}

export default function FestivalForm({ festivalId }: FestivalFormProps) {
  const router = useRouter()
  const { user, loading } = useAuth()
  const isEditMode = Boolean(festivalId)

  const [text, setText] = useState('')
  const [blob, setBlob] = useState<Blob | null>(null)

  // 수정 모드일 때 기존 이미지 URL
  const [existingPicture, setExistingPicture] = useState<string | null>(null)

  // 주소 및 카카오맵 관련 상태
  const [address, setAddress] = useState('')
  const [isMapOpen, setIsMapOpen] = useState(false)

  // 폼 초기값 (uncontrolled input 을 쓸 요소들 대비)
  const [initialData, setInitialData] = useState<any>(null)

  // 상태: 권한, 페칭, 제출 여부
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isAdminChecking, setIsAdminChecking] = useState(true)
  const [isDataFetching, setIsDataFetching] = useState(isEditMode)

  // 1. 관리자 권한 확인
  useEffect(() => {
    const checkAdmin = async () => {
      if (loading) return

      if (!user) {
        alert('관리자 로그인이 필요한 페이지입니다.')
        router.replace('/')
        return
      }

      const adminUuid = await getAdminUuid()
      if (user.id !== adminUuid) {
        alert('이 페이지에 접근할 권한이 없습니다.')
        router.replace('/')
      } else {
        setIsAdminChecking(false)
      }
    }
    checkAdmin()
  }, [user, loading, router])

  // 2. 수정 모드일 때 기존 데이터 불러오기
  useEffect(() => {
    if (isEditMode && !isAdminChecking) {
      const fetchFestival = async () => {
        try {
          const { data, error } = await supabase
            .from('festivals')
            .select('*')
            .eq('festival_id', festivalId)
            .single()

          if (error) throw error

          if (data) {
            setInitialData(data)
            setText(data.contents || '')
            setAddress(data.address || '')
            if (data.picture) {
              const { data: imgData } = supabase.storage
                .from('festival')
                .getPublicUrl(data.picture)
              setExistingPicture(imgData.publicUrl)
            }
          }
        } catch (err) {
          console.error(err)
          alert('기존 축제 정보를 불러오지 못했습니다.')
          router.replace('/')
        } finally {
          setIsDataFetching(false)
        }
      }
      fetchFestival()
    }
  }, [isEditMode, festivalId, isAdminChecking, router])

  const onSubmitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (isSubmitting) return

    if (!blob && !existingPicture) {
      alert('이미지를 선택해주세요.')
      return
    }
    if (!address) {
      alert('상세 주소를 검색(지도에서 선택)하여 입력해주세요.')
      return
    }
    if (!user) {
      alert('세션 정보가 만료되었거나 유효하지 않습니다.')
      return
    }

    setIsSubmitting(true)

    try {
      const form = e.currentTarget
      const payload: any = {
        option1: (form.themeitems as HTMLSelectElement).value,
        contents: text,
        title: (form.ctitle as HTMLInputElement).value,
        start_date: (form.Festasdate as HTMLInputElement).value,
        end_date: (form.Festafdate as HTMLInputElement).value,
        option2: (form.FestaLocation as HTMLSelectElement).value,
        address: address,
      }

      // 1. 이미지를 바꾼 경우에만 uuid와 업로드 로직 실행
      let newFileName = initialData?.picture || '' // 기존 파일명이 있으면 기본 유지

      if (blob) {
        // 기존 파일이 있더라도 새 UUID로 등록
        // 만약 기존 파일명에 upsert 하고 싶다면 아래 로직 유지, 아니면 새 uuid 생성
        newFileName = uuidv4().replace(/-/g, '') + '.jpg'
        payload.picture = newFileName
      } else if (!blob && isEditMode) {
        // 이미지를 변경하지 않은 경우, 원본 파일명 유지
        payload.picture = initialData.picture
      }

      // 등록 vs 수정 분기
      let dbError = null

      if (isEditMode) {
        const { error: updateError } = await supabase
          .from('festivals')
          .update([payload])
          .eq('festival_id', festivalId)
        dbError = updateError
      } else {
        payload.rating = 0 // 등록 시에만 초기값
        const { error: insertError } = await supabase
          .from('festivals')
          .insert([payload])
        dbError = insertError
      }

      if (dbError) {
        console.error(dbError)
        alert(`축제 저장 중 오류가 발생했습니다: ${dbError.message}`)
        return
      }

      // DB 저장이 성공했다면 이미지 파일스토리지 업로드 (새 파일이 업로드된 경우에만)
      if (blob) {
        const filePath = './' + newFileName
        const { error: storageError } = await supabase.storage
          .from('festival')
          .upload(filePath, blob, {
            upsert: true, // 이전 방식과 호환을 위해 upsert 허용
          })

        if (storageError) {
          console.error(storageError)
          alert(`이미지 등록 중 오류가 발생했습니다: ${storageError.message}`)
          return
        }
      }

      alert(
        isEditMode
          ? '축제가 수정되었습니다.'
          : '축제가 성공적으로 등록되었습니다.',
      )
      router.replace('/')
    } catch (err: any) {
      console.error(err)
      alert(`알 수 없는 에러가 발생했습니다: ${err.message}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const imagechange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.type !== 'image/jpeg' && file.type !== 'image/png') {
      alert('JPEG 또는 PNG 파일만 선택해주세요!')
      return
    }

    setBlob(file)
  }

  // 로딩 UI
  if (loading || isAdminChecking || isDataFetching) {
    return (
      <div className="flex items-center justify-center min-h-[100dvh] bg-neutral-50">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="bg-neutral-50 text-neutral-900 min-h-screen relative">
      <main className="max-w-3xl mx-auto p-6 w-full mb-10">
        <div className="mb-10 text-center">
          <nav className="flex justify-center gap-2 text-xs font-label tracking-widest text-neutral-500 uppercase mb-4">
            <span>Events</span>
            <span>/</span>
            <span className="text-primary font-bold">
              {isEditMode ? 'Modify Festival' : 'New Festival'}
            </span>
          </nav>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-neutral-900 mb-2">
            축제 {isEditMode ? '수정' : '등록'}
          </h1>
          <p className="text-neutral-500 max-w-2xl mx-auto leading-relaxed">
            아래의 정보를 상세히 입력하여 축제를 홍보하고 관리할 수 있습니다.
          </p>
        </div>

        <form className="space-y-8" onSubmit={onSubmitForm}>
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-neutral-200 space-y-8">
            {/* Image Section */}
            <section>
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">
                  image
                </span>
                대표 이미지
              </h3>
              <div className="aspect-[21/9] rounded-2xl overflow-hidden bg-neutral-50 flex flex-col items-center justify-center border-2 border-dashed border-neutral-300 relative group cursor-pointer hover:bg-primary/5 transition-colors">
                <img
                  alt="Preview Placeholder"
                  className={`absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${!blob && !existingPicture ? 'opacity-20' : 'opacity-100 z-10'}`}
                  src={
                    blob
                      ? URL.createObjectURL(blob)
                      : existingPicture
                        ? existingPicture
                        : 'https://lh3.googleusercontent.com/aida-public/AB6AXuDy_OLWGEQmOPSkpxgYUqUPw9Zbh2NIdNV5iO_NJqvn9PoWbsnEe0TKWcFvmumTHUKMpmfi956x29y3AXBrSWs-GrxHw1pMwaarRQpdRbkT1lbkC6Mm8qrFi1QdRjTUXKJhDcf1Bt9VHz8QTshaiQ8nn4BPki-3C7f8SLVOD9XJOcrCiOLYv84ChO0xDUZhgJpyfnC_fHzG9hfahjj4qcN23brcgCc36PdAxlipY3pEQ5EcWj1jet_uGYRvLROW9i9ihnFTvnXBJ00'
                  }
                />
                {!blob && !existingPicture && (
                  <div className="relative z-10 flex flex-col items-center p-4 text-center">
                    <span className="material-symbols-outlined text-4xl text-primary mb-2">
                      cloud_upload
                    </span>
                    <span className="text-sm font-bold text-neutral-900">
                      클릭하여 이미지 업로드
                    </span>
                    <span className="text-xs text-neutral-500 mt-1">
                      PNG, JPG (최대 10MB)
                    </span>
                  </div>
                )}
                {(blob || existingPicture) && (
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity z-20 flex flex-col items-center justify-center text-white">
                    <span className="material-symbols-outlined text-4xl mb-2">
                      edit
                    </span>
                    <span className="font-bold">이미지 변경하기</span>
                  </div>
                )}
                <input
                  className="absolute inset-0 opacity-0 cursor-pointer z-30"
                  type="file"
                  accept=".jpg, .jpeg, .png"
                  onChange={imagechange}
                />
              </div>
            </section>

            {/* Basic Info Section */}
            <section>
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2 border-t border-neutral-100 pt-8">
                <span className="material-symbols-outlined text-primary">
                  info
                </span>
                기본 정보
              </h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-neutral-500 mb-2">
                    축제 제목
                  </label>
                  <input
                    id="ctitle"
                    name="ctitle"
                    defaultValue={initialData?.title}
                    className="w-full bg-neutral-50 border-none rounded-xl px-5 py-4 text-neutral-900 placeholder:text-neutral-400 focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                    placeholder="축제의 멋진 이름을 입력하세요"
                    type="text"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-neutral-500 mb-2">
                      테마 카테고리
                    </label>
                    <div className="relative">
                      <select
                        id="themeitems"
                        name="themeitems"
                        defaultValue={initialData?.option1 || '문화/예술'}
                        key={initialData?.option1} // 초기값 세팅을 위해 강제 렌더링
                        className="w-full appearance-none bg-neutral-50 border-none rounded-xl px-5 py-4 text-neutral-900 focus:ring-2 focus:ring-primary/20 transition-all font-medium cursor-pointer"
                        required
                      >
                        <option value="문화/예술">문화/예술</option>
                        <option value="음식">음식</option>
                        <option value="음악/공연">음악/공연</option>
                        <option value="전통/역사">전통/역사</option>
                        <option value="자연/야외">자연/야외</option>
                        <option value="스포츠">스포츠</option>
                      </select>
                      <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-400">
                        expand_more
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-neutral-500 mb-2">
                      지역 선택
                    </label>
                    <div className="relative">
                      <select
                        id="FestaLocation"
                        name="FestaLocation"
                        defaultValue={initialData?.option2 || '서울'}
                        key={initialData?.option2}
                        className="w-full appearance-none bg-neutral-50 border-none rounded-xl px-5 py-4 text-neutral-900 focus:ring-2 focus:ring-primary/20 transition-all font-medium cursor-pointer"
                        required
                      >
                        <option value="서울">서울</option>
                        <option value="경기">경기도</option>
                        <option value="강원">강원도</option>
                        <option value="전라">전라도</option>
                        <option value="경상">경상도</option>
                        <option value="제주">제주도</option>
                        <option value="충청">충청도</option>
                      </select>
                      <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-400">
                        expand_more
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-neutral-500 mb-2">
                    상세 주소
                  </label>
                  <div className="relative flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                      <input
                        id="festaLocationDetail"
                        name="festaLocationDetail"
                        className="w-full bg-neutral-50 border-none rounded-xl px-5 py-4 pl-12 text-neutral-900 placeholder:text-neutral-400 focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                        placeholder="지도에서 축제 장소를 선택해주세요"
                        type="text"
                        value={address}
                        readOnly
                        required
                      />
                      <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400">
                        location_on
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsMapOpen(true)}
                      className="px-6 py-4 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all w-full md:w-auto shrink-0 cursor-pointer"
                    >
                      지도에서 검색
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* Date and Content Section */}
            <section>
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2 border-t border-neutral-100 pt-8">
                <span className="material-symbols-outlined text-primary">
                  calendar_today
                </span>
                일정 및 상세 설명
              </h3>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-neutral-500 mb-2">
                      시작일
                    </label>
                    <input
                      id="Festasdate"
                      name="Festasdate"
                      defaultValue={initialData?.start_date?.split('T')[0]} // 날짜 형식 포맷팅
                      className="w-full bg-neutral-50 border-none rounded-xl px-5 py-4 text-neutral-900 focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                      type="date"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-neutral-500 mb-2">
                      종료일
                    </label>
                    <input
                      id="Festafdate"
                      name="Festafdate"
                      defaultValue={initialData?.end_date?.split('T')[0]}
                      className="w-full bg-neutral-50 border-none rounded-xl px-5 py-4 text-neutral-900 focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                      type="date"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-neutral-500 mb-2">
                    축제 설명
                  </label>
                  <textarea
                    id="cn"
                    name="cn"
                    className="w-full bg-neutral-50 border-none rounded-xl px-5 py-4 text-neutral-900 placeholder:text-neutral-400 focus:ring-2 focus:ring-primary/20 transition-all font-medium resize-none shadow-none focus:outline-none"
                    placeholder="축제의 특징, 프로그램, 관람 포인트 등을 자유롭게 작성해주세요."
                    rows={8}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    required
                  ></textarea>
                </div>
              </div>
            </section>

            <div className="pt-8 border-t border-neutral-100 flex flex-col sm:flex-row gap-4">
              <button
                className={`flex-1 py-4 text-white rounded-full font-bold shadow-lg flex items-center justify-center gap-2 transition-all outline-none 
                  ${isSubmitting ? 'bg-neutral-300 shadow-none cursor-not-allowed' : 'bg-[#FF7676] shadow-[#FF7676]/30 hover:scale-[1.02] active:scale-95 cursor-pointer'}
                `}
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/80 border-t-white rounded-full animate-spin"></div>
                    {isEditMode ? '수정 중...' : '등록 중...'}
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined">
                      {isEditMode ? 'edit' : 'publish'}
                    </span>
                    축제 {isEditMode ? '수정하기' : '등록하기'}
                  </>
                )}
              </button>
              <button
                className="flex-1 py-4 bg-white border border-neutral-200 text-neutral-500 rounded-full font-bold hover:bg-neutral-50 transition-colors flex items-center justify-center gap-2 outline-none cursor-pointer"
                type="button"
                onClick={() => router.back()}
                disabled={isSubmitting}
              >
                <span className="material-symbols-outlined">close</span>
                취소
              </button>
            </div>
          </div>
        </form>
      </main>

      <KakaoMapModal
        isOpen={isMapOpen}
        onClose={() => setIsMapOpen(false)}
        onAddressSelect={setAddress}
        initialAddress={address}
      />
    </div>
  )
}
