/* ── Section Header ── */
export function SectionHeader({ title, action }: { title: string; action?: React.ReactNode }) {
    return (
        <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-semibold text-[var(--color-neutral-900)]">{title}</h2>
            {action}
        </div>
    )
}