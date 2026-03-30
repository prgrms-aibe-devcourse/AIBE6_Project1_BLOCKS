'use client'

import { Section } from "@/components/common/Section"
import Button from "@/components/common/Button";
import { useAuth } from "@/components/providers/AuthProvider";

function AccountDangerSection() {
    const { user, logout } = useAuth()

    const handleDeleteAccount = async () => {
        if (!user) return; // user가 null일 경우 함수 종료

        if (confirm('정말 탈퇴하시겠습니까?')) {
            //탈퇴 로직 
            const res = await fetch('/api/delete-account', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.id }),
            })
            const data = await res.json()
            console.log('응답:', res.status, data)
            if (res.ok) {
                alert('계정이 성공적으로 삭제되었습니다.')
                await logout()
            } else {
                alert('계정 삭제 중 오류가 발생했습니다.')
            }
        }
    }
    return (
        <Section>
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-sm font-semibold text-[var(--color-neutral-900)]">계정 관리</h3>
                    <p className="text-xs text-[var(--color-neutral-500)] mt-0.5">탈퇴 시 모든 정보가 영구 삭제됩니다.</p>
                </div>
                <Button variant="outline" size="sm" className="text-red-500 border-red-200 hover:border-red-400 hover:text-red-600"
                    onClick={handleDeleteAccount}>
                    계정 삭제
                </Button>
            </div>
        </Section>
    )
}

export default AccountDangerSection
