import { Section } from "@/components/common/Section"
import Button from "@/components/common/Button";

function AccountDangerSection() {
    return (
        <Section>
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-sm font-semibold text-[var(--color-neutral-900)]">계정 관리</h3>
                    <p className="text-xs text-[var(--color-neutral-500)] mt-0.5">탈퇴 시 모든 정보가 영구 삭제됩니다.</p>
                </div>
                <Button variant="outline" size="sm" className="text-red-500 border-red-200 hover:border-red-400 hover:text-red-600">
                    계정 삭제
                </Button>
            </div>
        </Section>
    )
}

export default AccountDangerSection
