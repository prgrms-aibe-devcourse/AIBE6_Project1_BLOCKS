import { useState } from "react"
import { Section } from "@/components/common/Section"
import { SectionHeader } from "@/components/common/SectionHeader"
import { Button } from "@/components/common/Button"

function AccountSection() {
    const [nickname, setNickname] = useState('FestaLover_KR')
    const [email] = useState('hello@festaplan.com')

    return (
        <Section>
            <SectionHeader title="계정 설정" />
            <div className="flex flex-col sm:flex-row gap-6 items-start">
                {/* Avatar */}
                <div className="flex flex-col items-center gap-1.5 shrink-0">
                    <div className="relative">
                        <div className="w-20 h-20 rounded-full overflow-hidden bg-[var(--color-neutral-200)] ring-2 ring-[var(--color-border)]">
                            <img
                                src="https://api.dicebear.com/7.x/adventurer/svg?seed=FestaLover"
                                alt="프로필"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <button className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center shadow-sm transition-fast hover:bg-[var(--color-primary-dark)]">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                                <path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                        </button>
                    </div>
                    <span className="text-[11px] text-[var(--color-neutral-500)]">프로필 이미지 수정</span>
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
                                value={email}
                                readOnly
                                className="h-10 px-3 rounded-[var(--radius-md)] border border-[var(--color-border)] text-sm text-[var(--color-neutral-500)] bg-[var(--color-neutral-50)] cursor-not-allowed"
                            />
                        </div>
                    </div>
                    <div className="flex items-center justify-between">
                        <button className="text-xs text-[var(--color-neutral-500)] underline underline-offset-2 hover:text-[var(--color-primary)] transition-fast">
                            비밀번호 변경하기
                        </button>
                        <Button variant="primary" size="md">변경사항 저장</Button>
                    </div>
                </div>
            </div>
        </Section>
    )
}

export default AccountSection