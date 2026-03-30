'use client'
import { useState, useEffect, useRef } from "react"
import { Section } from "@/components/common/Section"
import { SectionHeader } from "@/components/common/SectionHeader"
import { Button } from "@/components/common/Button"
import { supabase } from "@/lib/supabase"
import { Profile } from "@/types/profile"

interface AccountSectionProps {
    profile: Profile
}

function AccountSection({ profile }: AccountSectionProps) {
    const [nickname, setNickname] = useState(profile.nickname)
    const [email, setEmail] = useState(profile.email)
    const [pendingFile, setPendingFile] = useState<File | null>(null) //선택됐지만 아직 업로드 안 된 파일
    const [preview, setPreview] = useState<string | null>(null) //로컬 미리보기 URL
    const [picture, setPicture] = useState(profile.picture)
    const [saving, setSaving] = useState(false) //saving state 추가해서 저장 중 Button에 loading={saving} 전달 (이중 클릭 방지)
    const fileInputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (profile.nickname) setNickname(profile.nickname)
        if (profile.picture) setPicture(profile.picture)
        setEmail(profile.email)
    }, [profile.nickname, profile.picture, profile.email])

    // 로컬 ObjectURL 메모리 누수 방지
    useEffect(() => {
        return () => {
            if (preview) URL.revokeObjectURL(preview) //생성한 객체 URL 해제
        }
    }, [preview])

    //파일 선택 시, 미리보기 업데이트
    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        if (file.size > 5 * 1024 * 1024) {
            alert('이미지는 5MB 이하만 업로드 할 수 있어요.')
            return
        }

        if (!file.type.startsWith('image/')) {
            alert('이미지 파일만 업로드 할 수 있어요.')
            return
        }

        setPendingFile(file)
        setPreview(URL.createObjectURL(file)) //미리보기 반영

        e.target.value = '' //같은 파일 재선택 가능하도록 초기화 (안하면 onChange 발생하지 않음)
    }


    const handleSave = async () => {
        setSaving(true)
        try {
            let newImageUrl = picture //기존 image가 기본값

            //새 파일이 선택된 경우에만 업로드
            if (pendingFile) {
                const ext = pendingFile.name.split('.').pop()
                const filePath = `profiles/${profile.user_id}/${Date.now()}.${ext}`

                const { data: uploadData, error: uploadError } = await supabase.storage
                    .from('profile-images')
                    .upload(filePath, pendingFile, { upsert: true })

                if (uploadError) throw uploadError

                const { data: urlData } = supabase.storage
                    .from('profile-images')
                    .getPublicUrl(uploadData.path)

                newImageUrl = urlData.publicUrl
            }

            //DB 업데이트
            const { data, error: dbError } = await supabase
                .from('profiles')
                .update({ nickname, ...(pendingFile && { picture: newImageUrl }) }) //pendingFile이 있으면 image 업데이트
                .eq('user_id', profile.user_id)

            if (dbError) throw dbError

            //성공
            setPicture(newImageUrl)
            setPendingFile(null)
            setPreview(null)
            alert('변경사항이 저장되었습니다!')

        } catch (error) {
            console.error('변경사항 저장 실패:', error)
            alert('변경사항 저장에 실패했습니다. 다시 시도해주세요')
        } finally {
            setSaving(false)
        }
    }


    return (
        <Section>
            <SectionHeader title="계정 설정" />
            <div className="flex flex-col sm:flex-row gap-6 items-start">
                {/* Avatar */}
                <div className="flex flex-col items-center gap-1.5 shrink-0">
                    <div className="relative">
                        <div className="w-20 h-20 rounded-full overflow-hidden bg-[var(--color-neutral-200)] ring-2 ring-[var(--color-border)]">
                            <img
                                src={preview || picture || "https://api.dicebear.com/7.x/adventurer/svg?seed=FestaLover"}
                                alt="프로필"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <button className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center shadow-sm transition-fast hover:bg-[var(--color-primary-dark)]"
                            onClick={() => fileInputRef.current?.click()}>
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                                <path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                        </button>
                    </div>
                    <span className="text-[11px] text-[var(--color-neutral-500)]">{pendingFile ? '저장 버튼을 눌러 적용하세요' : '프로필 이미지 수정'}</span>
                    <input type="file" ref={fileInputRef} onChange={handleFileSelect} accept="image/*" className="hidden" />
                </div>

                {/* Fields */}
                <div className="flex-1 flex flex-col gap-4 w-full">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="flex flex-col gap-1">
                            <label className="text-xs text-[var(--color-neutral-500)]">닉네임</label>
                            <input
                                value={nickname}
                                onChange={e => setNickname(e.target.value)}
                                className="h-10 px-3 rounded-[var(--radius-md)] border border-[var(--color-border)] text-sm text-[var(--color-neutral-900)] bg-white transition-fast focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary-light)]"
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-xs text-[var(--color-neutral-500)]">이메일</label>
                            <input
                                value={profile.email}
                                readOnly
                                className="h-10 px-3 rounded-[var(--radius-md)] border border-[var(--color-border)] text-sm text-[var(--color-neutral-500)] bg-[var(--color-neutral-50)] cursor-not-allowed"
                            />
                        </div>
                    </div>
                    <div className="flex items-center justify-between">
                        <button className="text-xs text-[var(--color-neutral-500)] underline underline-offset-2 hover:text-[var(--color-primary)] transition-fast">
                            비밀번호 변경하기
                        </button>
                        <Button variant="primary" size="md" onClick={handleSave} loading={saving}>변경사항 저장</Button>
                    </div>
                </div>
            </div>
        </Section>
    )
}

export default AccountSection